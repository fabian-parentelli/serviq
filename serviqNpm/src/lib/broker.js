import net from 'node:net';
import { EventEmitter } from 'node:events';
import { TcpQueue } from './tcpQueue.js';

class Broker extends EventEmitter {

    constructor(port, queueCount = 3) {
        super();
        this.port = port || 4220;
        this.clients = new Map();
        this.server = null;
        this.pendingTracker = new Map();

        this.queueIndex = 0;
        this.queuePool = Array.from({ length: queueCount }, (_, i) => {
            const queueName = `queue_${i}`;
            return new TcpQueue(queueName);
        });
        this.retryTimer = null;
    };

    init() {

        this.server = net.createServer((socket) => {

            socket.setKeepAlive(true, 60000);
            let clientName = null;

            socket.on('data', (buffer) => {
                const rawData = buffer.toString();
                const messages = rawData.split('\n').filter(line => line.trim() !== '');
                for (const content of messages) {
                    try {
                        const msg = JSON.parse(content);

                        if (msg.type === 'REGISTER') {
                            clientName = msg.name;
                            if (!clientName) return console.error("Registration rejected: name missing");
                            const existingSocket = this.clients.get(clientName);
                            if (existingSocket) {
                                console.log(`\x1b[33m[${clientName}] already exists. Replacing connection...\x1b[0m`);
                                existingSocket.destroy();
                            };
                            this.clients.set(clientName, socket);
                            console.log(`\x1b[32m[${clientName}] registered\x1b[0m`);
                            this._flushQueueByService(clientName, socket);
                            continue;
                        };

                        if (msg.to === 'BROKER') return this._handleInternalControl(msg);

                        const target = this.clients.get(msg.to);

                        if (target && target.writable) {
                            target.write(JSON.stringify(msg) + '\n');
                            const retryCount = this.pendingTracker.get(msg.cid);

                            if (msg.pattern.startsWith('res') && retryCount > 0) {
                                msg.attempts = retryCount
                                this.emit('taskComplete', msg);
                                this.pendingTracker.delete(msg.cid);
                                for (const queue of this.queuePool) {
                                    queue.persistence.remove(msg.cid);
                                };
                            };

                        } else this._handleError(socket, msg);

                    } catch (error) {
                        socket.destroy();
                        console.error("Error parsing JSON:", error.message);
                    };
                };
            });

            socket.on('close', () => {
                if (clientName) {
                    this.clients.delete(clientName);
                    console.log(`[${clientName}] disconnect`);
                };
            });

            socket.on('error', (err) => {
                if (clientName) {
                    console.error(`Error in socket [${clientName}]:`, err.message);
                };
            });

        });

        this.server.listen(this.port, () => {
            console.log(`\x1b[34mBroker in port ${this.port}\x1b[0m`);
        });
    };

    _handleError(socket, originalMsg) {

        const canPersist = this._isPersistable(originalMsg.pattern);
        if (canPersist) this._persistMessage(originalMsg);

        if (this._isRequest(originalMsg.pattern) && originalMsg.from && originalMsg.cid) {
            const errorPayload = {
                to: originalMsg.from,
                from: 'BROKER',
                pattern: 'res',
                data: {
                    status: canPersist ? 'pending' : 'error',
                    message: canPersist
                        ? `Target ${originalMsg.to} offline. Message enqueued.`
                        : `Target ${originalMsg.to} offline. GET requests are not enqueued.`
                },
                cid: originalMsg.cid
            };
            if (socket.writable) socket.write(JSON.stringify(errorPayload) + '\n');
        };
    };

    _handleInternalControl(msg) {
        if (msg.pattern === 'error') {
            const { originalMsg, error } = msg.data;

            const savedAttempts = this.pendingTracker.get(originalMsg.cid);
            if (savedAttempts !== undefined) originalMsg.attempts = savedAttempts;
            this.pendingTracker.delete(originalMsg.cid);

            const canPersist = this._isPersistable(originalMsg.pattern);
            if (canPersist) this._persistMessage(originalMsg);

            if (this._isRequest(originalMsg.pattern)) {
                const pendingResponse = {
                    to: originalMsg.from,
                    from: 'BROKER',
                    pattern: 'res',
                    data: {
                        status: canPersist ? 'pending' : 'error',
                        message: canPersist ? `Pending task.` : error
                    },
                    cid: originalMsg.cid
                };
                const emitter = this.clients.get(originalMsg.from);
                if (emitter) emitter.write(JSON.stringify(pendingResponse) + '\n');

            };
        };
    };

