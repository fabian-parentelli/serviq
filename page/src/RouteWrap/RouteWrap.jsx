import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ScrollToTop from '../components/utils/ScrollToTop';
import Body from '../containers/Body/Body';
import NavBar from '../containers/layouts/NavBar/NavBar';

const RouteWrap = () => {

    return (
        <BrowserRouter>
            <ScrollToTop>

                <NavBar />

                <Routes>
                    <Route path='' element={<Body />} />
                </Routes>

            </ScrollToTop>
        </BrowserRouter>
    );
};

export default RouteWrap;