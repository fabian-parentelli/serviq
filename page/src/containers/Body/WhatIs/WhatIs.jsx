import './whatIs.css';
import { Icons } from 'fara-comp-react';

const WhatIs = () => {

    return (
        <div id="whatIs">
            <h2>¿Qué es Serviq?</h2>
            <p className='whatIsp'>Serviq es una infraestructura de mensajería ligera y de alto rendimiento diseñada para conectar microservicios de forma segura. A diferencia de las conexiones tradicionales que fallan cuando un servicio no responde, Serviq actúa como un mediador inteligente que garantiza que cada instrucción llegue a su destino.</p>

            <section className='whatIsSect'>
                <div>
                    <h4>Resiliencia Nativa</h4>
                    <p>Si un servicio falla, Serviq no descarta el mensaje. Lo retiene y aplica un reintento progresivo hasta confirmar el éxito.</p>
                    <Icons type='replace' color='#00cfff' />
                </div>

                <div>
                    <h4>Balanceo Inteligente</h4>
                    <p>Distribuye la carga de trabajo automáticamente entre tus instancias disponibles para evitar cuellos de botella.</p>
                    <Icons type='direction' color='#00cfff' />
                </div>

                <div>
                    <h4>Persistencia en el Borde</h4>
                    <p>Utiliza almacenamiento SQLite local para asegurar que los mensajes sobrevivan incluso a un reinicio del sistema.</p>
                    <Icons type='database' color='#00cfff' />
                </div>
            </section>

            <p className='whatIspp'><span>Arquitectura Desacoplada:</span> Tus servicios no necesitan saber dónde están los demás; el Broker se encarga de la ruta.</p>

            <p className='whatIspp'><span>Protocolo de Carril Rápido:</span> Identifica automáticamente consultas críticas (GET) para entrega inmediata y procesos pesados (POST/PUT) para gestión por colas.</p>

            <p className='whatIspp'><span>Tolerancia a Fallos:</span> Diseñado bajo el principio de que los sistemas fallan. Serviq gestiona los errores, permitiendo que tu aplicación siga funcionando.</p>

            <img src="/table.png" alt="img" />

            <br />
            <br />

            <h2>Arquitectura y flujo de trabajo</h2>

            <p className='whatIsp'>Serviq es un sistema de comunicación para microservicios en Node.js que utiliza un <span>Intermediario (Broker)</span> central para gestionar el tráfico de datos de forma inteligente.</p>

            <h4>Regístro y conección automática</h4>

            <p className='whatIsp'>En lugar de configurar direcciones IP manualmente, cada microservicio se "anuncia" al Broker al iniciar.</p>

            <p className='whatIsp'>Detección Automática: El Broker registra qué funciones puede ejecutar cada servicio.</p>

            <p className='whatIsp'>Tabla de Rutas: Se crea un mapa dinámico para saber a dónde enviar cada dato sin configuración previa.</p>
            
            <h4>Gestión Inteligente de Rutas</h4>

            <p className='whatIsp'>El sistema decide automáticamente cómo tratar cada mensaje según su nombre o "patrón":</p>

            <p className='whatIsp'>Ruta Rápida (Síncrona): Para consultas inmediatas (ej. obtener datos de un perfil). El Broker conecta directamente con el servicio más libre para dar una respuesta instantánea.</p>
            
            <p className='whatIsp'>Ruta Persistente (Asíncrona): Para tareas pesadas o de escritura. El mensaje se guarda en una cola para procesarse en cuanto haya capacidad.</p>
            
            <h4>Almacenamiento Seguro con SQLite</h4>
            
            <p className='whatIsp'>Para asegurar que ninguna tarea se pierda, el sistema sigue este flujo:</p>
            
            <p className='whatIsp'>Confirmación (ACK): El servicio receptor debe avisar que terminó con éxito.</p>
            
            <p className='whatIsp'>Reintento Escalonado: Si hay un error, el sistema espera un tiempo (que aumenta en cada fallo) antes de volver a intentar, evitando saturar al servicio.</p>
            
            <p className='whatIsp'>Cola de Fallos (DLQ): Si tras varios intentos el error persiste, el mensaje se aparta para revisión manual, activando una alerta.</p>

            <h4>Ventajas claves</h4>

            <p className='whatIsp'>Independencia: Si un servicio falla, el resto de la aplicación sigue funcionando y los mensajes esperan en cola.</p>
            
            <p className='whatIsp'>Distribución de Carga: El Broker reparte el trabajo equitativamente entre los nodos disponibles.</p>
            
            <p className='whatIsp'>Instalación Simple: Diseñado específicamente para el ecosistema Node.js, sin necesidad de instalar software complejo externo.</p>
        </div>
    );
};

export default WhatIs;