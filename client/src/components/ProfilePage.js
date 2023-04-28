import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { useNavigate } from "react-router-dom";
import Layout from './Layout.js'
import { Avatar, Grid, Paper, TextField, Checkbox, FormControlLabel, Typography, CircularProgress } from '@mui/material'
import Box from '@mui/material/Box';
import { Link, Navigate } from 'react-router-dom'
import ListItem from '@mui/joy/ListItem';
import { ListItemText, ListItemButton, Divider } from '@mui/material'
import List from '@mui/joy/List';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

function ProfilePage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [classes, setClasses] = useState([[]]);
  const [userName, setUserName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fetchDone, setFetchDone] = useState(false)
  const [inputs, setInputs] = useState([]);

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

  async function getClass(credentials) {
    return fetch("http://localhost:5000/getClasses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials),
    })
      .then(
        res => res.json()
      )
  }

  useEffect(() => {
    async function fetchData() {
      const token = await getClass({
        userID: sessionStorage.getItem('token'),
      })
      const temp = token.classList
      setClasses(temp)
      setFetchDone(true)
    }
    fetchData()
  }, [])

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

  async function getClass(credentials) {
    return fetch("http://localhost:5000/getClasses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials),
    })
      .then(
        res => res.json()
      )
  }

  function goAdd(){
    navigate("/addClass")
  }

  function goChange(){
    navigate("/changePass")
  }

  const paperStyle = { padding: "30px 500px", height: '60vh', width: 320, margin: "50px auto" }
  const avatarStyle = { backgroundColor: '#ef6c00' }
  const btnStyle = { margin: '40px 0' }
  if (!sessionStorage.getItem('token')) {
    return <Navigate replace to="/" />
  }
  else if (fetchDone) {
    return (
      <Grid sx={{backgroundImage:'url(https://utdmercury.com/wp-content/uploads/2019/08/utdallas_min-1024x683.jpg)', backgroundSize: 'cover', height: '100vh'}}>
      <Typography gutterBottom variant="h6" component="div">
        <Layout />
        <Grid   container component="main" item xs={false} sm={4} md={7} sx={{ height: '100vh' }}>
            <Paper style = {paperStyle}>
            <Avatar style={avatarStyle} sx={{width: 70, height:70}} align='center'><AccountBoxIcon /></Avatar>
                <h2>{userName}'s Profile Page</h2>
                <h3>E-Mail: {email}</h3>
                <br></br>
              <Button type='submit' variant="contained" sx={{ backgroundColor: 'orange' }} style={btnStyle} onClick={() => goChange()}>Change Password</Button>
            </Paper>
        </Grid>
          <Grid container component="main" item xs={false} sm={'auto'} md={'auto'} sx={{ height: '100vh' }}>
            <Paper style = {paperStyle}>
               <Divider/>
                 <h2>Enrolled Classes</h2>
                  <nav aria-label="enrolled classes">
                    <List>
                      {inputs}
                    </List>
                  </nav>
                    <Button type='submit' variant="contained" sx={{ backgroundColor: 'orange' }} style={btnStyle} onClick={() => goAdd()}>Add Class</Button>
              </Paper>
          </Grid>
        </Typography>
      </Grid>
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

export default ProfilePage