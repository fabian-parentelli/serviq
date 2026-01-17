import './codeCont.css';
import { Icons } from 'fara-comp-react';

const CodeCont = ({ lenguage = 'JavaScript', children }) => {

    return (
        <div className="codeCont">

            <section className='codeContTop'>
                <p>{lenguage}</p>
                <Icons type='copy' color='#2c2c2c' hover={true} size='20px' />
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