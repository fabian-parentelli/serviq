const data = {
    intro: {
        name: 'Introducción',
        positons: [
            { text: 'Descripción general', position: 10 },
            { text: 'Compatibilidad', position: 75 },
            { text: 'Notas de estabilidad', position: 95 },
        ]
    },
    philosophy: {
        name: 'Filosofía Serviq',
        positons: [
            { text: 'TCP sobre HTTP', position: 25 },
            { text: 'Persistencia híbrida', position: 65 },
            { text: 'Cero configuración externa', position: 75 },
            { text: '¿Cuándo elegir Serviq?', position: 95 },
        ]
    },
    import: {
        name: 'Instalación',
        positons: [
            { text: 'Requisitos Previos', position: 15 },
            { text: 'Comando de instalación', position: 30 },
            { text: 'Estructura de archivos Automática', position: 60 },
            { text: 'Configuración inicial', position: 90 },
            { text: '¿Qué pasa si la carpeta /queues no existe?', position: 99 },
        ]
    },
    quikstart: {
        name: 'Inicio rápido',
        positons: [
            { text: 'Inicialización del Broker', position: 5 },
            { text: 'Configuración del Cliente (Service)', position: 35 },
            { text: 'El Ciclo de Vida del Mensaje en el Cliente', position: 83 },
        ]
    },
    send: {
        name: 'Anatomía de un envío',
        positons: [
            { text: 'Estructura de la función', position: 5 },
            { text: 'Ejemplo de implementación', position: 50 },
            { text: 'Payload', position: 90 },
        ]
    },
    patterns: {
        name: 'Patterns',
        positons: [
            { text: 'Lógica de Patterns', position: 5 },
            { text: 'Comportamiento según el prefijo', position: 25 },
            { text: 'El manejo de error', position: 95 },
        ]
    },
    backoff: {
        name: 'Patterns',
        positons: [
            { text: 'Reintentos', position: 5 },
            { text: 'Gestión de Errores', position: 35 },
            { text: 'Eventos de notificación', position: 95 },
        ]
    },
    hotswap: {
        name: 'Resiliencia de Sesión',
        positons: [
            { text: 'Hot-Swap', position: 5 },
            { text: 'Recuperación Automática', position: 85 },
        ]
    },
    identifier: {
        name: 'Anatomía del Payload',
        positons: [
            { text: 'El Identificador de Correlación (cid)', position: 5 },
            { text: 'Estructura de un Mensaje Estándar', position: 35 },
            { text: '¿Para que sirve el cid?', position: 85 },
            { text: 'Propagación de CID', position: 95 },
        ]
    },
    hibrid: {
        name: 'Persistencia Híbrida',
        positons: [
            { text: 'La carpeta /queues', position: 5 },
            { text: 'Estructura de archivos', position: 25 },
            { text: '¿Por qué múltiples archivos .db?', position: 70 },
            { text: 'Anatomía interna de una Queue', position: 80 },
            { text: 'Estabilidad', position: 95 },
        ]
    },
    problem: {
        name: 'Solución de problemas',
        positons: [
            { text: 'El emisor recibe un Timeout Error', position: 5 },
            { text: 'El mensaje queda en status: pending pero no se entrega', position: 55 },
            { text: 'Error ECONNREFUSED al conectar', position: 80 },
            { text: 'Los archivos .db no se crean', position: 95 }
        ]
    },
};

export { data };