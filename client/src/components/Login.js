import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Outlet, Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import PropTypes from 'prop-types'
import UserProfile from './UserProfile.js'
import Layout from './Layout.js'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Avatar, Grid, Paper, TextField, Checkbox, FormControlLabel, Typography} from '@mui/material'

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
      const classList = await getClass({
        userID : token.token
      });
      const user = new UserProfile(token.token, token.email, token.password, token.name, token.lastname, classList, token.accesslevel);
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

  const paperStyle = { padding: "30px 20px", height: '60vh', width: 320, margin: "20px auto" }
  const avatarStyle = { backgroundColor: 'orange' }
  const btnStyle = { margin: '8px 0' }

  return (
    <Grid>
      <Layout />
      <Paper elevation={10} style={paperStyle}>
        <Grid align='center'>
          <Avatar style={avatarStyle}><AccountBoxIcon /></Avatar>
          <h2>User Login</h2>
        </Grid>
        <form onSubmit={handleSubmit}>
          <TextField 
            id="standard-basic" 
            label="Email" 
            placeholder='Enter email' 
            variant="standard" 
            fullWidth required 
            onChange={(e) => setEmail(e.target.value)}/>
          <TextField 
            id="standard-basic" 
            label="Password" 
            placeholder='Enter password' 
            type='password' 
            variant="standard" 
            fullWidth required 
            onChange={(e) => setPassword(e.target.value)}/>

          <Button type = 'submit' variant="contained" style={btnStyle} fullWidth>Login</Button>
          <p>{text}</p>
        </form>
        <Link to="/register">Sign Up</Link>
      </Paper>
    </Grid>



    
    /*
    <div> 
      <Layout />
      <body>
        <div class="form-box">
          <h2>Log In</h2>
          <form onSubmit={handleSubmit}>
            <div class="input-group">
              <i class="fa-solid fa-user"></i>

              <input
                type="email"
                id="LogE"
                class="user"
                placeholder="Your Email"
                onChange = {(e) => setEmail(e.target.value)}
              />
              <span class="error"></span>
              <input
                type="password"
                id="LogP"
                class="pass"
                placeholder="Password"
                onChange = {(e) => setPassword(e.target.value)}
              />
              <span class="error"></span>
              <p>{text}</p>
            </div>
            <button type="submit" class="LogButton">Login</button>
          </form>
          <Link to="/register">Sign Up</Link>
        </div>
      </body>
    </div>
    */
  )
}


export default Login