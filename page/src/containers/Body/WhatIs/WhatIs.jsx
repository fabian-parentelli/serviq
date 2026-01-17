import './whatIs.css';
import { Icons } from 'fara-comp-react';

const WhatIs = () => {

    return (
        <div id="whatIs">
            <h2>¿Qué es Serviq?</h2>

            <section className='flex-col whatIsPar'>
                <p>Serviq es un Broker de mensajería TCP diseñado para arquitecturas de microservicios que requieren alta velocidad, persistencia garantizada y reintentos inteligentes, todo sin la complejidad de configurar grandes infraestructuras como RabbitMQ o Kafka.</p>

                <p>Está construido nativamente sobre Node.js, aprovechando el rendimiento de los sockets TCP y la velocidad de SQLite (DatabaseSync) para la persistencia en disco.</p>
            </section>

            <section className='whatIsSect'>
                <div>
                    <h4>Resiliencia Nativa</h4>
                    <p>Si un servicio falla, Serviq no descarta el mensaje. Lo retiene y aplica un reintento progresivo hasta confirmar el éxito.</p>
                    <Icons type='replace' color='#00cfff' />
                </div>

                <div>
                    <h4>Balanceo Inteligente</h4>
                    <p>Distribuye la carga de trabajo automáticamente entre tus instancias disponibles para evitar cuellos de botella.</p>
                    <Icons type='direction' color='#00cfff' />
                </div>

                <div>
                    <h4>Persistencia en el Borde</h4>
                    <p>Utiliza almacenamiento SQLite local para asegurar que los mensajes sobrevivan incluso a un reinicio del sistema.</p>
                    <Icons type='database' color='#00cfff' />
                </div>
            </section>

            <section className='flex-col whatIsPar'>
                <p><span>Arquitectura Desacoplada:</span> Tus servicios no necesitan saber dónde están los demás; el Broker se encarga de la ruta.</p>

                <p><span>Protocolo de Carril Rápido:</span> Identifica automáticamente consultas críticas (GET) para entrega inmediata y procesos pesados (POST/PUT) para gestión por colas.</p>

                <p><span>Tolerancia a Fallos:</span> Diseñado bajo el principio de que los sistemas fallan. Serviq gestiona los errores, permitiendo que tu aplicación siga funcionando.</p>
            </section>

            <img src="/scheme.png" alt="img" />
        </div>
    );
};

export default WhatIs;