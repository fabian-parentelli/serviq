import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const originalEmit = process.emit;
process.emit = function (name, data) {
    if (
        name === 'warning' && typeof data === 'object' && data.message.includes('SQLite is an experimental feature')
    ) return false;
    return originalEmit.apply(process, arguments);
};

class TcpPersistence {

    constructor(queueName) {
        const baseProjectDir = process.cwd();
        const queuesFolder = path.join(baseProjectDir, 'queues');
        if (!fs.existsSync(queuesFolder)) {
            fs.mkdirSync(queuesFolder, { recursive: true });
        };
        const dbFilePath = path.join(queuesFolder, `${queueName}.db`);
        this.connection = new DatabaseSync(dbFilePath);
        this._bootstrap();
    };

    _bootstrap() {
        this.connection.exec(`
            CREATE TABLE IF NOT EXISTS messages (
                cid TEXT PRIMARY KEY,
                target TEXT,
                payload TEXT,
                attempts INTEGER,
                next_run INTEGER
            )
        `);

        this.connection.exec(`
            CREATE TABLE IF NOT EXISTS dead_letter (
                cid TEXT PRIMARY KEY,
                target TEXT,
                payload TEXT,
                failed_at INTEGER
            )
        `);
    };

    save(msg) {
        const query = `
            INSERT INTO messages (cid, target, payload, attempts, next_run)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(cid) DO UPDATE SET
                attempts = excluded.attempts,
                next_run = excluded.next_run
        `;
        const stmt = this.connection.prepare(query);
        stmt.run(msg.cid, msg.to, JSON.stringify(msg), msg.attempts || 0, msg.nextRun || 0);
    };

    getAll() {
        const query = `SELECT payload FROM messages`;
        const stmt = this.connection.prepare(query);
        return stmt.all().map(row => JSON.parse(row.payload));
    };

    remove(cid) {
        const query = `DELETE FROM messages WHERE cid = ?`;
        const stmt = this.connection.prepare(query);
        stmt.run(cid);
    };

    moveToDeadLetter(msg) {
        const stmt = this.connection.prepare(`
        INSERT INTO dead_letter (cid, target, payload, failed_at)
        VALUES (?, ?, ?, ?)
    `);
        stmt.run(msg.cid, msg.to, JSON.stringify(msg), Date.now());
        this.remove(msg.cid);
    };

    getDeadLetter() {
        const query = `SELECT payload, failed_at FROM dead_letter`;
        const stmt = this.connection.prepare(query);
        return stmt.all().map(row => ({
            ...JSON.parse(row.payload),
            failedAt: row.failed_at
        }));
    };

    clearDeadLetter() {
        const query = `DELETE FROM dead_letter`;
        this.connection.prepare(query).run();
    };

    removeDeadLetter(cid) {
        const query = `DELETE FROM dead_letter WHERE cid = ?`;
        const stmt = this.connection.prepare(query);
        return stmt.run(cid);
    };

};

export { TcpPersistence };