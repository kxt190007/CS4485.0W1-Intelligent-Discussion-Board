import React, { useState, useEffect } from 'react'
import { Avatar, Grid, Paper, TextField, Checkbox, FormControlLabel, Button, Typography, Link } from '@mui/material'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Layout from './Layout.js'
import {useNavigate} from "react-router-dom";
import UserProfile from './UserProfile.js'
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';

const Register = () => {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [text, setText] = useState("");
  const navigate = useNavigate();

  async function createUser(credentials){
    return fetch("http://localhost:5000/createUser",{
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
    e.preventDefault()
    setText("")
    if(email.search("@utdallas.edu") !== email.length - 13){
      setText("Email must end in @utdallas.edu")
    }
    else{
      const token = await createUser({
        firstName,
        lastName,
        email,
        password
      });
      if(token.status === "Failed"){
        setText("Email already exists")
      }
      else{
        const classList = []
        const user = new UserProfile(token.token, token.email, token.password, token.name, token.lastname, classList, token.accesslevel);
        console.log(user.userID)
        console.log(user)
        sessionStorage.setItem('user', JSON.stringify(user))
        sessionStorage.setItem('token', user.userID);
        sessionStorage.setItem('email', user.email);
        sessionStorage.setItem('name', user.name);
        sessionStorage.setItem('lastname', user.lastname);
        sessionStorage.setItem('password', user.password);
        sessionStorage.setItem('accesslevel', user.accesslevel);
        sessionStorage.setItem('classes', JSON.stringify(user.classes));
        console.log(sessionStorage.getItem('classes'));
        navigate("/");
      }
    }
  }

  const paperStyle = { padding: "30px 20px", height: '55vh', width: 320, margin: "100px auto" }
  const avatarStyle = { backgroundColor: '#ef6c00' }
  const btnStyle = { margin: '40px 0' }

  return (

    <Grid>
      <Box sx={{ flexGrow: 1 }}> 
      <AppBar position="static" style={{ background: '#ef6c00' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            href="/"
            aria-label="menu"
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
          <Button color="inherit" href="/login" >Login</Button>
        </Toolbar>
      </AppBar>
    </Box>

    <Layout />
      <Paper elevation={10} style={paperStyle}>
        <Grid align='center'>
          <Avatar style={avatarStyle}><AccountBoxIcon /></Avatar>
          <h2>User Registration</h2>
        </Grid>
        <form onSubmit={handleSubmit}>
          <TextField 
            id="standard-basic" 
            label="First Name" 
            variant="standard" 
            fullWidth required 
            onChange={(e) => setFirstName(e.target.value)}/>
          <TextField 
            id="standard-basic" 
            label="Last Name" 
            variant="standard" 
            fullWidth required
            onChange={(e) => setLastName(e.target.value)}/>
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

          <Button type = 'submit' variant="contained" style={btnStyle} fullWidth>Sign up</Button>
          <p>{text}</p>
        </form>
      </Paper>
    </Grid>
    
  )
}

export default Register