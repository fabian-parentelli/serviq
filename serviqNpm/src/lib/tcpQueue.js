import serviq from "../index.js";
import { Persistence } from "./persistence.js";

class TcpQueue {

    constructor(port, name, max = 5) {
        this.name = name;
        this.client = serviq.tcpClient(port, name);
        this.MAX_ATTEMPTS = max;
        this.storage = new Persistence(name);
        this.onSuccess = null;
        this.onFaild = null;
    };

    async start() {
        this.client.connect();
        this.client.onMessage = async (msg) => {
            try {
                const response = await this.client.send(msg.data._originalTo, msg.pattern, msg.data, msg.cid);

                if (response && response.status === 'error') {
                    throw new Error(`Logical error in ${msg.data._originalTo}`);
                };
                if (msg.res !== false) await this.client.send(msg.data._originalFrom, 'res', response, msg.cid);
            } catch (error) {
                const nextRun = Date.now() + 5000;
                this.storage.savePending({ ...msg, attempts: 1 }, nextRun);
                await this.client.send(msg.data._originalFrom, 'res', { status: 'pending' }, msg.cid);
            };
        };

        setTimeout(() => { this._retryCron() }, 2000);
    };

    async _retryCron() {

        const readyToProcess = this.storage.getReadyToRetry();
        if (readyToProcess.length === 0) {
            return setTimeout(() => this._retryCron(), 5000);
        };

        const brokenServices = new Set();

        for (const work of readyToProcess) {
            const target = work.target || (work.data && work.data._originalTo);
            if (brokenServices.has(target)) continue;

            try {
                if (!this.client.socket || !this.client.socket.writable) {
                    throw new Error("Target service disconnected");
                };

                const response = await this.client.send(target, work.pattern, work.data, work.cid);

                if (response && response.status === 'error') {
                    throw new Error("Logical error during retry");
                };

                this.storage.deleteById('pending', work.cid);

                if (work.res !== false && typeof this.onSuccess === 'function') {
                    this.onSuccess({ target, pattern: work.pattern, data: response, cid: work.cid });
                };

            } catch (error) {
                brokenServices.add(target);
                const nextAttempt = work.attempts + 1;

                if (nextAttempt > this.MAX_ATTEMPTS) {
                    this.storage.moveToDLQ(work, "Max attempts reached or Service down");
                    if (typeof this.onFaild === 'function') {
                        this.onFaild({ target, pattern: work.pattern, data: work.data, cid: work.cid, });
                    };

                } else {
                    const delay = Math.pow(2, nextAttempt) * 2500;
                    const nextRun = Date.now() + delay;
                    this.storage.updateAttempt(work.cid, nextAttempt, nextRun);
                };
            };
        };

        setTimeout(() => this._retryCron(), 5000);
    };

    async getMessages(tableName) {
        return this.storage.getAll(tableName);
    };

    async deleteMessage(tableName, cid) {
        return this.storage.deleteById(tableName, cid);
    };

    async clearAll(tableName) {
        return this.storage.clearTable(tableName);
    };

};

export { TcpQueue };