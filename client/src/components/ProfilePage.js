import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { useNavigate } from "react-router-dom";
import Layout from './Layout.js'
import { Avatar, Grid, Paper, TextField, Checkbox, FormControlLabel, Typography, CircularProgress } from '@mui/material'
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
      <nav>

        <Layout />
        <Grid align='left' style={{ width: "100%", height: "200px" }}>
        <Typography gutterBottom variant="h6" component="div">
          <h2>{userName}'s Profile Page</h2>
          <h3>E-Mail: {email}</h3>
          <div>
            <h2>Enrolled Classes</h2>
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <nav aria-label="main mailbox folders">

                {classes.map((classInfo) => (
                  <div>{classInfo[1]}
                  </div>
                ))}
                <br></br>
                <Button color="inherit" onClick={() => goAdd()}>Add Class</Button>
                <br></br>
                <Button color="inherit" onClick={() => goChange()}>Change Password</Button>
              </nav>
            </Box>
          </div>
          </Typography>
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