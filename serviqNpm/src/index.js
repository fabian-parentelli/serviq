import { Client } from './lib/tcpClient.js';
import { Broker } from './lib/broker.js';
import { TcpQueue } from './lib/tcpQueue.js';

function tcpBroker(port, queues) {
    return new Broker(port, queues);
};

function tcpClient(port, name) {
    return new Client(port, name);
};

function tcpQueue(port, name, max) {
    return new TcpQueue(port, name, max);
};

export default {
    tcpBroker,
    tcpClient,
    tcpQueue
};