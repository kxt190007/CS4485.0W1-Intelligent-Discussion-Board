import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Link, Navigate } from 'react-router-dom'
import Layout from './Layout'
import {useNavigate} from "react-router-dom";
import { List,ListItem, ListItemText, ListItemButton, Grid, Paper, CssBaseline} from '@mui/material'
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import Image from '../image/Background1.jpg'; // Import using relative path




function Home() {

  const navigate = useNavigate();
  const [classes, setClasses] = useState([{}]);
  const [inputs, setInputs] = useState([]);
  const [userName, setUserName] = useState("");


  useEffect(() =>{
    async function fetchData(){
      //fetch classes list
      const classList = JSON.parse(sessionStorage.getItem('classes'))
      console.log(classList);
      setClasses(classList);
      console.log(classes);
      const temp = [];
      for(let k in classList){
        console.log(k);
        temp.push(
          <option value = {k}>{classList[k]}</option>
        );
        setInputs(temp);
        console.log(inputs);
      }
      const userData = sessionStorage.getItem('name')
      console.log(userData);
      setUserName(userData);
    }
    fetchData();

  }, []);

  const handleChange = (event) =>{
    sessionStorage.setItem('chosenClass', event.target.value)
    console.log(sessionStorage.getItem('chosenClass'))
    navigate("/board");
  }

  let listClasses = inputs.map((x) => 
    <>
    <ListItem disablePadding onClick = {(e) => handleChange(e)}>
            <ListItemButton >
              <ListItemText primary={x}/>
            </ListItemButton>
          </ListItem>

    </>
  );

 

  if(!sessionStorage.getItem('token')){
    return (
      <Grid>
      <Box sx={{ flexGrow: 1}} > 
      <AppBar position="static" style={{ background: '#f57c00' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <HomeIcon 
            href="/login"/>
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
          
          <Button color="inherit" href="/login">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
    <Typography variant="h2" align="center">
    Welcome to Intelligent Discussion Board

    </Typography>
    </Grid>
    )
  }



  return (
    <div>
      <Layout/>
      <p>Home Page</p>

      <h2>{userName}'s Classes</h2>
      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="main mailbox folders">
        <List>
          {listClasses}
        </List>
      </nav>
    </Box>
    </div>
  )
}

export default Home
