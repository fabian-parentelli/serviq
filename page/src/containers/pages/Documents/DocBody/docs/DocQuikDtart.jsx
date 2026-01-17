import CodeCont from '@/components/utils/CodeCont/CodeCont.jsx';

const DocQuikDtart = () => {

    return (
        <div className="docBodyDiv">
            <h2>Inicio rápido</h2>

            <section className='flex-col'>
                <h4>Inicialización del Broker</h4>
                <p>El Broker es el nodo central. Solo necesitas definir el puerto y, opcionalmente, la cantidad de colas para el pool de persistencia.</p>
                <p>Recomendamos crear una carpeta en el nivel de los servicios llamada <span>serviq</span>.</p>

                <CodeCont paste="import serviq from 'fara-serviq';">
                    <p><span className='cod-pink'>import</span> <span className='cod-skyblue'>serviq</span> <span className='cod-pink'>from</span> <span className='cod-red'>'fara-serviq'</span>;</p>
                    <br />
                    <p className='cod-green'>// Creamos el broker en el puerto 4220 con 3 colas de persietncia (opcinal)</p>
                    <p><span className='cod-blue'>const</span> <span className='cod-midblue'>broker</span> = <span className='cod-skyblue'>serviq</span>.<span className='cod-skyyellow'>tcpBroker</span><span className='cod-yellow'>{'('}</span><span className='cod-skyyellow'>4220, 3</span><span className='cod-yellow'>{')'}</span>;</p>
                    <br />
                    <p className='cod-green'>// Iniciamos el servicio</p>
                    <p><span className='cod-midblue'>broker</span><span className='cod-skyyellow'>.init</span><span className='cod-yellow'>{'()'}</span>;</p>
                </CodeCont>
            </section>

            <section className='flex-col'>
                <h4>Configuración del Cliente (Service)</h4>
                <p>El cliente es cualquier microservicio que se conecta al Broker. Debe identificarse con un nombre único.</p>

                <CodeCont>
                    <p><span className='cod-pink'>import</span> <span className='cod-skyblue'>serviq</span> <span className='cod-pink'>from</span> <span className='cod-red'>'fara-serviq'</span>;</p>
                    <br />
                    <p className='cod-green'>// Nos registramos como el servicio 'orders'</p>
                    <p><span className='cod-blue'>const</span> <span className='cod-midblue'>client</span> = <span className='cod-skyblue'>serviq</span>.<span className='cod-skyyellow'>tcpClient</span><span className='cod-yellow'>{'('}</span><span className='cod-red'>'orders'</span><span className='cod-yellow'>{')'}</span>;</p>
                    <p><span className='cod-midblue'>client</span><span className='cod-skyyellow'>.connect</span><span className='cod-yellow'>{'()'}</span>;</p>
                    <br />
                    <p className='cod-green'>// Escuchamos mensajes dirigidos a nosotros</p>
                    <p><span className='cod-midblue'>client</span><span className='cod-skyyellow'>.onMessage</span> = <span className='cod-blue'>async</span> <span className='cod-yellow'>{'('}</span><span className='cod-skyblue'>msg</span><span className='cod-yellow'>{')'}</span> <span className='cod-blue'>{'=>'}</span> <span className='cod-yellow'>{'{'}</span></p>
                    <p>     <span className='cod-pink'>{'try {'}</span></p>
                    <p className='cod-green'>         // Lógica de negocio</p>
                    <br />
                    <p>         <span className='cod-pink'>if</span> <span className='cod-blue'>{'('}</span><span className='cod-skyblue'>isError</span><span className='cod-blue'>{') {'}</span></p>
                    <p>             <span className='cod-pink'>throw</span> <span className='cod-blue'>new</span> <span className='cod-skygreen'>Error</span><span className='cod-yellow'>{'('}</span><span className='cod-red'>'Generar error lo atrapa el catch'</span><span className='cod-yellow'>{')'}</span>;</p>
                    <p>         <span className='cod-blue'>{'}'}</span>;</p>
                    <br />
                    <br />
                    <p className='cod-green'>         // Si es una petición que espera respuesta:</p>
                    <p>         <span className='cod-pink'>if</span> <span className='cod-blue'>{'('}</span><span className='cod-midblue'>client</span><span className='cod-skyyellow'>.isRequest</span><span className='cod-yellow'>{'('}</span><span className='cod-skyblue'>msg.pattern</span><span className='cod-yellow'>{')'}</span><span className='cod-blue'>{') {'}</span></p>
                    <p>             <span className='cod-pink'>await</span> <span className='cod-midblue'>client</span><span className='cod-skyyellow'>.send</span><span className='cod-yellow'>{'('}</span><span className='cod-skyblue'>msg.from</span>, <span className='cod-red'>'red</span>, <span className='cod-midblue'>order</span>, <span className='cod-skyblue'>msg.cid</span><span className='cod-yellow'>{')'}</span>;</p>
                    <p>         <span className='cod-blue'>{'}'}</span>;</p>
                    <br />
                    <p>     <span className='cod-pink'>{'} catch ('}</span><span className='cod-skyblue'>error</span><span className='cod-pink'>{') {'}</span></p>
                    <p className='cod-green'>         // Es importante este catch, el broker lo necesita en caso de error</p>
                    <p>         <span className='cod-pink'>await</span> <span className='cod-midblue'>client</span><span className='cod-skyyellow'>.send</span><span className='cod-blue'>{'('}</span><span className='cod-red'>'BROKER'</span>, <span className='cod-red'>'error'</span>, <span className='cod-yellow'>{'{'}</span> <span className='cod-skyblue'>originalMsg: msg, error: error.message</span> <span className='cod-yellow'>{'}'}</span>, <span className='cod-skyblue'>msg.cid</span><span className='cod-blue'>{')'}</span>;</p>
                    <p>     <span className='cod-pink'>{'}'}</span>;</p>
                    <p><span className='cod-yellow'>{'}'}</span>;</p>
                </CodeCont>
            </section>

            <section className='flex-col'>
                <h4>El Ciclo de Vida del Mensaje en el Cliente</h4>
                <p>El tcpClient no solo recibe datos; es un nodo inteligente que reporta su estado al Broker. El uso del bloque try/catch es lo que permite la autorreparación del sistema.</p>
                <p><span>1. Registro e Identificación</span> Al conectarte, le das un "nombre" al servicio. El Broker usará este nombre para saber a quién entregarle los mensajes dirigidos a 'orders'.</p>
                <p><span>2. El Listener onMessage</span> Este es el punto de entrada. Cada vez que llega una tarea, se ejecuta esta función asíncrona.</p>
                <p><span>3. El Catch: El "Salvavidas" del Mensaje</span> Esta es la parte más importante para la resiliencia:</p>
                <ul>
                    <li><strong>¿Qué sucede aquí?:</strong> Si tu lógica falla (por ejemplo, una base de datos caída o un error de código), el catch captura el error.</li>
                    <li><strong>Comunicación con el Broker:</strong> El cliente le envía un mensaje especial al servicio 'BROKER'.</li>
                    <li><strong>Acción del Broker:</strong> Al recibir este reporte de error, el Broker no borra el mensaje. Lo devuelve a la cola de persistencia y programa un reintento (Backoff) para más tarde.</li>
                </ul>

                <p><span>4. Respuesta Inteligente (isRequest)</span></p>
                <p><strong>isRequest:</strong> Es una función de utilidad que verifica si el mensaje original espera una respuesta (basado en el pattern).</p>
                <p><strong>msg.cid:</strong> Al responder, devolvemos el mismo Correlation ID. Esto es vital para que el emisor original sepa que esa respuesta pertenece a la petición que envió antes.</p>
            </section>

        </div>
    );
};

export default DocQuikDtart;