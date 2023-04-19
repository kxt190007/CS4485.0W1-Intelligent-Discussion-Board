import { Outlet, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react'
//import Button from '@mui/joy/Button';
import { Avatar, Grid, Paper, TextField, Checkbox, FormControlLabel, Typography} from '@mui/material'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'


function disableCreate(event){
  event.disabled = true
}
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
      <Grid sx={{ 
        maxWidth: "100%",
      }}>
      <Grid>
      <Box display="flex" sx={{ flexGrow: 1}}> 
      <AppBar position="relative" style={{ background: '#ef6c00' }} sx={{ mr: 215}} >
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
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1 
            }}
          >
            INTELLIGENT DISCUSSION BOARD
          </Typography>
          <Button color="inherit" href="/profile">Profile</Button>
      
        <Button  variant="secondary" href="/logout" size="large">
         Log out
        </Button>
        </Toolbar>
      </AppBar>
    </Box>
    </Grid>
    
    <Grid>
    <Box display="flex" sx={{ flexGrow: 1 }} style={{ height: '100%' }}> 
    <AppBar position="static" style={{ background: '#f57c00' }} >
      <Toolbar>
      <Button color="inherit" disabled={false} label="create post button" href="/create" size="large"> 
      Create Post
      </Button>
      </Toolbar>
    </AppBar>
  </Box>
  </Grid>
  </Grid>
    )
  }


  if(sessionStorage.getItem('accesslevel') == 5){
    return (
      <>
    
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
                <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1 
            }}
          >
            INTELLIGENT DISCUSSION BOARD
          </Typography>
          <Button color="inherit" href="/profile">Profile</Button>
          <Button  variant="secondary" href="/logout" size="large">
              Log out
             </Button>
              </Toolbar>
            </AppBar>
          </Box>
          </Grid>
          
          <Grid>
          <Box display="flex" sx={{ flexGrow: 1 }} style={{ height: '100%' }}> 
          <AppBar position="static" style={{ background: '#f57c00' }} >
            <Toolbar>
            
            <Button color="inherit" href="/classes" size="large"> 
              Classes
            </Button>
            <Button color="inherit" href="/create-class" size="large"> 
              Create Class
            </Button>
            <Button color="inherit" href="/create" size="large"> 
              Create Post
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

export {disableCreate};
export default Layout;