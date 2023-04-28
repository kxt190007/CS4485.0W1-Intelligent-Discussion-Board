import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { useNavigate } from "react-router-dom";
import Layout from './Layout.js'
import { Avatar, Grid, Paper, TextField, Checkbox, FormControlLabel, Typography, CircularProgress } from '@mui/material'
import Box from '@mui/material/Box';
import { Link, Navigate } from 'react-router-dom'

function ChangePass() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [classes, setClasses] = useState([[]]);
    const [userName, setUserName] = useState("");
    const [lastName, setLastName] = useState("");
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

      const changePassword = async e => {
        if(password==""){
          setErrMessage1("Password cannot be empty")
        }
        else if (password != passwordConf) {
          setErrMessage1("Passwords do not match")
        }
        else {
          const token = await changePass({
            userID: sessionStorage.getItem('token'),
            password,
          })
    
          setErrMessage1("Password changed")
          setPassword("")
          document.getElementById("pass").value = ""
          document.getElementById("pass1").value = ""
        }
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
            <h2>Change Password:</h2> <br></br>
            New Password:<br></br>
            <TextField id="pass" onChange={(e) => setPassword(e.target.value)} type='password' /> <br></br>
            Confirm New Password: <br></br>
            <TextField id="pass1" onChange={(e) => setPasswordConf(e.target.value)} type='password' /> <br></br>
            <Button onClick={() => changePassword()}>Change</Button><br></br>
            <Button type='submit' variant="contained" sx={{ backgroundColor: 'orange' }} style={btnStyle} onClick={() => goBack()}>Back to profile</Button>
            {errMessage1 != "" ? (
            <div>
            {errMessage1}<br></br>
            </div>
            ) : ""}
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

export default ChangePass