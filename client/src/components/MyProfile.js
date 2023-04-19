import { useLoaderData } from "react-router-dom";
import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button'
import { Avatar, Grid, Paper, TextField, Checkbox, FormControlLabel, Typography} from '@mui/material'


export function MyProfile() {
    const [classes, setClasses] = useState([[]])
    const [classCode, setClassCode] = useState("")
    const [errMessage, setErrMessage] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConf, setPasswordConf] = useState("")
    const [errMessage1, setErrMessage1] = useState("")
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
    async function changePass(credentials){
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
        }
        fetchData()
    }, [])
    const addToClass = async e =>{
        console.log("test")
        setErrMessage("")
        const token = await addClass({
            userID:sessionStorage.getItem('token'),
            classCode,
        })
        if(token.status == "Failed"){
            setErrMessage(token.message)
        }
        else{
            const temp = token.classList
            setClasses(temp)
        }
    }
    const changePassword = async e =>{
        if(password != passwordConf){
            setErrMessage1("Passwords do not match")
        }
        else{
            const token = await changePass({
                userID:sessionStorage.getItem('token'),
                password,
            })

            setErrMessage1("Password changed")
            document.getElementById("pass").value = ""
            document.getElementById("pass1").value = ""
        }
    }
    if (!sessionStorage.getItem('token')) {
        return <Navigate replace to="/" />
    }
    return (
        <div>
            <Layout />
            Email: {sessionStorage.getItem('email')} <br></br>
            Name: {sessionStorage.getItem('name')} <br></br>
            Last Name: {sessionStorage.getItem('lastname')} <br></br>
            Change Password: <br></br>
            New Password: 
            <TextField id = "pass" onChange = {(e) => setPassword(e.target.value)} type = 'password'/> <br></br>
            Confirm New Password: 
            <TextField id = "pass1" onChange = {(e) => setPasswordConf(e.target.value)} type = 'password'/> <br></br>
            <Button onClick={() => changePassword()}>Change</Button><br></br>
            {errMessage1!=""? (
                <div>
                {errMessage1}<br></br>
                </div>
            ) : ""}
            Classes: <br></br>
            {classes.map((classInfo) => (
            <div>{classInfo[1]}
            </div>
                
            ))}
            Add a Class
            <TextField onChange = {(e) => setClassCode(e.target.value)}/>
            <Button onClick={() => addToClass()}>Add</Button>
            {errMessage}
        </div>
    )
}

export default MyProfile