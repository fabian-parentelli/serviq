import { Client } from './lib/tcpClient.js';
import { Broker } from './lib/broker.js';

function tcpBroker(port, queues) {
    return new Broker(port, queues);
};

function tcpClient(port, name) {
    return new Client(port, name);
};


export default {
    tcpBroker,
    tcpClient
};