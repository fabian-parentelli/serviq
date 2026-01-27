import './blogs.css';
import { Link } from 'react-router-dom';
import { blogs } from '@/Utils/blogs.utils.js';

const Blog = () => {

    return (
        <div className="blogs">

            <section className='blogsSect'>
                <h2>Serviq Blog</h2>
                <h3>Comunicación persistente para sistemas distribuidos</h3>
                <p>Explora el ecosistema de Serviq: una nueva forma de entender la comunicación entre servicios en Node.js. En este blog compartimos guías, patrones de diseño y estrategias de arquitectura centradas en la simplicidad y la robustez. Aprende a implementar colas de mensajes, motores de reintentos y persistencia nativa con una herramienta que prioriza tu tiempo y la estabilidad de tu código.</p>
            </section>

            <section className='blogsSectCards'>
                {blogs.map((doc, ind) => (
                    <Link key={ind} className='blogsCard' to={`/blog/${doc.link}`}>
                        <img src={doc.img} alt="img" />
                        <h4>{doc.title}</h4>
                        <p className='pgray'>{doc.subTitle}</p>
                    </Link>
                ))}
            </section>

        </div>
    );
};

export default Blog;