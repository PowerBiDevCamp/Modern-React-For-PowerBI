import { useNavigate } from 'react-router-dom';

import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Assessment } from '@mui/icons-material';

import Login from './LoginMenu';

const Banner = () => {
  let navigate = useNavigate();

  return (
        <AppBar position="relative" sx={{ zIndex:2, paddingLeft:2, background: "linear-gradient(to right bottom, #00498D, #02386E)" }} >
          <Toolbar variant='dense' disableGutters >
            <IconButton onClick={() => { navigate("/") }} size="large" edge="start" color="inherit" aria-label="menu" sx={{ }} >
              <Assessment sx={{mr:2}} />
              <Typography variant="h6" flexGrow={0} >Modern React SPA for Power BI</Typography>
            </IconButton>
            <Login />
          </Toolbar>
        </AppBar>
  )
}

export default Banner;