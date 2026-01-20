import CodeCont from '@/components/utils/CodeCont/CodeCont.jsx';

const DocInstall = () => {

    return (
        <div className='docBodyDiv'>
            <h2>Instalación</h2>
            <p>Serviq está diseñado para ser ligero desde el primer segundo. Al no tener dependencias externas de bases de datos, la instalación es puramente Javascript.</p>

            <section className="flex-col">
                <h4>Requisitos Previos</h4>
                <p>Antes de instalar, asegúrate de cumplir con el requisito de runtime (debido al uso de node:sqlite nativo):</p>
                <p><span>Node.js: v22.5.0 o superior</span></p>
            </section>

            <section className='flex-col'>
                <h4>Comando de instalación</h4>
                <p>Instala el paquete mediante tu gestor de dependencias preferido:</p>

                <CodeCont lenguage='Bash' paste="pnpm add fara-serviq">
                    <p className='cod-green'># Usando npm</p>
                    <p>npm install fara-serviq</p>
                    <br />
                    <p className='cod-green'># Usando pnpm (Recomendado por velocidad)</p>
                    <p>pnpm add fara-serviq</p>
                </CodeCont>
            </section>

            <section className='flex-col'>
                <h4>Estructura de archivos Automática</h4>
                <p>Una de las grandes ventajas de Serviq es que se autogestiona. En cuanto ejecutes el método broker.init(), el sistema creará automáticamente la siguiente estructura en la raíz de tu proyecto:</p>
                <CodeCont lenguage="Plaintext">
                    <p>{`mi-proyecto/
├── queues/               <-- Creada automáticamente por Serviq
│   ├── queue_0.db        <-- Base de datos SQLite síncrona
│   ├── queue_1.db
│   └── queue_n.db
├── node_modules/
└── package.json`}</p>
                </CodeCont>
            </section>

            <section className='flex-col'>
                <h4>Configuración Inicial</h4>
                <p>A diferencia de otros brokers donde debes configurar archivos .yml o instalar Redis/RabbitMQ en tu SO, con Serviq:</p>
                <ul>
                    <li><strong>No hay Docker obligatorio:</strong> Puedes usarlo en desarrollo directamente sin levantar contenedores.</li>
                    <li><strong>Persistencia "Zero-Config":</strong> No necesitas crear tablas ni esquemas manualmente; el Broker realiza el bootstrap de las tablas messages y dead_letter en el primer arranque.</li>
                    <li><strong>Portabilidad Total:</strong> Si quieres mover tu Broker a otro servidor, solo tienes que copiar la carpeta /queues y todos tus mensajes pendientes viajarán con ella.</li>
                </ul>
            </section>

            <section className='flex-col'>
                <h4>¿Qué pasa si la carpeta /queues no existe?</h4>
                <p>No te preocupes. Serviq utiliza fs.mkdirSync con la opción {"{ recursive: true }"} en su constructor, por lo que se asegura de que el entorno esté listo antes de intentar conectar con la base de datos.</p>
            </section>
        </div>
    );
};

export default DocInstall;