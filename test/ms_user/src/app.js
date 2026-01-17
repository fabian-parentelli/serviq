import serviq from '../../../serviqNpm/src/index.js';

export const client = serviq.tcpClient('users');
client.connect();

let isError = true;

setTimeout(() => {
    isError = false;
    console.log("\x1b[32m[Servicio] El error se ha solucionado, listo para procesar.\x1b[0m");
}, 35000);

client.onMessage = async (msg) => {

    try {
        
        // await client.send('products', 'onProduct', { type: 'technology' });
        
        if (isError) {
            throw new Error('Error temporal activo');
        };
        
        // Lógica de negocio
        const user = { name: 'jaun', age: 27 };

        if (client.isRequest(msg.pattern)) {
            await client.send(msg.from, 'res', user, msg.cid);
        };

    } catch (error) {
        // Informamos al broker.
        console.log('entro al error');
        
        await client.send('BROKER', 'error', { originalMsg: msg, error: error.message }, msg.cid);
    };

};