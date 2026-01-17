import CodeCont from '../../../../../components/utils/CodeCont/CodeCont';
import './docIntro.css';

const DocIntro = () => {

    // if (data.message.includes('SQLite is an experimental feature')) return false;

    return (
        <div className="docIntro">
            <h2>Introducción</h2>

            <section className='flex-col'>
                <h4>Descripción general</h4>
                <p><span>Serviq</span> es un Message Broker de alto rendimiento y ultra-ligero, diseñado para orquestar la comunicación en arquitecturas de microservicios sin la complejidad de sistemas robustos. Su núcleo combina la agilidad de los <span>sockets TCP</span> nativos de Node.js con la fiabilidad de <span>SQLite (DatabaseSync)</span> para garantizar que ningún mensaje se pierda, incluso ante caídas críticas del sistema.</p>
                <p>A diferencia de otros brokers, Serviq implementa una <span>Persistencia Híbrida</span> organizada en un <span>Pool de Colas</span>. Cada mensaje se gestiona simultáneamente en memoria (RAM) para una entrega inmediata y en disco para seguridad. Esta estructura permite un "Sharding Local" que distribuye la carga de trabajo en múltiples archivos de base de datos independientes, optimizando el rendimiento de lectura y escritura.</p>
                <p>El sistema destaca por su <span>Resiliencia Activa</span>. Cuenta con un motor de reintentos inteligente basado en un backoff progresivo. Si un servicio destino falla, Serviq reintenta la entrega en intervalos crecientes. Si tras cinco intentos el mensaje no puede completarse, se mueve automáticamente a una <span>Dead Letter Queue (Cuarentena)</span>. Esto permite a los administradores auditar, eliminar o re-inyectar tareas fallidas a través de métodos de gestión integrados como <span>getFailedMessages</span> o <span>purgeAllQueues</span>.</p>
                <p>Con capacidades de <span>Heartbeat (Keep-Alive)</span> y protección contra datos corruptos, Serviq se posiciona como la solución ideal para desarrolladores que buscan un ecosistema de mensajería asíncrona rápido, persistente y fácil de administrar, manteniendo un consumo mínimo de recursos.</p>
            </section>

            <section className='flex-col'>
                <h4>Compatibilidad</h4>
                <p>Para garantizar la máxima velocidad sin dependencias externas, <span>Serviq</span> utiliza el módulo nativo <span>node:sqlite</span>. Esto impone los siguientes requisitos:</p>
                <ul>
                    <li><strong>Runtime:</strong> Node.js v22.5.0 o superior.</li>
                    <li><strong>Razón:</strong> Esta es la versión mínima que introduce DatabaseSync, permitiendo operaciones síncronas con SQLite que eliminan la latencia de las promesas en el ciclo de persistencia crítica del Broker.</li>
                    <li><strong>Sin Dependencias:</strong> Al requerir una versión moderna de Node.js, Serviq no necesita instalar sqlite3 ni better-sqlite3 vía NPM, reduciendo el tamaño de tu node_modules y evitando problemas de compilación de binarios (node-gyp).</li>
                </ul>
            </section>

            <section className='flex-col'>
                <h4>Notas de estabilidad</h4>
                <p>Aunque <span>node:sqlite</span> se considera una característica experimental en las versiones iniciales de la rama 22, Serviq incluye un supresor de advertencias nativo para mantener una consola limpia:</p>

                <CodeCont>
                    <p className='cod-green'>// Serviq maneja esto internamente por ti:</p>
                    <p><span className='cod-pink'>if (</span><span className='cod-skyblue'>data.message</span><span className='cod-skyyellow'>.includes</span><span className='cod-blue'>{'('}</span><span className='cod-red'>'SQLite is an experimental feature'</span><span className='cod-blue'>{')'}</span><span className='cod-pink'>{')'}</span> <span className='cod-pink'>return</span> <span className='cod-blue'>false</span>;</p>
                </CodeCont>
            </section>

        </div>
    );
};

export default DocIntro;

// Tengo que trabajar en pasar lo que queiro que copie
// Tengo que trabajar en pasar lo que queiro que copie
// Tengo que trabajar en pasar lo que queiro que copie
// Tengo que trabajar en pasar lo que queiro que copie
// Tengo que trabajar en pasar lo que queiro que copie