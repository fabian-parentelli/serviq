import CodeCont from '@/components/utils/CodeCont/CodeCont.jsx';

const DocPatterns = () => {

    // client.send('shipping', 'create_label', { orderId: 101 });

    return (
        <div className="docBodyDiv">
            <h2>Patterns</h2>

            <section className="flex-col">
                <h4>Lógica de Patterns (Patrones de Mensaje)</h4>
                <p>El nombre del pattern es la instrucción que le dice al Broker cómo debe procesar, almacenar y responder. El Broker analiza las tres primeras letras del pattern (o lo que haya después del primer guion bajo _).</p>
                <p><span>Estrucutura del nombre:</span></p>
                <ul>
                    <li><strong>Simple:</strong> postUser</li>
                    <li><strong>Modular:</strong> users_postUser (El broker ignorará <span>users_</span> y analaizará <span>pos</span>).</li>
                    <li><strong>Límite:</strong> Solo se permite <span>un guión bajo</span> para separar el módulo de la acción.</li>
                </ul>
            </section>

            <section className="flex-col">
                <h4>Comportamiento según el prefijo</h4>
                <p>El Broker decide si encolar en disco (persistencia) y si mantener la conexión abierta (esperar respuesta) basándose en estos prefijos:</p>

                <table>
                    <thead>
                        <tr>
                            <th>Prefijo</th>
                            <th>Acción</th>
                            <th>Perciste</th>
                            <th>Espera respuesta</th>
                            <th>Uso ideal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {table.map((doc, ind) => (
                            <tr key={ind}>
                                <td>{doc.prefix}</td>
                                <td>{doc.action}</td>
                                <td>{doc.queue}</td>
                                <td>{doc.response}</td>
                                <td>{doc.use}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="flex-col">
                <p><span>Consultas volátiles (get).</span></p>
                <p>Diseñadas para velocidad.</p>
                <ul>
                    <li><strong>Flujo:</strong> Envía y espera.</li>
                    <li><strong>Fallo:</strong> Si el servicio falla, no se guarda en disco. El Broker devuelve el error al emisor de inmediato porque los datos de una consulta suelen ser efímeros.</li>
                </ul>
            </section>

            <section className="flex-col">
                <p><span>Tareas con confirmación (post/put/delete...)</span></p>
                <p>Es es el modo más robusto.</p>
                <ul>
                    <li><strong>Flujo:</strong> Envía y mantiene la espera de la respuesta.</li>
                    <li><strong>Fallo:</strong> Si el servicio reporta un error, el Broker encola el mensaje en SQLite para reintentarlo luego y le responde al emisor: <span>{'{ status: "pending", cid: "..." }'}</span>.</li>
                </ul>
            </section>

            <section className="flex-col">
                <p><span>Dispara y olvida (on)</span></p>
                <p>Para procesos donde el emisor no necesita quedarse esperando.</p>
                <ul>
                    <li><strong>Flujo:</strong> Envía el mensaje y libera al emisor inmediatamente.</li>
                    <li><strong>Fallo:</strong> Si algo sale mal, el Broker lo encola en SQLite silenciosamente y gestiona los reintentos por su cuenta.</li>
                </ul>
            </section>

            <section className="flex-col">
                <p><span>Flujo de Respuesta (res)</span></p>
                <p>Es el camino de vuelta para los mensajes get y post.</p>
                <ul>
                    <li><strong>Flujo:</strong> Solo ida. El Broker entrega la respuesta y cierra el ciclo de ese cid. No se encola porque la acción principal ya fue intentada; el fallo aquí sería solo de red.</li>
                </ul>
            </section>

            <section className="flex-col">
                <h4>El manejo de error</h4>
                <p>Cuando un servicio lanza una excepción y envía un pattern de error al 'BROKER', ocurre una inspección inteligente:</p>
                <p>El Broker busca el mensaje original asociado a ese cid.</p>
                <p>Revisa el pattern original:</p>
                <ul>
                    <li>Si era un <span>get</span>: Devuelve el error al emisor original.</li>
                    <li>Si era un <span>post</span> u <span>on</span>: Guarda el mensaje en la base de datos de persistencia (queue_n.db), programa el reintento y devuelve un estado pending.</li>
                </ul>
            </section>

        </div>
    );
};

export default DocPatterns;

const table = [
    {
        prefix: 'get',
        action: 'Consulta',
        queue: 'No',
        response: 'Sí',
        use: 'Lectura de datos rápida'
    },
    {
        prefix: 'pos',
        action: 'Tarea Crítica',
        queue: 'Sí',
        response: 'Sí',
        use: 'Crear registros que requieren confirmación'
    },
    {
        prefix: 'on',
        action: 'Evento',
        queue: 'Sí',
        response: 'No',
        use: 'Notificaciones o procesos en segundo plano'
    },
    {
        prefix: 'res',
        action: 'Respuesta',
        queue: 'No',
        response: 'No',
        use: 'Devolver datos al solicitante'
    },
    {
        prefix: 'error',
        action: 'Reporte',
        queue: 'Depende del original',
        response: 'No',
        use: 'Informar fallos al Broker'
    }
];