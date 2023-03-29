import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Link, Navigate } from 'react-router-dom'
import Layout from './Layout'
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material'
import Box from '@mui/material/Box';

function Home() {

  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [userName, setUserName] = useState("");


  useEffect(() => {
    async function fetchData() {
      //fetch classes list
      const classList = JSON.parse(sessionStorage.getItem('classes'))
      setClasses(classList);
      setUserName(sessionStorage.getItem('name'))
    }
    fetchData();

  }, []);

  const handleChange = (index) => {
    sessionStorage.setItem('chosenClass', classes[index][0])
    console.log(sessionStorage.getItem('chosenClass'))
    navigate("/board");
  }

  let listClasses = inputs.map((x) =>
    <>
      <ListItem disablePadding onClick={(e) => handleChange(e)}>
        <ListItemButton >
          <ListItemText primary={x} />
        </ListItemButton>
      </ListItem>

    </>
  );


  if (!sessionStorage.getItem('token')) {
    return (
      <div>
        <Link to="/login">Login</Link>
        <p>Please login to view class discussion boards.</p>
      </div>
    )
  }
  return (
    <div>
      <Layout />
      <p>Home Page</p>

      <h2>{userName}'s Classes</h2>
      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <nav aria-label="main mailbox folders">
          <List>
            {classes.map((classInfo, index) => (
              <div>
                <button onClick={() => handleChange(index)}>{classInfo[1]}</button>
              </div>
            ))}
          </List>
        </nav>
      </Box>
    </div>
  )
}

export default Home
