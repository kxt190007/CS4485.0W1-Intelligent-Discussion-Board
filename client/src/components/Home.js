import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Link, Navigate } from 'react-router-dom'
import Layout, {disableCreate} from './Layout'
import { useNavigate } from "react-router-dom";
import { ListItemText, ListItemButton, Paper, Divider } from '@mui/material'
import Box from '@mui/material/Box';
import { Avatar, Grid, TextField, Checkbox, FormControlLabel, Typography} from '@mui/material'
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListDivider from '@mui/joy/ListDivider';
import Stack from '@mui/joy/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import {screen} from '@testing-library/dom'

function Home() {

  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [userName, setUserName] = useState("");
  const paperStyle = { padding: "30px 20px", height: '90%', width: '97%', margin: "20px auto"}

  useEffect(() => {
    async function fetchData() {
      //fetch classes list
      const classList = JSON.parse(sessionStorage.getItem('classes'))
      setClasses(classList);
      console.log(classes);
      const temp = [];
      for(let i = 0; i<classList.length; i++){
        temp.push(
          <option value = {classList[i][0]}>{classList[i][1]}</option>
        );
        setInputs(temp);
        console.log("inputs:");
        console.log(inputs);
      }
      const userData = sessionStorage.getItem('name')
      console.log(userData);
      setUserName(userData);
      console.log("classlist length:")
      console.log(inputs.length)
    }
    fetchData();

  }, []);

  const handleChange = (event) => {
    navigate("/board/" + event.target.value);
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
      <AppBar position="static" style={{ background: '#ef6c00' }}>
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
  else if(inputs.length == 0){
    return(
      <div>
        
      <Layout/>
  
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={2}
      >
  
        
        <Paper style = {paperStyle} label = "test">
  
        <h2>Looks like you are not enrolled in any classes...</h2>
        <Typography variant="body1" color="text.secondary">
              Get a class link from your professor to enroll in their class.
            </Typography>
        <Divider/>
        
      </Paper>
      </Stack>

      </div>
    )

  }
  else{
    return (
      <div>
      <Layout/>
  
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={2}
      >
  
        
        <Paper style = {paperStyle}>
  
        <h2>{userName}'s Classes</h2>
        <Divider/>
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <nav aria-label="enrolled classes">
          <List>
            {listClasses}
          </List>
        </nav>
      </Box>
      </Paper>
      </Stack>
      </div>
    )
  }
  
}

export default Home
