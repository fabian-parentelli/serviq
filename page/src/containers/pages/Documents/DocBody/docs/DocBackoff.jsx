import CodeCont from '@/components/utils/CodeCont/CodeCont.jsx';

const DocBackoff = () => {

    return (
        <div className="docBodyDiv">
            <h2>Backoff Progresivo: El Motor de Reintentos</h2>

            <section className="flex-col">
                <h4>Reintentos</h4>
                <p>Serviq no satura tus servicios. Si una tarea (`post` u `on`) falla, el Broker aplica un <span>Backoff Progresivo</span>. Esto significa que los intervalos de tiempo entre reintentos crecen para dar tiempo a que el servicio se recupere (por ejemplo, si una base de datos se está reiniciando).</p>
                <p>El ciclo de vida de un mensaje persistente tiene un máximo de **5 intentos** adicionales tras el fallo inicial:</p>
                <ul>
                    <li><strong>Fallo inicial:</strong> El mensaje se guarda en SQLite inmediatamente.</li>
                    <li><strong>1er Reintento:</strong> a los 10 minutos.</li>
                    <li><strong>2do Reintento:</strong> a los 15 minutos.</li>
                    <li><strong>3er Reintento:</strong> a los 20 minutos.</li>
                    <li><strong>4to Reintento:</strong> a los 25 minutos.</li>
                    <li><strong>5to Reintento:</strong> Últmo reintento.</li>
                </ul>
                <p>Si el quinto reintento también falla, el mensaje se marca como <span>"Muerto"</span> y se traslada a la tabla de <span>Dead Letter</span>.</p>
            </section>

            <section className="flex-col">
                <h4>Gestión de Errores (Dead Letter)</h4>
                <p>Cuando un mensaje agota sus oportunidades, deja de intentar enviarse automáticamente para no desperdiciar recursos. Aquí es donde entra la gestión manual a través de la API del Broker:</p>
                <p><span>Ver mensajes en cuarentena</span></p>
                <p>Para auditar qué salió mal, puedes obtener la lista completa de mensajes que fallaron definitivamente.</p>

                <CodeCont paste="const faild = broker.getFailedMessages();">
                    <p className='cod-green'>// Retorna un array con el payload original, el error reportado y el cid.</p>
                    <p><span className='cod-blue'>const</span> <span className='cod-midblue'>failed</span> = <span className='cod-skyblue'>broker</span><span className='cod-skyyellow'>.getFailedMessage</span><span className='cod-pink'>()</span>;</p>
                    <p><span className='cod-skyblue'>console</span><span className='cod-skyyellow'>.log</span><span className='cod-pink'>{'('}</span><span className='cod-midblue'>failed</span><span className='cod-pink'>{')'}</span>;</p>
                </CodeCont>

                <p><span>Eliminar un fallo expecífico</span></p>
                <p>Si tras revisar un mensaje en la Dead Letter decides que no debe ser procesado (por ejemplo, datos malformados que nunca pasarán la validación), puedes borrarlo individualmente usando su ID de correlación.</p>

                <CodeCont paste="broker.deleteFailedMessage('1234abcd');">
                    <p><span className='cod-skyblue'>broker</span><span className='cod-skyyellow'>.deleteFailedMessage</span><span className='cod-pink'>{'('}</span><span className='cod-red'>'1234abcd'</span><span className='cod-pink'>{')'}</span>;</p>
                </CodeCont>

                <p><span>Limpieza Total (Purge)</span></p>
                <p>En entornos de desarrollo o tras una falla masiva ya resuelta, puedes querer resetear el estado del Broker por completo.</p>

                <CodeCont paste="broker.purgeAllQueues();">
                    <p><span className='cod-skyblue'>broker</span><span className='cod-skyyellow'>.purgeAllQueues</span><span className='cod-pink'>()</span>;</p>
                </CodeCont>

                <p>Cuidado: Este método es destructivo. Elimina todos los mensajes activos en las colas de persistencia y todos los registros de la tabla de fallos (Dead Letter) de todas las bases de datos en la carpeta /queues.</p>
            </section>

            <section className='flex-col'>
                <h4>Eventos de notificación</h4>
                <p>Para complementar esta gestión, recuerda que el Broker emite eventos en tiempo real:</p>

                <CodeCont paste="broker.on('taskComplete', (msg) => {});">
                    <p className='cod-green'>// Ideal para métricas de éxito.</p>
                    <p><span className='cod-skyblue'>broker</span><span className='cod-skyyellow'>.on</span><span className='cod-pink'>{'('}</span><span className='cod-red'>'taskComplete'</span>, <span className='cod-blue'>{'('}</span><span className='cod-skyblue'>msg</span><span className='cod-blue'>{') =>'}</span> <span className='cod-yellow'>{'{'}</span> ... <span className='cod-yellow'>{'}'}</span><span className='cod-pink'>{')'}</span>;</p>
                </CodeCont>
                
                <CodeCont paste="broker.on('taskFailed', (msg) => {});">
                    <p className='cod-green'>// Alerta de error.</p>
                    <p><span className='cod-skyblue'>broker</span><span className='cod-skyyellow'>.on</span><span className='cod-pink'>{'('}</span><span className='cod-red'>'taskFailed'</span>, <span className='cod-blue'>{'('}</span><span className='cod-skyblue'>msg</span><span className='cod-blue'>{') =>'}</span> <span className='cod-yellow'>{'{'}</span> ... <span className='cod-yellow'>{'}'}</span><span className='cod-pink'>{')'}</span>;</p>
                </CodeCont>
            </section>
        </div>
    );
};

export default DocBackoff;