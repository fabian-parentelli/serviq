import net from 'node:net';
import { randomUUID } from 'node:crypto';

class Client {

    constructor(port, name) {
        this.port = port || 4220;
        this.name = name;
        this.pendingRequests = new Map();
        this.socket = null;
        this.onMessage = null;
        this.reconnectTimeout = 3000;
        this.isConnected = false;
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
                }
                if (this.onMessage) this.onMessage(msg);
            } catch (e) {
                console.error("Error parsing JSON:", e.message);
            }
        });

        this.socket.on('error', (err) => {
            if (err.code === 'ECONNREFUSED') {
                this.isConnected = false;
            } else {
                console.error(`[${this.name}] Socket error:`, err.message);
            };
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

    send(to, pattern, data = {}, cid = null, res = true) {

        if (!this.socket || !this.socket.writable) {
            return Promise.reject(new Error("No connection"));
        };

        res = pattern.startsWith('res') ? false : res;
        const messageCid = cid || randomUUID();
        const payload = { to, from: this.name, pattern, data, cid: messageCid, res };

        if (!res) {
            this.socket.write(JSON.stringify(payload) + '\n');
            return Promise.resolve();
        };

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                if (this.pendingRequests.has(messageCid)) {
                    this.pendingRequests.delete(messageCid);
                    reject(new Error(`Timeout: No response from ${to}`));
                }
            }, 5000);

            this.pendingRequests.set(messageCid, (response) => {
                clearTimeout(timeout);
                resolve(response);
            });

            this.socket.write(JSON.stringify(payload) + '\n');
        }).catch(err => {
            throw err;
        });
    };

};

export { Client };