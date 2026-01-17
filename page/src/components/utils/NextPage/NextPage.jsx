import './nextPage.css';
import { nextpage } from './nextpage.js';

const NextPage = ({ params, setParams }) => {

    return (
        <div className="nextPage">

            {!nextpage[params.sect]?.before ? <div></div>
                : <section onClick={() => setParams({ sect: nextpage[params.sect]?.before })}>
                    <p>Página anterior</p>
                    <h5>{nextpage[params.sect]?.nameBefore}</h5>
                </section>
            }

            {!nextpage[params.sect]?.after ? <div></div>
                : <section onClick={() => setParams({ sect: nextpage[params.sect]?.after })}>
                    <p>Página siguiente</p>
                    <h5>{nextpage[params.sect]?.nameAfter}</h5>
                </section>
            }
        </div>
    );
};

export default NextPage;