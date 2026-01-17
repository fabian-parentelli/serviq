import './body.css';
import { useLayoutEffect } from 'react';
import Header from './Header/Header.jsx';
import WhatIs from './WhatIs/WhatIs.jsx';
import { useLocation } from 'react-router-dom';
import GoDoc from './GoDoc/GoDoc.jsx';

const Body = () => {

    const location = useLocation();

    useLayoutEffect(() => {
        if (location.hash) {
            const id = location.hash.slice(1);
            const scroll = () => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            };
            requestAnimationFrame(scroll);
        }
    }, [location.pathname, location.hash]);

    return (
        <div className="body">
            <Header />
            <WhatIs />
            <GoDoc />
        </div>
    );
};

export default Body;