import serviq from 'serviq';

const queue_a = serviq.tcpQueue(4000, 'queue_a');
const queue_b = serviq.tcpQueue(4000, 'queue_b');

queue_a.start();
queue_b.start();

// Cola A
queue_a.onSuccess = (res) => {
    console.log('La cola terminó la ejecución');
    console.log(res);
};

queue_a.onFaild = (err) => {
    console.log('Límite de ejecucuones superada');
    console.log(err);
};

// Cola B
queue_a.onSuccess = (res) => {
    console.log('La cola terminó la ejecución');
    console.log(res);
};

queue_a.onFaild = (err) => {
    console.log('Límite de ejecucuones superada');
    console.log(err);
};