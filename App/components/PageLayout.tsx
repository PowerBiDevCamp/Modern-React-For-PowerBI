import { Route, Routes } from "react-router-dom";

import Banner from './Banner';
import LeftNav from './LeftNav';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Report from './pages/Report';
import Workspace from './pages/Workspace';
import PageNotFound from './PageNotFound';

import { Box } from '@mui/material';

const PageLayout = () => {

    return (
        <Box>
            <Banner />
            <Box sx={{ display: "flex" }} >
                <LeftNav />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="workspaces/:id" element={<Workspace />} />
                    <Route path="reports/:path" element={<Report />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Box>
        </Box>
    )
}

export default PageLayout