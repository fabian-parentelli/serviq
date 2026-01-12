# 🚀 Serviq: Microservices Reliability Framework

**Serviq** es una librería profesional para Node.js diseñada para construir arquitecturas de microservicios robustas, escalables y, sobre todo, **resilientes**.

A diferencia de otras librerías, Serviq incluye un **Broker inteligente** con balanceo de carga y un sistema de **Colas con Persistencia SQLite** integrado, lo que garantiza que ningún mensaje se pierda, incluso si un servicio se cae.

---

## 📂 Estructura Recomendada del Proyecto

Para mantener el orden en el desarrollo, recomendamos la siguiente estructura de carpetas:

```text
mi-proyecto/
├── gateway/           # API Gateway (Express, Fastify, etc.)
├── ms_user/           # Microservicio de Usuarios
├── ms_product/        # Microservicio de Productos
├── serviq/            # Configuración de infraestructura
│   ├── broker.js      # Orquestador central
│   └── queue.js       # Configuración de las colas
└── start.sh           # Script de arranque automático

```

---

## 🛠️ Configuración e Inicio rápido

### 1. El Broker (Orquestador)

El Broker es el corazón de la red. Debes inicializarlo pasando un array con los nombres de las colas que vas a utilizar (mínimo una).

```javascript
// serviq/broker.js
import serviq from 'serviq';

const broker = serviq.tcpBroker(4000, ['queue_a', 'queue_b']);
broker.init();

```

### 2. El Script de Arranque (`start.sh`)

Recomendamos este script para levantar toda la infraestructura de un solo comando durante el desarrollo.

```bash
#!/bin/bash
# Matar procesos hijos al salir
trap "kill 0" EXIT

# 1. Iniciar Broker primero
node serviq/broker.js &
sleep 1

# 2. Iniciar Gateway, Colas y Microservicios
node gateway/src/app.js &
node serviq/queue.js &
node ms_user/src/app.js &
node ms_product/src/app.js &

wait

```

*Ejecutar con: `chmod +x start.sh && ./start.sh*`

---

## 🔌 Implementación de Componentes

### API Gateway (Cliente)

El Gateway utiliza un cliente para comunicarse. Al enviar mensajes, si esperas una respuesta inmediata (Lectura), usa `await`.

```javascript
import { client } from "./config.js";

client.connect();

app.get('/', async (req, res) => {
    // client.send(servicio_destino, funcion, data)
    const result = await client.send('ms_product', 'postProduct', { _id: 1234 });
    res.send(result);
});

```

### Microservicios (Servidores de Lógica)

Los servicios escuchan mensajes mediante `onMessage`. Es vital manejar el **CID** (Correlation ID) para las respuestas.

```javascript
client.onMessage = async (msg) => {
    const { pattern, data, from, cid } = msg;

    // Si NO hay CID, es un evento (dispara y olvida)
    if (!cid) return await productService[pattern](data);

    try {
        const result = await productService[pattern](data);
        
        // REGLA DE ORO: Si falla, devolver status: 'error' para que la cola lo reintente
        if (!result || result.status === 'error') {
            return client.send(from, 'res', result || { status: 'error' }, cid);
        }

        // Respuesta exitosa: siempre incluir el CID recibido
        client.send(from, 'res', result, cid);
    } catch (error) {
        client.send(from, 'res', { status: 'error', message: error.message }, cid);
    }
};

```

---

## 📦 Sistema de Colas Inteligentes

Las colas en Serviq no son simples buffers en memoria; son **persistentes (SQLite)** y cuentan con **Retry Progresivo**.

```javascript
// serviq/queue.js
import serviq from 'serviq';

const queue_a = serviq.tcpQueue(4000, 'queue_a');
queue_a.start();

// Se ejecuta cuando el mensaje se procesó con éxito tras reintentos
queue_a.onSuccess = (res) => {
    console.log('Procesado con éxito:', res);
};

// Se ejecuta cuando se superan los 5 reintentos fallidos
queue_a.onFaild = (err) => {
    console.log('Límite de reintentos alcanzado:', err);
};

```

### ¿Cómo funcionan los reintentos?

Si un servicio responde con `{ status: 'error' }` o está desconectado, la cola captura el mensaje y aplica un **Exponential Backoff**:

1. Reintenta cada cierto tiempo de forma progresiva.
2. Si falla 5 veces consecutivas (`MAX_ATTEMPTS`), el mensaje se mueve a la **DLQ (Dead Letter Queue)** y dispara el evento `onFaild`.

---

## 📑 Reglas de Comunicación (Protocolo Serviq)

Para que el balanceo y la fiabilidad funcionen, sigue estas convenciones:

### 1. Palabras Clave en Patterns

El Broker detecta ciertos prefijos para decidir si el mensaje va a una **Cola** o es **Directo** (Carril Rápido):

* **Carril Rápido (Directo):** Si el patrón empieza por `get`, `on` o `res` (ej: `getUser`, `onAlert`, `res_product`), el mensaje salta la cola y va directo al servicio. Ideal para lecturas rápidas o respuestas.
* **Carril de Cola (Persistente):** Cualquier otro patrón (ej: `postProduct`, `updateStock`) pasará por el sistema de colas y balanceo.

### 2. Parámetros del método `send`

`client.send(to, pattern, data, cid, res)`

* **`to`**: Nombre del microservicio destino.
* **`pattern`**: Nombre de la función a ejecutar.
* **`data`**: **Siempre debe ser un objeto** (puede ser `{}`).
* **`cid`**: Generado automáticamente por el Broker, pero debes devolverlo en las respuestas.
* **`res`**: Si no quieres esperar respuesta, ponlo en `false` para liberar recursos.

### 3. Estados de Respuesta (`status`)

* **`success`**: La operación se completó correctamente.
* **`error`**: Algo falló. **Importante:** Devolver este estado es lo que le indica a la cola que debe guardar el mensaje para reintentarlo después.
* **`pending`**: Si envías algo a una cola y el servicio está ocupado o caído, el emisor recibirá este estado indicando que el mensaje está seguro en persistencia.

---

## 🔍 Métodos de Inspección de Colas

Puedes acceder a la información almacenada en las colas mediante estos métodos:

* `getMessages(tableName)`: Obtiene todos los mensajes (pendientes o fallidos).
* `deleteMessage(tableName, cid)`: Elimina un mensaje específico.
* `clearAll(tableName)`: Limpia una tabla por completo.