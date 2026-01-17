import serviq from '../../serviqNpm/src/index.js';

const broker = serviq.tcpBroker(4220);
broker.init();

broker.on('taskComplete', (msg) => {
    console.log('Mesnaje completado con éxito, creemos una lógica que haga algo con el');
    console.log(msg);
});

broker.on('taskFailed', (msg) => {
    console.log('Son los mensajes que superaron 5 intentos, por lo que se da por muerto los reintentos');
    console.log(msg);
    // En caso de agotamiento
    // - Dar aviso
    // - Crear un db de quarantine (Permitiendo hacer algo con esto al admin).
});

setInterval(() => {
    console.log('\n--- ESTADO DE LAS COLAS ---');
    const status = broker.getQueuesStatus();
    console.log(status);
    // console.log(status.queues);
    // esto es solo para ver el estado de las colas.

}, 10000);


// Esto muestra la tabla muerta
const errores = broker.getFailedMessages();

broker.deleteFailedMessage(cid) // Esto elimina un mensaje en particular ...

broker.purgeAllQueues() // Esto limpia todas las colas ...