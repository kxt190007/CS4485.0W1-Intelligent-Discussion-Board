import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import Layout from './Layout'
import { List,ListItem, ListItemText, ListItemButton } from '@mui/material'



import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';

function Home() {

  const [chosenclass, setchosenclass] = useState("");
  const [classes, setClasses] = useState([{}]);
  const [inputs, setInputs] = useState([]);
  const [userName, setUserName] = useState("");


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
        console.log(inputs);
      }
      const userData = sessionStorage.getItem('name')
      console.log(userData);
      setUserName(userData);
    }
    fetchData();

  }, []);

  const handleChange = (event) =>{

  }

  let listClasses = inputs.map((x) => 
    <>
    <ListItem disablePadding>
            <ListItemButton>
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
    <div>
      <Layout/>
      <p>Home Page</p>

      <h2>{userName}'s Classes</h2>
      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="main mailbox folders">
        <List>
          {listClasses}
        </List>
      </nav>
  
    </Box>
    </div>
    


    


  )
}

export default Home