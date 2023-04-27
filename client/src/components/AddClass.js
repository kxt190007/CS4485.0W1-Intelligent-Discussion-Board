import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { useNavigate } from "react-router-dom";
import Layout from './Layout.js'
import { Avatar, Grid, Paper, TextField, Checkbox, FormControlLabel, Typography, CircularProgress } from '@mui/material'
import Box from '@mui/material/Box';
import { Link, Navigate } from 'react-router-dom'

function AddClass() {
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

  async function userProfile(credentials) {
    return fetch("http://localhost:5000/addClass", {
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

  function goBack(){
    navigate("/profile")
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
        <div>
                <h2>Add a Class</h2> 
                <TextField onChange={(e) => setClassCode(e.target.value)} />
                <Button onClick={() => addToClass()}>Add</Button>
                {errMessage} <br></br>
                <Button type='submit' variant="contained" sx={{ backgroundColor: 'orange' }} style={btnStyle} onClick={() => goBack()}>Back to profile</Button>
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
      <CircularProgress style={{ color: 'orange' }} size={80}/>
      </Box>
      </Grid>
      )
  }
}

export default AddClass