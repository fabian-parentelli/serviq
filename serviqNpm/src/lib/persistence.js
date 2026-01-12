import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const originalEmit = process.emit;
process.emit = function (name, data) {
    if (
        name === 'warning' &&
        typeof data === 'object' &&
        data.message.includes('SQLite is an experimental feature')
    ) {
        return false;
    }
    return originalEmit.apply(process, arguments);
};

class Persistence {

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
            CREATE TABLE IF NOT EXISTS pending (
                cid TEXT PRIMARY KEY,
                pattern TEXT,
                data TEXT,
                attempts INTEGER DEFAULT 0,
                nextRun INTEGER,
                target TEXT
            );
            CREATE TABLE IF NOT EXISTS dlq (
                cid TEXT PRIMARY KEY,
                pattern TEXT,
                data TEXT,
                error TEXT,
                timestamp INTEGER
            );
        `);
    };

    getAll(tableName) {
        if (!['pending', 'dlq'].includes(tableName)) {
            throw new Error('Invalid table name. Use "pending" or "dlq".');
        };

        const query = this.connection.prepare(`SELECT * FROM ${tableName}`);
        const rows = query.all();

        return rows.map(row => ({
            ...row,
            data: JSON.parse(row.data)
        }));
    };

    deleteById(tableName, cid) {
        if (!['pending', 'dlq'].includes(tableName)) {
            throw new Error('Invalid table name');
        };
        const query = this.connection.prepare(`DELETE FROM ${tableName} WHERE cid = ?`);
        return query.run(cid);
    };

    clearTable(tableName) {
        if (!['pending', 'dlq'].includes(tableName)) {
            throw new Error('Invalid table name');
        };
        return this.connection.exec(`DELETE FROM ${tableName}`);
    };

    savePending(msg, nextRun) {
        const query = this.connection.prepare(`
            INSERT OR REPLACE INTO pending (cid, pattern, data, attempts, nextRun, target)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        query.run(msg.cid, msg.pattern, JSON.stringify(msg.data), msg.attempts || 1, nextRun, msg.data._originalTo);
    };

    getReadyToRetry() {
        const now = Date.now();
        const query = this.connection.prepare(`SELECT * FROM pending WHERE nextRun <= ?`);
        return query.all(now).map(row => ({ ...row, data: JSON.parse(row.data) }));
    };

    updateAttempt(cid, attempts, nextRun) {
        const query = this.connection.prepare(`UPDATE pending SET attempts = ?, nextRun = ? WHERE cid = ?`);
        query.run(attempts, nextRun, cid);
    };

    moveToDLQ(msg, error) {
        this.deleteById('pending', msg.cid);
        const query = this.connection.prepare(`
            INSERT INTO dlq (cid, pattern, data, error, timestamp)
            VALUES (?, ?, ?, ?, ?)
        `);
        query.run(msg.cid, msg.pattern, JSON.stringify(msg.data), error, Date.now());
    };

};

export { Persistence };