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
    { title: 'Instalación', link: 'import' },
];