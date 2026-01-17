import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ScrollToTop from '../components/utils/ScrollToTop';
import Body from '../containers/Body/Body';
import NavBar from '../containers/layouts/NavBar/NavBar';
import Documents from '../containers/pages/Documents/Documents';

const RouteWrap = () => {

    return (
        <BrowserRouter>
            <ScrollToTop>

                <NavBar />

                <Routes>
                    <Route path='/' element={<Body />} />
                    <Route path='/doc' element={<Documents />} />
                </Routes>

            </ScrollToTop>
        </BrowserRouter>
    );
};

export default RouteWrap;