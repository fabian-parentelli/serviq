import serviq from 'serviq';

export const client = serviq.tcpClient(4000, 'gateway');