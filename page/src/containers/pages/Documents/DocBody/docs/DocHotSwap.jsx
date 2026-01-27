
const DocHotSwap = () => {

    return (
        <div className="docBodyDiv">
            <h2>Resiliencia de Sesión</h2>

            <section className="flex-col">
                <h4>Reconexión Inteligente (Hot-Swap)</h4>
                <p>Serviq está diseñado para entornos dinámicos donde los microservicios pueden reiniciarse, actualizarse o fallar. El Broker gestiona las sesiones de forma inteligente para evitar conexiones "zombis".</p>
                <ul>
                    <li><strong>Identificación por Nombre: Cada cliente se registra con un nombre único. Si el Broker detecta una nueva conexión con un nombre que ya existe (por ejemplo, tras un reinicio rápido del servicio), aplica un Hot-Swap.</strong> Cada cliente se registra con un nombre único. Si el Broker detecta una nueva conexión con un nombre que ya existe (por ejemplo, tras un reinicio rápido del servicio), aplica un <span>Hot-Swap</span>.</li>
                    <li><strong>Limpieza Automática:</strong> El Broker destruye el socket antiguo (existingSocket.destroy()) para liberar recursos y vincula inmediatamente el nuevo socket al flujo de mensajes.</li>
                    <li><strong>Sin Interrupciones:</strong> Para el resto de la red, el servicio nunca se fue; el ruteo simplemente se actualiza al nuevo túnel TCP.</li>
                </ul>
                <p>Serviq gestiona las sesiones de forma activa. Si un microservicio se reinicia o pierde la conexión y vuelve a entrar con el mismo nombre, el Broker detecta la sesión antigua "huérfana", la cierra de forma segura y enlaza la nueva conexión al instante. Esto garantiza que el ruteo de mensajes nunca apunte a un socket muerto.</p>
            </section>

            <section className="flex-col">
                <h4>Recuperación Automática: El "Flush" de Mensajes</h4>
                <p>¿Qué pasa con los mensajes que se acumularon en SQLite mientras el servicio estaba caído? Serviq no espera al motor de reintentos (que corre cada 30s) para entregarlos.</p>
                <ul>
                    <li><strong>Entrega Prioritaria al Conectar:</strong> En el momento exacto en que un servicio envía su mensaje de <span>REGISTER</span>, el Broker activa la función <span>_flushQueueByService</span>.</li>
                    <li><strong>Vaciado de Pool:</strong> El Broker escanea todas las colas del pool (queue_0, queue_1, etc.) buscando mensajes cuyo <span>target</span> sea el servicio recién conectado.</li>
                    <li><strong>Garantía de Orden:</strong> Los mensajes pendientes se envían en bloque al socket, permitiendo que el microservicio "se ponga al día" con las tareas atrasadas antes de empezar a recibir peticiones nuevas en tiempo real.</li>
                    <li><strong>Confirmación de Entrega:</strong> Si por alguna razón el socket falla durante el vaciado, Serviq es precavido: los mensajes que no se pudieron escribir vuelven a la persistencia automáticamente para no perder información.</li>
                </ul>
                <p>La recuperación no espera. En el momento exacto en que un servicio se registra, el Broker escanea todas las colas del pool en busca de mensajes pendientes para ese destino. Estos mensajes se entregan de forma prioritaria, permitiendo que el microservicio procese sus tareas atrasadas inmediatamente antes de recibir nuevas peticiones.</p>
            </section>
        </div>
    );
};

export default DocHotSwap;