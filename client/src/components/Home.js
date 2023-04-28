import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Link, Navigate } from 'react-router-dom'
import Layout, {disableCreate} from './Layout'
import { useNavigate } from "react-router-dom";
import { ListItemText, ListItemButton, Paper, Divider } from '@mui/material'
import Box from '@mui/material/Box';
import { Avatar, Grid, CircularProgress, Typography} from '@mui/material'
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
  const [fetchDone, setFetchDone] = useState(false)

  useEffect(() => {
    async function fetchData() {
      //fetch classes list
      const token = await fetch("http://localhost:5000/getClasses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userID: sessionStorage.getItem('token')
      }),
    })
      .then((response) => response.json())
      const classList = token.classList
      setClasses(classList)
      const temp = [];
      for(let i = 0; i<classList.length; i++){
        temp.push(
          <ListItem disablePadding onClick = {() => handleChange(classList[i][0])}>
            <ListItemButton >
              <ListItemText primary={classList[i][1]}/>
            </ListItemButton>
          </ListItem>
        );
        setInputs(temp);
      }
      const userData = sessionStorage.getItem('name')
      setUserName(userData);
      setFetchDone(true)
    }
    fetchData();

  }, []);

  const handleChange = (classID) => {
    navigate("/board/" + classID);
  }

  if(!sessionStorage.getItem('token') && fetchDone){
    return (
      <Grid sx={{backgroundImage:'url(https://utdmercury.com/wp-content/uploads/2019/08/utdallas_min-1024x683.jpg)', backgroundSize: 'cover', height: '100vh'}}>
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
            href="/#/login"/>
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
          <Button color="inherit" href="/#/login">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
    <Typography variant="h1" align="center" marginTop={3} sx={{ fontFamily: 'Segoe UI', color:'white' }}>
    Welcome to Intelligent Discussion Board
    </Typography>
    </Grid>
    )
  }
  else if(inputs.length == 0 && fetchDone){
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
  else if(fetchDone){
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
            {inputs}
          </List>
        </nav>
      </Box>
      </Paper>
      </Stack>
      </div>
    )
  }
  else{
    return (
      <Grid >
      <Layout/>
      <Box sx={{ display: 'flex',justifyContent: 'center', marginTop: '300px'}}>
      <CircularProgress style={{ color: 'orange' }} size={80}/>
      </Box>
      </Grid>
      )
  }
}

export default Home
