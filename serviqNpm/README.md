Serviq: Ultra-Lightweight Message Broker

**Serviq** es un Broker de mensajería TCP diseñado para arquitecturas de microservicios que requieren **alta velocidad, persistencia garantizada y reintentos inteligentes**, todo sin la complejidad de configurar grandes infraestructuras como RabbitMQ o Kafka.

Está construido nativamente sobre Node.js, aprovechando el rendimiento de los sockets TCP y la velocidad de **SQLite (DatabaseSync)** para la persistencia en disco.

## ¿Para qué sirve?

Serviq actúa como el "sistema nervioso" de tu aplicación. Permite que diferentes servicios se comuniquen entre sí de forma asíncrona:
- **Garantía de Entrega:** Si un servicio está caído, Serviq guarda el mensaje y lo intenta entregar más tarde.
- **Desacoplamiento:** El servicio "A" no necesita saber si el servicio "B" está encendido; solo envía el mensaje al Broker.
- **Persistencia Híbrida:** Utiliza un Pool de colas en memoria para velocidad y persistencia en disco para seguridad ante fallos del sistema.

## Conceptos Core

### 1. El Broker

El corazón del sistema. Gestiona las conexiones de los clientes, el enrutamiento de mensajes y el motor de reintentos.

- **Puerto por defecto:** `4220`.
- **Seguridad:** Validación de JSON y protección contra datos corruptos (Socket Security).
- **Protocolo:** Comunicación binaria/texto vía TCP para mínima latencia.

### 2. Pool de Colas (Sharding Local)

A diferencia de otros brokers, Serviq divide la carga en múltiples colas (`queue_n`). Esto permite
- **Paralelismo:** Menor contención de datos al leer/escribir.
- **Archivos de DB independientes:** Cada cola tiene su propio archivo `.db` en la carpeta `/queues`.

### 3. Motor de Reintentos (Backoff Exponencial)

Si un mensaje falla, Serviq no se rinde de inmediato. Lo reintenta en intervalos crecientes:

1. **Inmediato** Primer intento).
2. **10 minutos** después.
3. **15 minutos** después.
4. **20 minutos** después.
5. **25 minutos** después.
### 4. Dead Letter Queue (Cuarentena)

Si tras 5 intentos el mensaje no puede ser entregado (por ejemplo, el servicio de destino tiene un bug persistente), el mensaje se mueve a la **Dead Letter Table**.

- **Auditoría:** Los mensajes no se borran; quedan disponibles para que el administrador los inspeccione.
    
- **Recuperación:** Permite limpiar o re-inyectar mensajes manualmente.

## Instalación y Quick Start

JavaScript

```js
import serviq from 'serviq';

// Crear el broker en el puerto 4220 con 3 colas de persistencia
const broker = serviq.tcpBroker(4220, 3);

// Iniciar el servidor
broker.init();
```

## Protocolo de Mensajería

Para que un microservicio hable con Serviq, debe enviar objetos JSON a través de un socket TCP. **Importante:** Cada mensaje debe terminar con un salto de línea (`\n`) para que el Broker sepa dónde termina un comando y empieza el siguiente.

### 1. Registro del Servicio

Lo primero que debe hacer cualquier cliente al conectarse es identificarse.

JSON

```json
{
  "type": "REGISTER",
  "name": "orders-service"
}
```

### 2. Estructura de un Mensaje (Task)

Para enviar una tarea a otro servicio, el formato es el siguiente:

JSON

```json
{
  "to": "notifications-service",
  "from": "orders-service",
  "pattern": "send_email",
  "cid": "unique-uuid-12345",
  "data": {
    "email": "user@example.com",
    "body": "Tu pedido ha sido enviado"
  }
}
```

- **`to`**: El nombre del servicio destino.
- **`pattern`**: La acción a realizar. Si empieza con `get`, Serviq **no** lo guardará en disco si falla (asume que es una consulta síncrona).
- **`cid`**: (Correlation ID) Un ID único para rastrear el mensaje.


## Guía de Administración (Mantenimiento)

Serviq provee métodos específicos para que el desarrollador pueda monitorear y limpiar el sistema.

### Monitoreo del Estado

El método `getQueuesStatus()` devuelve una radiografía del Broker:

JavaScript

```js
const status = broker.getQueuesStatus();
/* Retorna:
{
  totalQueues: 3,
  activeClients: ['orders-service', 'inventory-service'],
  queues: [
    { id: 'queue_0', inMemory: 5, inDisk: 100, deadLetter: 2 },
    ...
  ]
}
*/
```

### Gestión de Errores (Dead Letter)

Cuando un mensaje agota sus 5 reintentos, cae en la tabla de fallos. Así se gestiona:
1. **Ver fallos:** `broker.getFailedMessages()` retorna un array con todos los mensajes en cuarentena.
2. **Eliminar uno:** `broker.deleteFailedMessage(cid)` borra un mensaje específico si ya no es útil.
3. **Limpieza Total:** `broker.purgeAllQueues()` vacía absolutamente todo (mensajes activos y errores) y resetea el Broker a cero.


## Seguridad y Resiliencia

Serviq está blindado contra fallos comunes:

