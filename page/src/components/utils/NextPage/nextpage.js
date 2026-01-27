const nextpage = {
    intro: {
        before: null,
        nameBefore: null,
        after: 'philosophy',
        nameAfter: 'Filosofía'
    },
    philosophy: {
        before: 'intro',
        nameBefore: 'Introducción',
        after: 'import',
        nameAfter: 'Instalación'
    },
    import: {
        before: 'philosophy',
        nameBefore: 'Filosofía',
        after: 'quikstart',
        nameAfter: 'Inicio rápido'
    },
    quikstart: {
        before: 'import',
        nameBefore: 'Instalación',
        after: 'send',
        nameAfter: 'Anatomía de un envío'
    },
    send: {
        before: 'quikstart',
        nameBefore: 'Inicio rapido',
        after: 'patterns',
        nameAfter: 'Patterns'
    },
    patterns: {
        before: 'send',
        nameBefore: 'Anatomía de un envío',
        after: 'backoff',
        nameAfter: 'Persistencia progresiva'
    },
    backoff: {
        before: 'patterns',
        nameBefore: 'Patters',
        after: 'hotswap',
        nameAfter: 'Resilencia de sesión'
    },
    hotswap: {
        before: 'backoff',
        nameBefore: 'Persistencia progresiva',
        after: 'identifier',
        nameAfter: 'Anatomía del Payload'
    },
    identifier: {
        before: 'hotswap',
        nameBefore: 'Resilencia de sesión',
        after: 'hibrid',
        nameAfter: 'Persistencia híbrida'
    },
    hibrid: {
        before: 'identifier',
        nameBefore: 'Anatomía del Payload',
        after: 'problem',
        nameAfter: 'Solución de problemas'
    },
    problem: {
        before: 'hibrid',
        nameBefore: 'Persistencia híbrida',
        after: null,
        nameAfter: null
    },
    
};

export { nextpage };