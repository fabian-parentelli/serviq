import { client } from "./config/serviq.config.js";

client.connect();

client.onMessage = async (msg) => {
    try {

        console.log('ms_users: ', msg);


        // hacer Lógica.
        const user = { name: 'jaun', age: 27 };

        if (client.isRequest(msg.pattern)) {
            await client.send(msg.from, 'res', user, msg.cid);
        };

    } catch (error) {
        await client.send('BROKER', 'error', { originalMsg: msg, error: error.message }, msg.cid);
    };

};