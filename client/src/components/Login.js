import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Outlet, Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import PropTypes from 'prop-types'
import UserProfile from './UserProfile.js'
import Layout from './Layout.js'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Avatar, Grid, Paper, TextField, Checkbox, FormControlLabel, Typography} from '@mui/material'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState([{}])
  const [text, setText] = useState("");
  const navigate = useNavigate();

  async function loginUser(credentials){
    return fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
    .then(
      res=>res.json()
    )
  }
  async function getClass(credentials){
    return fetch("http://localhost:5000/getClasses",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials),
    })
    .then(
      res=>res.json()
    )
  }
  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      email,
      password
    });
    console.log(token.token);
    if(token.token !== ''){
      const token1 = await getClass({
        userID : token.token
      });
      const user = new UserProfile(token.token, token.email, token.password, token.name, token.lastname, token1.classList, token.accesslevel);
      console.log(user.userID)
      console.log(user)
      sessionStorage.setItem('user', JSON.stringify(user))
      sessionStorage.setItem('token', user.userID);
      sessionStorage.setItem('email', user.email);
      sessionStorage.setItem('name', user.name);
      sessionStorage.setItem('lastname', user.lastName);
      sessionStorage.setItem('password', user.password);
      sessionStorage.setItem('accesslevel', user.accesslevel);
      sessionStorage.setItem('classes', JSON.stringify(user.classes));
      console.log(sessionStorage.getItem('classes'));
      navigate("/");
    }
    else{
      setText("Incorrect email or password")
    }
  }

  
  const paperStyle = { padding: "70px 20px", height: '40vh', width: 450, margin: "110px auto" }
  const avatarStyle = { backgroundColor: '#ef6c00' }
  const btnStyle = { margin: '40px 0'}

  return (
    
    <Grid sx={{backgroundImage:'url(https://utdmercury.com/wp-content/uploads/2019/08/utdallas_min-1024x683.jpg)', backgroundSize: 'cover', height: '100vh'}}>
      <Box sx={{ flexGrow: 1}}> 
      <AppBar position="static" style={{ background: '#ef6c00' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            href="/"
            sx={{ mr: 2 }}
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
          <Button color="inherit" href="/login" size="large">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
      
      <Paper elevation={10} style={paperStyle}>
        <Grid align='center'>
          <Avatar style={avatarStyle}><AccountBoxIcon /></Avatar>
          <h2>User Login</h2>
        </Grid>
        <form onSubmit={handleSubmit}>
          <TextField 
            id="standard-basic" 
            label="Email" 
            variant="standard" 
            fullWidth required 
            onChange={(e) => setEmail(e.target.value)}/>
          <TextField 
            id="standard-basic" 
            label="Password" 
            type='password' 
            variant="standard" 
            fullWidth required 
            onChange={(e) => setPassword(e.target.value)}/>

          <Button type = 'submit' variant="contained" style={btnStyle} fullWidth>Login</Button>
          <p>{text}</p>
        </form>
        <Typography variant="caption" display="block" gutterBottom sx={{ ml: 1 }}>
        Not a user yet?
      </Typography>
        <Button color="secondary" href="/register">
          Sign up here!
          </Button>
        
      </Paper>
      
    </Grid>
  )
}



export default Login