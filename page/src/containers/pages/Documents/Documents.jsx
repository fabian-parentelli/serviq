import './documents.css';
import { useRef } from 'react';
import DocNav from './DocNav/DocNav.jsx';
import DocBody from './DocBody/DocBody.jsx';
import Sidebar from './Sidebar/Sidebar.jsx';
import { useQueryParams } from '@/hooks/useParams.jsx';
import useScrollPosition from '@/hooks/useScrollPosition.jsx';

const Documents = () => {

    const docBodyRef = useRef(null);

    const [params, setParams] = useQueryParams();
    const { percentage } = useScrollPosition(docBodyRef);

    return (
        <div className="documents">
            <Sidebar params={params} setParams={setParams} />
            <DocBody params={params} setParams={setParams} docBodyRef={docBodyRef} />
            <DocNav params={params} percentage={percentage} docBodyRef={docBodyRef} />
        </div>
    );
};

export default Documents;