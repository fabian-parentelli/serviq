import './documents.css';
import DocNav from './DocNav/DocNav.jsx';
import DocBody from './DocBody/DocBody.jsx';
import Sidebar from './Sidebar/Sidebar.jsx';
import { useQueryParams } from '@/hooks/useParams.jsx';

const Documents = () => {

    const [params, setParams] = useQueryParams();

    console.log(params);


    return (
        <div className="documents">
            <Sidebar params={params} setParams={setParams} />
            <DocBody />
            <DocNav />
        </div>
    );
};

export default Documents;