    _isRequest(pattern) {
        const exceptions = ['res', 'on', 'error'];
        const path = pattern.includes('_') ? pattern.split('_')[1] : pattern;
        return !exceptions.some(ext => path.startsWith(ext));
    };

    _persistMessage(msg) {
        const selectQueue = this.queuePool[this.queueIndex];
        msg.attempts = (msg.attempts || 0) + 1;
        if (msg.attempts > 5) {
            selectQueue.persistence.moveToDeadLetter(msg);
            this.emit('taskFailed', msg);
            return;
        };
        const delays = { 1: 0, 2: 10 * 60000, 3: 15 * 60000, 4: 20 * 60000, 5: 25 * 60000 };
        const delay = delays[msg.attempts] || 0;
        msg.nextRun = Date.now() + delay;
        selectQueue.push(msg);
        this._startRetryEngine();
        this.queueIndex = (this.queueIndex + 1) % this.queuePool.length;
    };

    _isPersistable(pattern) {
        if (!pattern) return false;
        const action = pattern.includes('_') ? pattern.split('_')[1] : pattern;
        if (action.toLowerCase().startsWith('get')) return false;
        return true;
    };

    _flushQueueByService(clientName, socket) {
        if (!socket || !socket.writable) return;
        let totalDelivered = 0;
        for (const queue of this.queuePool) {
            const pending = queue.getByService(clientName);
            for (const msg of pending) {
                const success = socket.write(JSON.stringify(msg) + '\n');
                if (success) totalDelivered++;
                else this._persistMessage(msg);
            };
        };

        if (totalDelivered > 0) {
            console.log(`\x1b[35m[Broker] Re-delivered ${totalDelivered} messages to ${clientName}\x1b[0m`);
        };
    };

    _startRetryEngine() {
        if (this.retryTimer) return;
        this.retryTimer = setInterval(() => {
            let hasPendingWork = false;
            for (const queue of this.queuePool) {
                if (queue.messages.length > 0) {
                    hasPendingWork = true;
                    this._processQueueRetry(queue);
                };
            };
            if (!hasPendingWork) {
                clearInterval(this.retryTimer);
                this.retryTimer = null;
            };
        }, 30000);
    };

    _processQueueRetry(queue) {
        const now = Date.now();

        for (let i = 0; i < queue.messages.length; i++) {
            const msg = queue.messages[i];

            if (now >= msg.nextRun) {
                const targetSocket = this.clients.get(msg.to);

                if (targetSocket && targetSocket.writable) {
                    queue.messages.splice(i, 1);
                    i--;
                    queue.persistence.remove(msg.cid);

                    this.pendingTracker.set(msg.cid, msg.attempts);
                    const { storedIn, nextRun, ...cleanMsg } = msg;
                    targetSocket.write(JSON.stringify(cleanMsg) + '\n');
                };
            };
        };
    };

    getQueuesStatus() {
        const stats = {
            totalQueues: this.queuePool.length,
            activeClients: Array.from(this.clients.keys()),
            pendingRetriesInTracker: this.pendingTracker.size,
            queues: this.queuePool.map(q => q.getSummary())
        };
        return stats;
    };


    getFailedMessages() {
        const allFailed = [];
        for (const queue of this.queuePool) {
            if (!queue.persistence) continue;
            const failedInQueue = queue.persistence.getDeadLetter();
            if (Array.isArray(failedInQueue) && failedInQueue.length > 0) {
                allFailed.push({
                    queueId: queue.id,
                    total: failedInQueue.length,
                    messages: failedInQueue
                });
            };
        };
        return allFailed.length > 0 ? allFailed : null;
    };

    deleteFailedMessage(cid) {
        let deleted = false;
        for (const queue of this.queuePool) {
            const result = queue.persistence.removeDeadLetter(cid);
            if (result.changes > 0) {
                deleted = true;
                break;
            };
        }
        return deleted;
    };

    purgeAllQueues() {
        for (const queue of this.queuePool) {
            queue.messages = [];
            queue.persistence.clearMessages();
            queue.persistence.clearDeadLetter();
        };
        this.pendingTracker.clear();
        if (this.retryTimer) {
            clearInterval(this.retryTimer);
            this.retryTimer = null;
        };
        return { status: 'purged', timestamp: Date.now() };
    };

};

export { Broker };