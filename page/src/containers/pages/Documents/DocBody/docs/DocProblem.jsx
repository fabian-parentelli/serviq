const DocProblem = () => {

    return (
        <div className="docBodyDiv">
            <h2>Solución de problemas</h2>

            <section className="flex-col">
                <h4>El emisor recibe un Timeout Error</h4>
                <p>Si después de 5 segundos (o tu tiempo configurado) recibes un error de Timeout:</p>
                <ul>
                    <li>El microservicio de destino nunca recibió el mensaje (está offline).</li>
                    <li>El microservicio recibió el mensaje, pero nunca envió una respuesta (_res)..</li>
                </ul>
                <p><strong>Solución:</strong> Verifica que tu lógica en el servicio de destino termine siempre con un <span>client.send()</span> usando el patrón correcto o que no haya un proceso bloqueante (bucle infinito) en el destino.</p>
            </section>

            <section className="flex-col">
                <h4>El mensaje queda en status: pending pero no se entrega</h4>
                <p>Si el Broker te responde que el mensaje fue encolado pero el destino no lo recibe al encenderse:</p>
                <ul>
                    <li>Causa: El nombre del servicio en el <span>REGISTER</span> no coincide exactamente con el campo <span>to</span> del mensaje original.</li>
                </ul>
                <p><strong>Solución:</strong> Serviq es sensible a mayúsculas y minúsculas. Asegúrate de que users sea igual en el emisor y en el receptor.</p>
            </section>

            <section className="flex-col">
                <h4>Error ECONNREFUSED al conectar</h4>
                <ul>
                    <li>El Broker no está corriendo o el puerto (por defecto 4220) está bloqueado por un firewall o siendo usado por otra aplicación.</li>
                </ul>
                <p><strong>Solución:</strong> Ejecuta netstat -ano | findstr :4220 (en Windows) para ver si el puerto está ocupado y asegúrate de iniciar el Broker antes que los clientes.</p>
            </section>

            <section className="flex-col">
                <h4>Los archivos .db no se crean</h4>
                <ul>
                    <li>Problemas de permisos de escritura en la carpeta del proyecto.</li>
                </ul>
                <p><strong>Solución:</strong> Ejecuta tu proceso de Node con los permisos adecuados. Serviq intentará crear la carpeta <span>/queues</span> automáticamente; si falla, créala manualmente en la raíz.</p>
            </section>

        </div>
    );
};

export default DocProblem;