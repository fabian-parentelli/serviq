import serviq from 'fara-serviq';

const broker = serviq.tcpBroker(4220, 3);

broker.init();