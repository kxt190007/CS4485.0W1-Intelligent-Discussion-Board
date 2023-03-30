import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Link, Navigate } from 'react-router-dom'
import Layout from './Layout'
import {useNavigate} from "react-router-dom";
import { ListItemText, ListItemButton, Paper, Divider} from '@mui/material'
import Box from '@mui/material/Box';
import { Avatar, Grid, TextField, Checkbox, FormControlLabel, Typography} from '@mui/material'
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListDivider from '@mui/joy/ListDivider';
import Stack from '@mui/joy/Stack';


function Home() {

  const navigate = useNavigate();
  const [classes, setClasses] = useState([{}]);
  const [inputs, setInputs] = useState([]);
  const [userName, setUserName] = useState("");
  const paperStyle = { padding: "30px 20px", height: '90%', width: '93%', margin: "20px auto"}

  useEffect(() =>{
    async function fetchData(){
      //fetch classes list
      const classList = JSON.parse(sessionStorage.getItem('classes'))
      console.log(classList);
      setClasses(classList);
      console.log(classes);
      const temp = [];
      for(let k in classList){
        console.log(k);
        temp.push(
          <option value = {k}>{classList[k]}</option>
        );
        setInputs(temp);
        console.log("inputs:");
        console.log(inputs);
      }
      const userData = sessionStorage.getItem('name')
      console.log(userData);
      setUserName(userData);
    }
    fetchData();

  }, []);

  const handleChange = (event) =>{
    sessionStorage.setItem('chosenClass', event.target.value)
    console.log(sessionStorage.getItem('chosenClass'))
    navigate("/board");
  }

  let listClasses = inputs.map((x) => 
    <>
    <ListItem disablePadding onClick = {(e) => handleChange(e)}>
            <ListItemButton >
              <ListItemText primary={x}/>
            </ListItemButton>
    </ListItem>
    

    </>
  );


  if(!sessionStorage.getItem('token')){
    return (
      <div>
        <Link to="/login">Login</Link>
        <p>Please login to view class discussion boards.</p>
      </div>
    )
  }
  return (
    
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={2}
    >

      
      <Layout/>
      <Paper style = {paperStyle}>

      <h2>{userName}'s Classes</h2>
      <Divider/>
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <nav aria-label="enrolled classes">
        <List>
          {listClasses}
        </List>
      </nav>
    </Box>
    </Paper>
    </Stack>
  )
}

export default Home
