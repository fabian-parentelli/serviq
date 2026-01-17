import faress from "../faress.js";
import { client } from "./config.js";

const app = faress();
client.connect();

app.get('/', async (req, res) => {

    const result = await client.send('users', 'user_postUser', { _id: 1234 });
    console.log('gateway:', result);

    res.send(result);
});

app.listen(3000, () => console.log('Gateway en puerto 3000'));