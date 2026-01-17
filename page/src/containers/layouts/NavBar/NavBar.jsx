import './navBar.css';
import { Icons } from 'fara-comp-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {

    const navigate = useNavigate();

    const [menu, setMenu] = useState(false);
    const [showNav, setShowNav] = useState(true);
    const [startLocation, setStartLocation] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            currentScroll > startLocation ? setShowNav(false) : setShowNav(true);
            setStartLocation(currentScroll);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [startLocation]);

    const navStyle = {
        transition: '0.3s',
        top: showNav ? '0' : '-100px',
        boxShadow: showNav && startLocation > 0 ? '1px 1px 3px rgb(29, 28, 28)' : 'none'
    };

    const handleGo = (link) => {
        navigate(`/${link}`);
        setMenu(false);
    }

    return (
        <div className='navBar' style={navStyle}>

            <section className='navBarSect'>

                <div className='navBarSectTitle' onClick={() => handleGo('')}>
                    <img src="/logo.png" alt="img" width='28px' />
                    <h1>Serviq</h1>
                </div>

                <div className='flex-center navBarDiv'>
                    <Link to={'/#whatIs'} >Que es</Link>
                    <Link to={'/doc?sect=intro'} >Documentación</Link>
                    <Link to={'/blog'} >Blog</Link>
                    <Link to={'/com'} >Comunidad</Link>
                    <Link to={'/help'} >Ayuda</Link>
                </div>

                <div className='navBarHamb' onClick={() => setMenu(!menu)}>
                    <Icons type='menu' color='#ffffff' />
                </div>

                <ul className={`navBarHambCont ${menu ? 'nvhcOpen' : 'nvhcClosed'}`}>
                    <li onClick={() => handleGo('#whatIs')} >Que es</li>
                    <li onClick={() => handleGo('doc?sect=intro')} >Documentación</li>
                    <li onClick={() => handleGo('blog')} >Blog</li>
                    <li onClick={() => handleGo('com')} >Comunidad</li>
                    <li onClick={() => handleGo('help')} >Ayuda</li>
                </ul>

            </section>

        </div>
    );
};

export default NavBar;