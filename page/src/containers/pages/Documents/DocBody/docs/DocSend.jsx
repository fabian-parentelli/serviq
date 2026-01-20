import CodeCont from '@/components/utils/CodeCont/CodeCont.jsx';

const DocSend = () => {

    return (
        <div className="docBodyDiv">
            <h2>Anatomía de un envío</h2>
            <p>La función client.send requiere tres argumentos principales: el servicio destino, el pattern (acción) y los datos.</p>

            <section className='flex-col'>
                <h4>Estructura de la función</h4>
                <CodeCont paste='client.send(target, pattern, payload);'>
                    <p className='cod-gray'>client.send(target, pattern, payload);</p>
                </CodeCont>

                <ul>
                    <li><strong>Targte:</strong> (Servicio): Es el nombre con el que se registró el microservicio destino (ej: 'orders').</li>
                    <li><strong>Pattern: </strong>(Acción): La instrucción que define si el mensaje se encola, se espera o es una consulta.</li>
                    <li><strong>payload: </strong>(Objeto): Un objeto con la información necesaria. Si la acción no requiere datos (como un simple "ping"), debe enviarse como un objeto vacío {'{}'}.</li>
                </ul>
            </section>

            <section className='flex-col'>
                <h4>Ejemplo de implementación</h4>
                <p>Dependiendo de cómo organices tu microservicio, puedes usar patterns simples o modulares:</p>
                <p><span>Uso de Pattern Modular (Con guion bajo)</span></p>
                <ul>
                    <li>Ideal cuando un solo microservicio maneja múltiples responsabilidades o módulos internos.</li>
                    <li><strong>Ventaja:</strong> Permite organizar la lógica interna del receptor (en este caso, el módulo de transferencias dentro del servicio de órdenes).</li>
                </ul>
                <CodeCont>
                    <p className='cod-green'>// El Broker lee 'get', ignora 'transfer_'</p>
                    <p><span className='cod-skyblue'>client</span><span className='cod-skyyellow'>.send</span><span className='cod-pink'>{'('}</span><span className='cod-red'>'ordes'</span>, <span className='cod-red'>'transfer_getOrdeById'</span>, <span className='cod-blue'>{'{'}</span> <span className='cod-skyblue'>_id</span>: <span className='cod-skygreen'>1234</span> <span className='cod-blue'>{'}'}</span><span className='cod-pink'>{')'}</span>;</p>
                </CodeCont>
            </section>

            <section className='flex-col'>
                <p><span>Uso de Pattern Simple (Sin guion bajo)</span></p>
                <p>Ideal para servicios con una única responsabilidad clara.</p>
                <CodeCont>
                    <p className='cod-green'>// El Broker lee 'get' directamente</p>
                    <p><span className='cod-skyblue'>client</span><span className='cod-skyyellow'>.send</span><span className='cod-pink'>{'('}</span><span className='cod-red'>'ordes'</span>, <span className='cod-red'>'getOrdeById'</span>, <span className='cod-blue'>{'{'}</span> <span className='cod-skyblue'>_id</span>: <span className='cod-skygreen'>1234</span> <span className='cod-blue'>{'}'}</span><span className='cod-pink'>{')'}</span>;</p>
                </CodeCont>
            </section>

            <section className='flex-col'>
                <h4>Payload</h4>
                <p>El tercer parámetro siempre debe ser un objeto.</p>
                <ul>
                    <li><strong>Con Información: </strong>{"{ _id: 1234, type: 'express' }"}</li>
                </ul>
                <p><span>Tip de Serviq:</span> Aunque no necesites enviar datos, enviar el objeto vacío {} asegura que el protocolo TCP mantenga la consistencia del JSON y evita errores de parseo en el receptor.</p>
            </section>

        </div>
    );
};

export default DocSend;