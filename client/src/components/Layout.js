import { Outlet, Link } from "react-router-dom";
//import Button from '@mui/joy/Button';
import { Avatar, Grid, Paper, TextField, Checkbox, FormControlLabel, Typography} from '@mui/material'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'



function Layout(){
 
  
  if (!sessionStorage.getItem('token')) {
    return (
      <>
        <nav>
          <ul>
            {/* <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/create">Create</Link>
            </li> */}
          </ul>
        </nav>

        <Outlet />
      </>
    )
  }



  if(sessionStorage.getItem('accesslevel') == 0){
    return (
      <Grid>
      <Grid>
      <Box display="flex" sx={{ flexGrow: 1 }}> 
      <AppBar position="static" style={{ background: '#ef6c00' }} sx={{ mr: 215}} >
        <Toolbar style={{ justifyContent: 'space-between' }} >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            href="/"
            sx={{ mr: 2.5 }}
          >
            <HomeIcon />
          </IconButton>
        <Button  color="inherit" >
         <Link to="/logout">Log out</Link>
        </Button>
        </Toolbar>
      </AppBar>
    </Box>
    </Grid>
    
    <Grid>
    <Box display="flex" sx={{ flexGrow: 1 }} style={{ height: '100%' }}> 
    <AppBar position="static" style={{ background: '#f57c00' }} >
      <Toolbar>
      <Button color="inherit"> 
      <Link to="/create">Create Post</Link>
      </Button>
      </Toolbar>
    </AppBar>
  </Box>
  </Grid>
  </Grid>
    )
  }

      /*
      <div>
        <Breadcrumbs size = "md" separator="" align= "center">
        <Button size="md"  variant="plain" color="primary">
        <Link to="/logout">Log out</Link>
        </Button>
          
        <Button size="md"  variant="plain" color="primary">
          <Link to="/">Home</Link>
        </Button>

        <Button size="md"  variant="plain" color="primary">
        <Link to="/create">Create Post</Link>

        </Button>
        </Breadcrumbs>

        <Outlet />
      </div>
      */
      






  if(sessionStorage.getItem('accesslevel') == 5){
    return (
      <>
       {/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
             <li>
              <Link to="/login">Login</Link>
            </li> 
            <li>
              <Link to="/create">Create Post</Link>
            </li>
            <li>
              <Link to="/classes">Classes</Link>
            </li>
            <li>
              <Link to="/logout">Log out</Link>
            </li>
          </ul>
        </nav> */}
              <Grid>
            <Grid>
            <Box display="flex" sx={{ flexGrow: 1 }}> 
            <AppBar position="static" style={{ background: '#ef6c00' }} sx={{ mr: 215}} >
              <Toolbar style={{ justifyContent: 'space-between' }} >
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  href="/"
                  sx={{ mr: 2.5 }}
                >
                  <HomeIcon />
                </IconButton>
              <Button  color="inherit" >
              <Link to="/logout">Log out</Link>
              </Button>
              </Toolbar>
            </AppBar>
          </Box>
          </Grid>
          
          <Grid>
          <Box display="flex" sx={{ flexGrow: 1 }} style={{ height: '100%' }}> 
          <AppBar position="static" style={{ background: '#f57c00' }} >
            <Toolbar>
            <Button color="inherit"> 
            <Link to="/classes">Classes</Link>
            </Button>
            <Button color="inherit"> 
            <Link to="/create">Create Post</Link>
            </Button>
            </Toolbar>
          </AppBar>
        </Box>
        </Grid>
        </Grid>
        <Outlet />
      </>
    )
  }
}

export default Layout;