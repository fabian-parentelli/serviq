import './footer.css';
import { Icons } from 'fara-comp-react';
import { Link } from 'react-router-dom';

const Footer = () => {

    return (
        <div className="footer">

            <Link to={'/'} className='footerTitle'>
                <img src="/logo.png" alt="logo" />
                <h2>SERVIQ</h2>
            </Link>

            <section className='footerSect'>

                <div className='flex-col'>
                    <h4>Plataforma</h4>
                    <Link to={'/#whatIs'}>¿Qué es serviq?</Link>
                    <Link to={'/doc?sect=philosophy'}>Folosofía Serviq</Link>
                    <Link to={'/#contact'}>Contacto</Link>
                    <Link to={'/#videos'}>Videos</Link>
                </div>

                <div className='flex-col'>
                    <h4>Documentación</h4>
                    <Link to={'/doc?sect=intro'} >Compatibilidad</Link>
                    <Link to={'/doc?sect=import'} >Instalación</Link>
                    <Link to={'/doc?sect=quikstart'} >Inicio rápido</Link>
                    <Link to={'/doc?sect=send'} >Anataomía de un envío</Link>
                    <Link to={'/doc?sect=patterns'} >Patrones</Link>
                    <Link to={'/doc?sect=backoff'} >Persistencia</Link>
                    <Link to={'/doc?sect=hotswap'} >Resilencia de sesión</Link>
                    <Link to={'/doc?sect=hibrid'} >Persistencia Híbrida</Link>
                </div>

                <div className='flex-col'>
                    <h4>Blogs</h4>
                    <Link to={'/blog/architecture'}>Arquitectura</Link>
                    <Link to={'/blog/persistence'}>Persistencia</Link>
                    <Link to={'/blog/patterns'}>Patrones</Link>
                </div>

                <div className='flex-col'>
                    <h4>Comunidad</h4>
                    <a href='https://www.npmjs.com/package/fara-serviq' target='_blank'>NPM</a>
                    <a href='https://github.com/fabian-parentelli/serviq/tree/master/serviqNpm' target='_blank'>GitHub</a>
                    <Link to={'/'}>Comentar</Link>
                </div>

            </section>

            <section className='footerBot'>

                <div className='footerSocial'>
                    <img src="/logo.png" width='25px' alt="img" />
                    <h2>SERVIQ</h2>
                    <Icons hover={true} color='gray' type='youtube' />
                    <Icons hover={true} color='gray' type='instagram' />
                    <Icons hover={true} color='gray' type='x' />
                    <Icons hover={true} color='gray' type='github' />
                </div>

                <div className='footerBotCond'>
                    <a>© {new Date().getFullYear()} Faraday's House</a>
                    <img src="/fara.png" width='30px' alt="fara" />
                    <Link>Términos y condiciones</Link>
                </div>

            </section>

        </div>
    );
};

export default Footer;