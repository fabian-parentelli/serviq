import './docNav.css';
import { data } from './docsNav.js';

const DocNav = ({ params, percentage, docBodyRef }) => {

    const scrollToPercentage = (percent) => {
        const el = docBodyRef.current;
        if (!el) return;
        const maxScroll = el.scrollHeight - el.clientHeight;
        const targetScrollTop = (percent / 100) * maxScroll;
        el.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
        });
    };

    return (
        <div className="docNav">
            <div>
                <h4>{data[params.sect]?.name}</h4>
                {params?.sect && data[params?.sect]?.positons.map((doc, ind) => (
                    <p key={ind}
                        style={{ color: percentage >= doc?.position ? '#ffffff' : 'gray' }}
                        onClick={() => scrollToPercentage(doc?.position)}
                    >
                        {doc.text}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default DocNav;