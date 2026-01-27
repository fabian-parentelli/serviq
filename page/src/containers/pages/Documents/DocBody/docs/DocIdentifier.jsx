import CodeCont from '@/components/utils/CodeCont/CodeCont.jsx';

const DocIdentifier = () => {

    return (
        <div className="docBodyDiv">
            <h2>Anatomía del Payload</h2>

            <section className="flex-col">
                <h4>El Identificador de Correlación (cid)</h4>
                <p>En una arquitectura distribuida, los mensajes pueden viajar por múltiples servicios, quedar encolados en SQLite o ser reintentados minutos después. Para que el emisor sepa qué respuesta corresponde a qué petición, Serviq utiliza un Correlation ID (cid) único.</p>
            </section>

            <section className="flex-col">
                <h4>Estructura de un Mensaje Estándar</h4>
                <p>Cada vez que invocas <span>client.send()</span>, Serviq genera o propaga un objeto con la siguiente estructura:</p>

                <CodeCont lenguage='Json'>
                    <p>{'{'}</p>
                    <p>     <span className='cod-red'>"to"</span>: <span className='cod-skygreen'>"users"</span>,</p>
                    <p>     <span className='cod-red'>"from"</span>: <span className='cod-skygreen'>"gateway"</span>,</p>
                    <p>     <span className='cod-red'>"pattern"</span>: <span className='cod-skygreen'>"users_create"</span>,</p>
                    <p>     <span className='cod-red'>"data"</span>: {'{'} <span className='cod-red'>"nombre"</span>: <span className='cod-skygreen'>"Juan"</span>, <span className='cod-red'>"age"</span>: <span className='cod-skyblue'>30</span> {'}'},</p>
                    <p>     <span className='cod-red'>"cid"</span>: <span className='cod-skygreen'>"bba7dffd-17f1-49bb-a1cd-b632de0df7db"</span>,</p>
                    <p>{'}'}</p>
                </CodeCont>
            </section>

            <section className='flex-col'>
                <h4>¿Para que sirve el cid?</h4>
                <ul>
                    <li><strong>Resolución de Promesas:</strong> El <span>tcpClient</span> utiliza el <span>cid</span> para saber exactamente cuál <span>await</span> debe desbloquear cuando llega una respuesta del Broker. Sin él, el Gateway no sabría a qué cliente responder.</li>
                    <li><strong>Rastreo en Persistencia:</strong> Cuando revisas las bases de datos en <span>/queues</span>, el <span>cid</span> es la Primary Key. Esto te permite buscar un mensaje específico en la tabla de <span>messages</span> o en la <span>dead_letter</span>.</li>
                    <li><strong>Trazabilidad End-to-End:</strong> Puedes seguir el rastro de una operación a través de todos tus microservicios buscando el mismo <span>cid</span> en los logs de cada uno.</li>
                    <li><strong>Prevención de Duplicados:</strong> El Broker utiliza el <span>cid</span> en su <span>pendingTracker</span> para asegurar que un mensaje que está siendo reintentado no se procese dos veces si la respuesta llega justo a tiempo.</li>
                </ul>
            </section>

            <section className='flex-col'>
                <h4>Propagación de CID</h4>
                <p>Es una regla de oro en Serviq:</p>
                <p>"Si recibes un mensaje con un cid, cualquier respuesta o mensaje derivado de esa tarea debe incluir el mismo cid."</p>
                <p>Esto garantiza que el flujo nunca se rompa, incluso si el mensaje pasó 20 minutos en una cola de reintento.</p>
            </section>
        </div>
    );
};

export default DocIdentifier;