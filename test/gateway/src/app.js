import faress from "../faress.js";
import { client } from "./config.js";

const app = faress();

// Cliente para conectarse con los servicios.
client.connect();

app.get('/', async (req, res) => {

    const result = await client.send('ms_product', 'postProduct', { _id: 1234 });

    res.send(result);
});

app.listen(3000, () => console.log('Gateway en puerto 3000'));