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

function ProfilePage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState([{}])
    const [text, setText] = useState("");
    const navigate = useNavigate();
    const [classes, setClasses] = useState([[]]);
    const [userName, setUserName] = useState("");
    const [lastName, setLastName] = useState("");

  const handleChange = (index) => {
      navigate("/classlist/" + classes[index][0]);
  }

    useEffect(() => {
        async function fetchData() {
            //fetch classes list
            const classList = JSON.parse(sessionStorage.getItem('classes'))
            setClasses(classList);
            setUserName(sessionStorage.getItem('name'))
            setEmail(sessionStorage.getItem('email'))
            setLastName(sessionStorage.getItem('lastName'))
        }
        fetchData();

    }, []);
  
    async function userProfile(credentials){
      return fetch("http://localhost:5000/profile", {
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

    const paperStyle = { padding: "30px 500px", height: '60vh', width: 320, margin: "50px auto" }
    const avatarStyle = { backgroundColor: '#ef6c00' }
    const btnStyle = { margin: '40px 0'}
  
    return (
      
      <Grid>
        <Box sx={{ flexGrow: 1 }}> 
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
          </Toolbar>
        </AppBar>
      </Box>
        <Paper elevation={10} style={paperStyle}>
          <Grid align='center' style={{ width: "100%", height: "200px"}}>
            <Avatar style={avatarStyle} size><AccountBoxIcon /></Avatar>
            <h2>{userName}'s Profile Page</h2> 
            <h3>E-Mail: {email}</h3>

            <TextField
                id="outlined-uncontrolled-multiline-static"
                label="About me"
                multiline
                rows={7}
                defaultValue=""
                size="large"
                variant="outlined"
                align='center'
                style={{ width: "100%", height: "200px"}}
            />
              <div>
              <h2>Enrolled Courses</h2>
              <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <nav aria-label="main mailbox folders">
              <p>{classes.map((classInfo, index) => (
              <div>

              </div>
              ))}</p>
              </nav>
              </Box>
              </div>
          </Grid>
        </Paper>
      </Grid>
    )
  }
  
  export default ProfilePage


