import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Link, Navigate } from 'react-router-dom'
import Layout from './Layout'
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material'
import Box from '@mui/material/Box';

function Classes() {

    const navigate = useNavigate();
    const [classes, setClasses] = useState([{}]);
    const [inputs, setInputs] = useState([]);
    const [userName, setUserName] = useState("");


    useEffect(() => {
        async function fetchData() {
            //fetch classes list
            const classList = JSON.parse(sessionStorage.getItem('classes'))
            console.log(classList);
            setClasses(classList);
            console.log(classes);
            const temp = [];
            for (let k in classList) {
                console.log(k);
                temp.push(
                    <div>
                    <button onClick={() => handleChange(k)}>{classList[k]}</button>
                    </div>
                );
                setInputs(temp);
                console.log(inputs);
            }
            const userData = sessionStorage.getItem('name')
            console.log(userData);
            setUserName(userData);
        }
        fetchData();

    }, []);

    const handleChange = (classID) => {
        navigate("/classlist/" + classID);
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
    return (
        <div>
            <Layout />
            <p>Classes</p>
            <Link to ="/create-class">Create Class</Link>  
            <h2>{userName}'s Classes</h2>
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <nav aria-label="main mailbox folders">
                    <List>
                        {inputs}
                    </List>
                </nav>
            </Box>
        </div>
    )
}

export default Classes
