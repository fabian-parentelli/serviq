import express from 'express';
import { client } from './config/serviq.config.js';

const app = express();
client.connect();

app.get('/', async (req, res) => {
    
    const result = await client.send('users', 'getUser', { id: 'a1' });
    console.log(result);

    res.send(result);
    
});

app.listen(3000, () => console.log('Gateway in port 3000'));