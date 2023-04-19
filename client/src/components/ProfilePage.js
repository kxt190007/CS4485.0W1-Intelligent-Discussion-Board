import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types'
import UserProfile from './UserProfile.js'
import Layout from './Layout.js'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Avatar, Grid, Paper, TextField, Checkbox, FormControlLabel, Typography, CircularProgress } from '@mui/material'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';
import { Link, Navigate } from 'react-router-dom'

function ProfilePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [classes, setClasses] = useState([[]]);
  const [userName, setUserName] = useState("");
  const [lastName, setLastName] = useState("");
  const [classCode, setClassCode] = useState("")
  const [errMessage, setErrMessage] = useState("")
  const [passwordConf, setPasswordConf] = useState("")
  const [errMessage1, setErrMessage1] = useState("")
  const [fetchDone, setFetchDone] = useState(false)

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
  async function addClass(credentials) {
    return fetch("http://localhost:5000/addToClass1", {
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
  async function changePass(credentials) {
    return fetch("http://localhost:5000/changePassword", {
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
  const addToClass = async e => {
    console.log("test")
    const token = await addClass({
      userID: sessionStorage.getItem('token'),
      classCode,
    })
    if (token.status == "Failed") {
      setErrMessage(token.message)
    }
    else {
      const temp = token.classList
      setClasses(temp)
    }
  }
  const changePassword = async e => {
    if (password != passwordConf) {
      setErrMessage1("Passwords do not match")
    }
    else {
      const token = await changePass({
        userID: sessionStorage.getItem('token'),
        password,
      })

      setErrMessage1("Password changed")
      document.getElementById("pass").value = ""
      document.getElementById("pass1").value = ""
    }
  }

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

  async function userProfile(credentials) {
    return fetch("http://localhost:5000/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then(
        res => res.json()
      )
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

  const paperStyle = { padding: "30px 500px", height: '60vh', width: 320, margin: "50px auto" }
  const avatarStyle = { backgroundColor: '#ef6c00' }
  const btnStyle = { margin: '40px 0' }
  if (!sessionStorage.getItem('token')) {
    return <Navigate replace to="/" />
  }
  else if (fetchDone) {
    return (
      <nav>
        <Layout />

        <Grid align='left' style={{ width: "100%", height: "200px" }}>
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
            align='left'
            style={{ width: "15%", height: "200px" }}
          />
          <div>
            <h2>Enrolled Classes</h2>
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <nav aria-label="main mailbox folders">

                {classes.map((classInfo) => (
                  <div>{classInfo[1]}
                  </div>
                ))}
                <h2>Add a Class</h2>
                <TextField onChange={(e) => setClassCode(e.target.value)} />
                <Button onClick={() => addToClass()}>Add</Button>
                {errMessage} <br></br>
                <h2>Change Password:</h2> <br></br>
                New Password:<br></br>
                <TextField id="pass" onChange={(e) => setPassword(e.target.value)} type='password' /> <br></br>
                Confirm New Password: <br></br>
                <TextField id="pass1" onChange={(e) => setPasswordConf(e.target.value)} type='password' /> <br></br>
                <Button onClick={() => changePassword()}>Change</Button><br></br>
                {errMessage1 != "" ? (
                  <div>
                    {errMessage1}<br></br>
                  </div>
                ) : ""}
              </nav>
            </Box>
          </div>
        </Grid>
      </nav>
    )
  }
  else{
    return (
      <Grid >
      <Layout/>
      <Box sx={{ display: 'flex',justifyContent: 'center', marginTop: '300px'}}>
      <CircularProgress color="success" size={80}/>
      </Box>
      </Grid>
      )
  }
}

export default ProfilePage