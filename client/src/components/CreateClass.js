import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Link, Navigate } from 'react-router-dom'
import Layout from './Layout'
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material'
import Box from '@mui/material/Box';

function CreateClass() {

    const navigate = useNavigate();
    const [className, setClassName] = useState("");
    const [classSection, setClassSection] = useState("");
    const [additionalEmail, setAdditionalEmail] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [profList, setProfList] = useState([])
    const [error, setError] = useState("");

    async function createClass(credentials) {
        return fetch("http://localhost:5000/createClass", {
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

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await createClass({
            className,
            classSection,
            profList,
            firstName: sessionStorage.getItem("name"),
            lastName: sessionStorage.getItem("lastname"),
            email: sessionStorage.getItem("email")
        });
        if (token.status === "Failed") {
            setError(token.message)
        }
        else {
            const classList = JSON.parse(sessionStorage.getItem('classes'))
            classList[token.classID] = token.className
            sessionStorage.setItem('classes', JSON.stringify(classList))
            navigate("/")
        }
    }

    const removeItem = (index) => {
        const temp = [...profList]
        temp.splice(index, 1)
        setProfList(temp);
    }

    const handleChange = (event) => {
        setErrMessage("")
        if (additionalEmail === sessionStorage.getItem('email')) {
            setErrMessage("Cannot add own email")
        }
        else if (profList.includes(additionalEmail)) {
            setErrMessage("Email already added")
        }
        else {
            const token = fetch("http://localhost:5000/getUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    additionalEmail,
                ),
            })
                .then(
                    res => res.json()
                )
                .then((data) => {
                    console.log(data)
                    console.log(data.status)
                    if (data.status == "Failed") {
                        setErrMessage(data.message)
                    }
                    else {
                        const temp = [...profList, additionalEmail]
                        setProfList(temp);
                    }
                })
        }
    }

    if (sessionStorage.getItem('accesslevel') != 5) {
        return <Navigate replace to="/" />
    }
    return (
        <div>
            <Layout />
            <p>Create Class</p>
            <form onSubmit={handleSubmit}>
                <label for="classname">Class Name: </label>
                <input
                    name="classname"
                    type="text"
                    id="classname"
                    class="input-box"
                    placeholder="eg. CS4348"
                    required="required"
                    onChange={(e) => setClassName(e.target.value)}
                ></input><br />
                <label for="classsection">Class Section: </label>
                <input
                    name="classsection"
                    id="classsection"
                    class="input-box"
                    placeholder="eg. 001"
                    required="required"
                    onChange={(e) => setClassSection(e.target.value)}
                ></input> <br />
                {error} <br />
                <input type="submit" value="Create Class"></input> <br />
            </form>
            <label for="additionalprofessor">Other Instructor's UTD Email: </label>
            <input
                name="additionalprofessor"
                id="additionalprofessor"
                class="input-box"
                onChange={(e) => setAdditionalEmail(e.target.value)}
            ></input>
            <button onClick={(e) => handleChange(e)}>Add</button><br />
            {errMessage} <br />
            {profList.map((prof, index) => (
                <div>
                    {prof}
                    <button onClick={() => removeItem(index)}>Remove</button>
                </div>

            ))}
        </div>
    )
}
export default CreateClass