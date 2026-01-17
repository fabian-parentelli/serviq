import net from 'node:net';
import { randomUUID } from 'node:crypto';

class Client {

    constructor(name, port, requestTimeout = 5000) {
        this.port = port || 4220;
        this.name = name;
        this.pendingRequests = new Map();
        this.socket = null;
        this.onMessage = null;
        this.reconnectTimeout = 3000;
        this.isConnected = false;
        this.requestTimeout = requestTimeout
    };

    connect() {

        this.socket = net.createConnection({ port: this.port }, () => {
            this.isConnected = true;
            const registration = JSON.stringify({ type: 'REGISTER', name: this.name });
            this.socket.write(registration + '\n');
        });

        this.socket.on('data', (buffer) => {
            try {
                const msg = JSON.parse(buffer.toString());
                const { cid, data } = msg;
                const resolve = this.pendingRequests.get(cid);

                if (resolve) {
                    resolve(data);
                    this.pendingRequests.delete(cid);
                    return;
                };

                if (this.onMessage) this.onMessage(msg);
            } catch (error) {
                console.error("Error parsing JSON:", error.message);
            };
        });

        this.socket.on('error', (err) => {
            if (err.code === 'ECONNREFUSED') this.isConnected = false;
            else console.error(`[${this.name}] Socket error:`, err.message);
        });

        this.socket.on('close', () => {
            this.isConnected = false;
            console.warn(`[${this.name}] Connection closed. Cleaning pending requests...`);
            for (const [cid, resolve] of this.pendingRequests) {
                this.pendingRequests.delete(cid);
            };
            setTimeout(() => this.connect(), this.reconnectTimeout);
        });
    };

    isRequest(pattern) {
        const exceptions = ['res', 'on', 'error'];
        const path = pattern.includes('_') ? pattern.split('_')[1] : pattern;
        return !exceptions.some(ext => path.startsWith(ext));
    };

    send(to, pattern, data, cid = null) {

        if (!this.socket || !this.socket.writable) return Promise.reject(new Error("No connection"));

        const exceptions = ['res', 'on', 'error'];
        const path = pattern.includes('_') ? pattern.split('_')[1] : pattern;
        const expectResponse = !exceptions.some(ext => path.startsWith(ext));

        cid ||= randomUUID();
        const payload = { to, from: this.name, pattern, data, cid };

        if (!expectResponse) {
            this.socket.write(JSON.stringify(payload) + '\n');
            return Promise.resolve();
        };

        return new Promise((resolve, reject) => {

            const timeout = setTimeout(() => {
                if (this.pendingRequests.has(cid)) {
                    this.pendingRequests.delete(cid);
                    reject(new Error(`Timeout: No response from ${to} for pattern ${pattern}`));
                };
            }, this.requestTimeout);

            this.pendingRequests.set(cid, (response) => {
                clearTimeout(timeout);
                resolve(response);
            });

            this.socket.write(JSON.stringify(payload) + '\n');

        }).catch(err => { throw err; });
    };
};

export { Client };