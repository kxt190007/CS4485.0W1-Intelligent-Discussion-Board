import React, { useState, useEffect } from 'react'
import { Avatar, Grid, Paper, TextField, Checkbox, FormControlLabel, Button, Typography, Link } from '@mui/material'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Layout from './Layout.js'
import {useNavigate} from "react-router-dom";
import UserProfile from './UserProfile.js'
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

  const paperStyle = { padding: "30px 20px", height: '60vh', width: 320, margin: "20px auto" }
  const avatarStyle = { backgroundColor: 'orange' }
  const btnStyle = { margin: '8px 0' }

  return (

    <Grid>
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
            placeholder='Enter first name' 
            variant="standard" 
            fullWidth required 
            onChange={(e) => setFirstName(e.target.value)}/>
          <TextField 
            id="standard-basic" 
            label="Last Name" 
            placeholder='Enter last name' 
            variant="standard" 
            fullWidth required
            onChange={(e) => setLastName(e.target.value)}/>
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

          <Button type = 'submit' variant="contained" style={btnStyle} fullWidth>Sign up</Button>
          <p>{text}</p>
        </form>
      </Paper>
    </Grid>
    /*<div><body class="signup">
    <div class="form-box">
      <h2>Sign Up</h2>

      <form>
        <div class="input-group">
          <i class="fa-solid fa-user"></i>
          <input
            type="email"
            id="SignE"
            class="user"
            placeholder="Your Email"
          />
        </div>
        <span class="error"></span>
        <div class="input-group">
          <i class="fa-solid fa-lock"></i>
          <input
            type="password"
            id="SignP"
            class="pass"
            placeholder="Password"
          />
        </div>
        <span class="error"></span>
        <input placeHolder="First Name"/>
        <input placeHolder="Last Name"/>

        <div class="SignButton">
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  </body></div>*/

  )
}

export default Register