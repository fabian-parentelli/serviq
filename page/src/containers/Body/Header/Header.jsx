import './header.css';

const Header = () => {

    return (
        <div className="header">

            <section className='headerSect'>
                <img src="/logo.png" alt="logo" />
                <h2>SERVIQ</h2>
            </section>

            <p className='headerSubTitle'>Mensajería persistente y balanceo de carga para microservicios que priorizan la fiabilidad.</p>

            <section className='headerButtons'>
                <button style={{ width: '150px' }} className='btn btnA' >Documentación</button>
                <button style={{ width: '150px' }} className='btn btnB' >Contacto</button>
            </section>
            
        </div>
    );
};

export default Header;