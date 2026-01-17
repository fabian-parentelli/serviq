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
        after: null,
        nameAfter: null
    },
};

export { nextpage };