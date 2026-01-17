import './goDoc.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from 'fara-comp-react';

const GoDoc = () => {

    const [color, setColor] = useState(false)

    return (
        <div className="goDoc">

            <section>
                <img src="/logo.png" alt="" />
                <h3>SERVIQ</h3>
            </section>

            <Link to={'/doc?sect=intro'}
                onMouseEnter={() => setColor(true)}
                onMouseLeave={() => setColor(false)}
            >
                <Icons type='clipboard' color={color ? '#00cfff' : '#ffffff'} size='20px' />
                <p>Documentación</p>
            </Link>
        </div>
    );
};

export default GoDoc;