- **Validación de JSON:** Si un cliente envía datos malformados, Serviq corta la conexión (`socket.destroy()`) para evitar saturación de memoria.
- **Heartbeat (Keep-Alive):** Detecta conexiones "zombie" y las limpia cada 60 segundos
- **Atomicidad:** Al usar SQLite, si el servidor se apaga repentinamente, los mensajes que estaban en disco permanecen intactos para el próximo inicio.

## Flujo de Respuesta y Resiliencia

Serviq no solo envía mensajes, sino que gestiona el ciclo de vida de la respuesta. Si un servicio falla, el mensaje vuelve al Broker para ser reintentado.

### 1. El Gateway (Cliente Solicitante)

El Gateway usa `client.send` para pedir datos. Si el servicio de destino está caído o falla, Serviq le devolverá un estado `pending`.

JavaScript

```js
import faress from "../faress.js";
import { client } from "./config.js";

const app = faress();
client.connect();

app.get('/', async (req, res) => {
    // Enviamos petición al servicio 'users'
    // Pattern: 'user_postUser' (Serviq detecta que no empieza con 'get', por lo que es persistible)
    const result = await client.send('users', 'user_postUser', { _id: 1234 });
    
    console.log('Respuesta del Broker:', result);
    res.send(result);
});

app.listen(3000, () => console.log('Gateway en puerto 3000'));
```

### 2. El Microservicio (Manejo de Errores y Respuesta)

Este ejemplo muestra cómo el servicio informa al Broker cuando algo sale mal. Al enviar un mensaje a `BROKER` con el tipo `error`, Serviq activa automáticamente la **lógica de reintento**.

JavaScript

```js
import serviq from 'serviq';

export const client = serviq.tcpClient('users'); // Se registra como 'users'
client.connect();

client.onMessage = async (msg) => {
    try {
    
        if (isError) {
            throw new Error('Error de lógica');
        }

        // Lógica de negocio exitosa
        const user = { name: 'Juan', age: 27 };

        // Si es una petición (Request), respondemos al emisor original
        if (client.isRequest(msg.pattern)) {
            await client.send(msg.from, 'res', user, msg.cid);
        }

    } catch (error) {
        // IMPORTANTE: Informamos al Broker que fallamos.
        // El Broker recibirá esto y 
        // encolará el mensaje original para reintentarlo después.
        await client.send('BROKER', 'error', { 
            originalMsg: msg, 
            error: error.message 
        }, msg.cid);
    }
};
```

### ¿Qué sucede detrás de escena?

1. **Petición Inicial:** El Gateway envía el mensaje. Si el servicio `users` está procesando y lanza el error, el Broker recibe el aviso de `error`.
2. **Cuarentena Temporal:** El Broker guarda el mensaje en una de sus colas (`queue_n.db`) y calcula el próximo intento (10 min, 15 min, etc.).
3. **Recuperación:** Cuando el `setTimeout` termina y el error desaparece, en el próximo ciclo de reintento del Broker, el mensaje será entregado nuevamente.
4. **Finalización:** El servicio procesa con éxito y el mensaje se elimina definitivamente de la persistencia de Serviq.

## Eventos del Broker (Hooks de Monitoreo)

El Broker emite eventos específicos que permiten al desarrollador reaccionar al ciclo de vida de los mensajes. Esto es útil para logging, auditoría o alertas externas.

### 1. Evento `taskComplete`

Este evento se dispara cuando un mensaje ha sido entregado y procesado exitosamente por el servicio de destino.

JavaScript

```js
broker.on('taskComplete', (msg) => {
    // Aquí recibes el objeto del mensaje que fue finalizado
    console.log(`[Éxito] Tarea ${msg.cid} completada por ${msg.to}`);
    
    // Ideal para:
    // - Métricas de rendimiento.
    // - Confirmar acciones en una base de datos externa.
});
```

### 2. Evento `taskFailed` (La "Cuarentena")

Este es el evento más crítico. Se dispara cuando un mensaje ha agotado sus **5 intentos de reintento** y el Broker decide dejar de procesarlo automáticamente.

JavaScript

```js
broker.on('taskFailed', (msg) => {
    console.log(`[ALERTA] El mensaje ${msg.cid} ha fallado definitivamente.`);
    
    // ¿Qué obtenemos aquí?
    // - El payload original completo.
    // - El historial de intentos (attempts: 5).
    // - El nombre del servicio que nunca respondió.

    // Acciones recomendadas:
    // 1. Dar aviso: Enviar un mensaje a Slack/Discord o Email al admin.
    // 2. Auditoría: El mensaje ya está en la tabla 'dead_letter' de SQLite,
    //    pero aquí puedes registrar el error en un log centralizado.
});
```

### ¿Qué obtenemos exactamente en estos eventos?

Ambos eventos devuelven el objeto `msg`, que contiene:

- **`cid`**: El identificador único para rastrear qué transacción falló.
    
- **`to` / `from`**: Los servicios involucrados.
    
- **`data`**: La información de negocio original (para que no se pierda nada).
    
- **`attempts`**: En el caso de `taskFailed`, verás que el valor es `6` (el intento que falló definitivamente).
    

### Resumen para el desarrollador

> Estos eventos son tu **ventana de visibilidad**. Mientras que el Broker se encarga del trabajo sucio de mover datos y reintentar, tú usas estos hooks para mantener al equipo informado sobre la salud de los microservicios.