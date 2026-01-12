declare module 'serviq' {

    export interface Broker {
        init(): void;
    }

    export interface Client {
        connect(): void;
        send(to: string, pattern: string, data: any, cid?: string | null, res?: boolean): Promise<any>;
    }

    export interface TcpQueue {
        start(): void;
        onSuccess: (res: any) => void;
        onFaild: (err: any) => void;
    }

    export function tcpBroker(port?: number, queues?: string[]): Broker;
    export function tcpClient(port?: number, name: string): Client;
    export function tcpQueue(port: number, name: string, max?: number): TcpQueue;

    const _default: {
        tcpBroker: typeof tcpBroker;
        tcpClient: typeof tcpClient;
        tcpQueue: typeof tcpQueue;
    };

    export default _default;
}