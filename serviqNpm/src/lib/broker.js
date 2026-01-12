import net from 'node:net';

class Broker {

    constructor(port, queues) {
        this.port = port || 4220;
        this.clients = new Map();
        this.server = null;
        this.queues = queues;
        this.index = 0;
    };

    init() {

        this.server = net.createServer((socket) => {
            let clientName = null;

            socket.on('data', (buffer) => {
                const rawData = buffer.toString();
                const messages = rawData.split('\n').filter(line => line.trim() !== '');

                for (const content of messages) {
                    try {
                        const msg = JSON.parse(content);
                        if (msg.type === 'REGISTER') {
                            clientName = msg.name;
                            if (!clientName) {
                                console.log("Registration rejected: name missing");
                                continue;
                            };
                            this.clients.set(clientName, socket);
                            console.log(`\x1b[32m[${clientName}] registered\x1b[0m`);
                            continue;
                        };

                        const isReadOrResponse = msg.pattern.startsWith('get') || msg.pattern.startsWith('res') || msg.pattern.startsWith('on');
                        const comesFromQueue = msg.from.startsWith('queue');

                        if (!isReadOrResponse && !comesFromQueue) {
                            
                            let queueName = null;
                            if (this.queues && this.queues.length > 0) {
                                queueName = this.queues[this.index];
                                this.index = (this.index + 1) % this.queues.length;
                            } else {
                                console.error("\x1b[31m[Broker] Error: No queues available for balancing\x1b[0m");
                                return;
                            };

                            if (typeof msg.data !== 'object' || msg.data === null) {
                                msg.data = { value: msg.data };
                            };

                            msg.data._originalTo = msg.to;
                            msg.data._originalFrom = msg.from;
                            msg.to = queueName;
                        };
                        const targetSocket = this.clients.get(msg.to);
                        if (targetSocket && targetSocket.writable) {
                            targetSocket.write(JSON.stringify(msg) + '\n');
                        } else {
                            this._handleError(socket, msg, `Server ${msg.to} not found`);
                        };
                        
                    } catch (e) {
                        console.error("Error parsing JSON:", e.message);
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

        this.server.listen(this.port, '0.0.0.0', () => {
            console.log(`\x1b[34mBroker in port ${this.port}\x1b[0m`);
        });
    };

    _handleError(socket, originalMsg, reason) {
        if (originalMsg.from && originalMsg.cid) {
            const errorPayload = {
                to: originalMsg.from,
                from: 'BROKER',
                pattern: 'error',
                data: { error: reason },
                cid: originalMsg.cid
            };
            socket.write(JSON.stringify(errorPayload) + '\n');
        };
        console.log(`Failed routing: ${reason}`);
    };
};

export { Broker };