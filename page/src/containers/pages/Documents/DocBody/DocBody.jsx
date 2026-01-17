import './docBody.css';
import { useEffect } from 'react';
import DocIntro from './docs/DocIntro.jsx';
import DocInstall from './docs/DocInstall.jsx';
import DocQuikDtart from './docs/DocQuikDtart.jsx';
import DocPhilosophy from './docs/DocPhilosophy.jsx';
import NextPage from '@/components/utils/NextPage/NextPage.jsx';

const DocBody = ({ params, setParams, docBodyRef }) => {

    useEffect(() => {
        const el = docBodyRef.current;
        if (!el) return;
        el.scrollTo({ top: 0, behavior: 'smooth' });
    }, [params.sect]);

    return (
        <div className="docBody" ref={docBodyRef}>
            {params.sect === 'intro' && <DocIntro />}
            {params.sect === 'philosophy' && <DocPhilosophy />}
            {params.sect === 'import' && <DocInstall />}
            {params.sect === 'quikstart' && <DocQuikDtart />}

            <NextPage params={params} setParams={setParams} />
        </div>
    );
};

export default DocBody;