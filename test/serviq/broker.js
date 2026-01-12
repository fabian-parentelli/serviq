import serviq from 'serviq';

const broker = serviq.tcpBroker(4000, ['queue_a', 'queue_b']);
broker.init();