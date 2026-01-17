
const DocPhilosophy = () => {

    return (
        <div className="docBodyDiv">
            <h2>Filosofía Serviq</h2>
            <p>Serviq nace bajo la premisa de que la comunicación entre microservicios no debería ser una carga para la infraestructura. Nuestra filosofía se basa en tres pilares:</p>

            <section className="flex-col">
                <h4>TCP sobre HTTP</h4>
                <p>A diferencia de las APIs REST o Brokers basados en HTTP, Serviq utiliza <span>Sockets TCP</span> puros.</p>
                <ul>
                    <li><strong>Por qué:</strong> Eliminamos el "overhead" de las cabeceras HTTP (headers, cookies, user-agents).</li>
                    <li><strong>Resultado:</strong> Una conexión persistente y bidireccional que permite enviar ráfagas de datos con una latencia mínima.</li>
                </ul>
            </section>

            <section className="flex-col">
                <h4>Persistencia Híbrida (RAM-First)</h4>
                <p>Creemos que el disco no debería frenar la ejecución.</p>
                <ul>
                    <li><strong>La Lógica:</strong> El mensaje entra en RAM y se entrega al instante. Al mismo tiempo, se guarda en <span>SQLite</span> como un "seguro de vida".</li>
                    <li><strong>El Beneficio:</strong> Si el servicio destino está disponible, el mensaje vuela en milisegundos. Si no, el disco garantiza que el mensaje sobreviva hasta que el servicio despierte.</li>
                </ul>
            </section>

            <section className="flex-col">
                <h4>Cero Configuración Externa</h4>
                <p>La mayoría de los brokers requieren que instales y mantengas una base de datos externa (como Redis o PostgreSQL) o servicios pesados (Erlang para RabbitMQ).</p>
                <p><span>Nuestra Visión:</span> El Broker debe ser auto-contenido. Al usar el motor nativo de SQLite, Serviq es un sistema de "instalar y correr". La base de datos vive dentro de tu proyecto, facilitando el despliegue y los backups.</p>
            </section>

            <section className="flex-col">
                <h4>¿Cuándo elegir Serviq?</h4>
                <ul>
                    <li>Cuando necesitas <span>velocidad</span> de respuesta inmediata.</li>
                    <li>Cuando trabajas con <span>Node.js moderno</span> y quieres aprovechar sus capacidades nativas.</li>
                    <li>Cuando quieres evitar el mantenimiento de infraestructuras complejas.</li>
                </ul>
            </section>
            
        </div>
    );
};

export default DocPhilosophy;