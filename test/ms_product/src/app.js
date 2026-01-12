import serviq from 'serviq';
import * as productService from './service.js';

export const client = serviq.tcpClient(4000, 'ms_product');
client.connect();

client.onMessage = async (msg) => {
    
    const { pattern, data, from, cid } = msg;

    if (!cid) return await productService[pattern](data);

    try {
        const result = await productService[pattern](data);
        
        if (!result || result.status === 'error') {
            return client.send(from, 'res', result || { status: 'error' }, cid);
            // Para que vuelva a la cola es importante que su status sea error.
        };

        client.send(from, 'res', result, cid);
    } catch (error) {
        console.log(error);
        client.send(from, 'res', { status: 'error', message: error.message }, cid);
    };

};