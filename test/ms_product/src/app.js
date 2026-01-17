import serviq from '../../../serviqNpm/src/index.js';

export const client = serviq.tcpClient('products');
client.connect();

client.onMessage = async (msg) => {

    try {
        // Lógica de negocio
        const product = { name: 'pc-gamer', price: 1200 };

        // throw new Error('saltamos al error');

        if (client.isRequest(msg.pattern)) {
            await client.send(msg.from, 'res', product, msg.cid);
        };

    } catch (error) {
        // Informamos al broker.
        await client.send('BROKER', 'error', { originalMsg: msg, error: error.message }, msg.cid);
    };

};