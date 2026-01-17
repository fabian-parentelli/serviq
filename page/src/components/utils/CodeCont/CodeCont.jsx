import './codeCont.css';
import { useState } from 'react';
import { Icons } from 'fara-comp-react';

const CodeCont = ({ lenguage = 'JavaScript', paste, children }) => {

    const [copy, setCopy] = useState(false);

    const handleCopy = () => {
        setCopy(true);
        navigator.clipboard.writeText(paste);
        setTimeout(() => { setCopy(false) }, 2000)
    };

    return (
        <div className="codeCont">

            <section className='codeContTop'>
                <p>{lenguage}</p>
                {paste &&
                    <Icons
                        type={copy ? 'success' : 'copy'} color='#2c2c2c' hover={true} size='20px'
                        onClick={handleCopy}
                    />
                }
            </section>

            <section className='codeContBottom'>
                <pre>
                    <code>
                        {children}
                    </code>
                </pre>
            </section>
        </div>
    );
};

export default CodeCont;