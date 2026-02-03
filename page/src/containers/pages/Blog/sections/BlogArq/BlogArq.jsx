import './blogArq.css';
import CodeCont from '@/components/utils/CodeCont/CodeCont.jsx';

const BlogArq = () => {

    return (
        <div className="blogArq">
            <h3>El Corazón de tu Backend: Cómo estructurar microservicios con Serviq</h3>
            <p>Implementar una arquitectura de microservicios no tiene por qué ser un caos. Aunque cada proyecto es un mundo, queremos proponerte una arquitectura de referencia diseñada para aprovechar al máximo las capacidades de Serviq (nuestro Broker TCP con persistencia inteligente).</p>
            <p>Para este ejemplo, dividiremos nuestro proyecto en tres grandes pilares:</p>

            <section>
                <h4>1. Gateway: La Puerta de Enlace</h4>
                <p>Es el único punto de contacto con el mundo exterior (el Frontend). Su responsabilidad es doble:</p>
                <ul>
                    <li><strong>Traducción de Protocolos:</strong> Recibe peticiones HTTP (mediante Express, Fastify, etc.) y las traduce al protocolo TCP de Serviq.</li>
                    <li><strong>Enrutamiento Inteligente:</strong> Actúa como un intermediario. Recibe la solicitud del cliente, la envía al microservicio correspondiente mediante el método send de Serviq y, una vez obtenida la respuesta, se la entrega al usuario.</li>
                    <li><strong>Seguridad:</strong> Es el lugar ideal para validar tokens (JWT) antes de que la petición entre al ecosistema de microservicios.</li>
                </ul>
            </section>

            <section>
                <h4>2. Nodo Serviq: El Broker y la Persistencia</h4>
                <p>Esta es la central de inteligencia. Aquí es donde vive el proceso del Broker y donde gestionamos la resiliencia del sistema:</p>
                <ul>
                    <li><strong>Gestión de Colas:</strong> Aquí se crean automáticamente las bases de datos SQLite (.db) para cada cola de persistencia.</li>
                    <li><strong>Monitoreo de Mensajes:</strong> Gracias a los hooks taskComplete y taskFailed, desde esta sección puedes orquestar alertas. Si un mensaje se concreta tras varios reintentos o si finalmente "muere" (va a la DLQ), aquí es donde te enteras para avisar a tu sistema de logs o alertas.</li>
                    <li><strong>Tráfico:</strong> Administra qué mensajes van por el "carril rápido" y cuáles deben asegurarse en disco si un servicio está caído.</li>
                </ul>
            </section>

            <section>
                <h4>3. Servicios (Microservicios de Negocio)</h4>
                <p>Son los especialistas. Cada carpeta representa un servicio independiente (ej: ms_users, ms_payments):</p>
                <ul>
                    <li><strong>Identidad:</strong> Al arrancar, el servicio le indica a Serviq quién es para empezar a recibir tráfico.</li>
                    <li><strong>Sub-enrutamiento:</strong> Dependiendo del "pattern" (patrón) que reciba, el servicio redirige la tarea internamente al módulo correcto.</li>
                    <li><strong>Contratos de Respuesta:</strong> Según la necesidad, el servicio devuelve un objeto de éxito, un status: 'error' para disparar la lógica de reintento de la cola, o simplemente procesa la tarea en segundo plano sin devolver respuesta.</li>
                </ul>
            </section>

            <section className='blogArqCode'>
                <CodeCont lenguage="Plaintext">
                    <p>{`mi-proyecto/
    ├── gateway               
    │   ├── node_modules
    │   ├── package.jsons
    │   └── src
    │       ├── serviq.config.js   
    │       └── app.js
    ├── serviq     
    │   ├── package.jsons
    │   ├── src
    │   │   └── app.js
    │   └── queues
    │       ├── queue_0.db
    │       ├── queue_1.db   
    │       └── queue_2.db
    ├── ms_users
    │   ├── node_modules
    │   ├── package.jsons
    │   └── src
    │       ├── serviq.config.js   
    │       └── app.js
    └── start.sh`}</p>
                </CodeCont>
            </section>
        </div>
    );
};

export default BlogArq;