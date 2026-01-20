import './sidebar.css';

const Sidebar = ({ params, setParams }) => {

    return (
        <div className="sidebar">
            {sidebarData.map((doc, ind) => (
                <p key={ind} onClick={() => setParams({ sect: doc.link })}
                    style={{ color: params?.sect === doc?.link ? '#00cfff' : '#ffffff' }}
                >
                    {doc.title}
                </p>
            ))}
        </div>
    );
};

export default Sidebar;

const sidebarData = [
    { title: 'Introducción', link: 'intro' },
    { title: 'Filosofía Serviq', link: 'philosophy' },
    { title: 'Instalación', link: 'import' },
    { title: 'Inicio rápido', link: 'quikstart' },
    { title: 'Anatomia de un envío', link: 'send' },
    { title: 'Patterns', link: 'patterns' },
    { title: 'Persistencia progresiva', link: 'backoff' },
];