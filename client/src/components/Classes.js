import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Link, Navigate } from 'react-router-dom'
import Layout from './Layout'
import { useNavigate } from "react-router-dom";
import { Divider, Grid, Typography, List, ListItem, ListItemText, ListItemButton, capitalize } from '@mui/material'
import Box from '@mui/material/Box';
import '../App.css'

function Classes() {

    const navigate = useNavigate();
    const [classes, setClasses] = useState([[]]);
    const [userName, setUserName] = useState("");
    const [fetchDone, setFetchDone] = useState(false)


    useEffect(() => {
        async function fetchData() {
            //fetch classes list
            const classList = JSON.parse(sessionStorage.getItem('classes'))
            setClasses(classList);
            setUserName(sessionStorage.getItem('name'))
            setFetchDone(true)
        }
        fetchData();

    }, []);

    async function removeClass(credentials) {
        return fetch("http://localhost:5000/removeClass", {
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

    const removeItem = async (index) => {
        const token = await removeClass({
            classID: classes[index][0],
        })
        if (token.status == "Success") {
            const temp = [...classes]
            temp.splice(index, 1)
            setClasses(temp)
            sessionStorage.setItem('classes', JSON.stringify(temp))
        }
    }

    const handleChange = (index) => {
        navigate("/classlist/" + classes[index][0]);
    }


    // let listClasses = inputs.map((x) =>
    //     <>
    //         <ListItem disablePadding onClick={(e) => handleChange(e)}>
    //             <ListItemButton >
    //                 <ListItemText primary={x} />
    //             </ListItemButton>
    //         </ListItem>

    //     </>
    // );


    if (sessionStorage.getItem('accesslevel') != 5) {
        return <Navigate replace to="/" />
    }
    else if (fetchDone) {
        return (
            <Grid>
                <Layout />

                <Box sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper', marginLeft: 1, marginTop: 10 }}>

                    <Typography variant="h5" component="h1">
                        {userName}'s Classes (Admin)
                    </Typography>

                    <Box sx={{ width: '100%', maxWidth: 650, bgcolor: 'background.paper' }}>
                        <nav aria-label="main mailbox folders">
                            <p>{classes.map((classInfo, index) => (
                                <div>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        py: 1,
                                        my: 1,
                                        bgcolor: 'background.paper',
                                        borderRadius: 1,
                                    }}>
                                        <Typography sx={{ width: "65%", mt: 1, textTransform: 'uppercase' }}
                                            fontSize="large">
                                            {classInfo[1]}
                                        </Typography>
                                        <Button variant="contained" onClick={() => handleChange(index)}>
                                            Manage
                                        </Button>
                                        <Button variant="contained" color="error" onClick={() => removeItem(index)}>
                                            Delete
                                        </Button>

                                    </Box>
                                    <Divider />
                                </div>
                            ))}</p>
                        </nav>
                    </Box>


                </Box>
            </Grid>

        )
    }
    else{
        return <Layout/>
    }
}

export default Classes
