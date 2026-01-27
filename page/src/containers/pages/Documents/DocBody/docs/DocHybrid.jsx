import CodeCont from '@/components/utils/CodeCont/CodeCont.jsx';

const DocHybrid = () => {

    return (
        <div className="docBodyDiv">
            <h2>Persistencia Híbrida</h2>

            <section className="flex-col">
                <h4>La carpeta /queues</h4>
                <p>A diferencia de otros sistemas que requieren un servidor de base de datos externo, Serviq utiliza una persistencia híbrida. Esto significa que los mensajes viven en la memoria para mayor velocidad, pero se respaldan instantáneamente en archivos locales de <span>SQLite</span>.</p>
            </section>

            <section className="flex-col">
                <h4>Estructura de archivos</h4>
                <p>Al iniciar el Broker, Serviq crea automáticamente una carpeta en la raíz de tu proyecto:</p>
                <CodeCont lenguage="Plaintext">
                    <p>{`mi-proyecto/
├── queues/               <-- Creada automáticamente por Serviq
│   ├── queue_0.db        <-- Base de datos SQLite síncrona
│   ├── queue_1.db
│   └── queue_n.db
├── broker.js
└── package.json`}</p>
                </CodeCont>
            </section>

            <section className='flex-col'>
                <h4>¿Por qué múltiples archivos .db?</h4>
                <p>Serviq utiliza un Pool de Queues (por defecto 3). Esto permite:</p>
                <ul>
                    <li><strong>scalabilidad:</strong> El Broker reparte los mensajes entre los archivos usando un algoritmo Round-Robin.</li>
                    <li><strong>Rendimiento:</strong> Al no tener un solo archivo gigante, las operaciones de lectura/escritura de SQLite son mucho más rápidas y reducen el bloqueo del archivo.</li>
                </ul>
            </section>

            <section className='flex-col'>
                <h4>Anatomía interna de una Queue</h4>
                <p>Cada archivo <span>.db</span> contiene dos tablas fundamentales que puedes auditar con cualquier visor de SQLite:</p>
                <ul>
                    <li><strong>messages:</strong> Aquí residen los mensajes pendientes. Se guardan con su cid, el target (destino), el payload completo y el cálculo del next_run (cuándo toca el próximo reintento).</li>
                    <li><strong>dead_letter:</strong> El cementerio de mensajes. Si un mensaje agota sus 5 intentos, se mueve aquí automáticamente con la marca de tiempo failed_at.</li>
                </ul>
            </section>

            <section className='flex-col'>
                <h4>Estabilidad</h4>
                <p><strong>Cero Corrupción:</strong> Serviq utiliza la librería nativa <span>node:sqlite</span> (DatabaseSync), garantizando que los datos se escriban físicamente en el disco antes de confirmar el encolado.</p>
                <p><strong>Portabilidad:</strong> Puedes mover la carpeta <span>/queues</span> a otro servidor y, al iniciar el Broker, este reconocerá automáticamente todos los mensajes pendientes y reanudará los reintentos.</p>
                <p><strong>Consejo de Producción:</strong> No borres manualmente los archivos dentro de /queues a menos que desees resetear el sistema. Para una limpieza segura, utiliza siempre el método <span>broker.purgeAllQueues()</span>.</p>
            </section>
        </div>
    );
};

export default DocHybrid;