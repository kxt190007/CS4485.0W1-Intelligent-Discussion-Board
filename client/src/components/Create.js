import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
import Layout from './Layout.js'
import { ListItemText, ListItemButton, Paper, Divider, TextareaAutosize, Chip, Input } from '@mui/material'
import Box from '@mui/material/Box';
import { Avatar, Grid, TextField, Checkbox, FormControlLabel, Typography} from '@mui/material'
import { FormControl, InputLabel, MenuItem, Select, Button } from '@mui/material';


function Create() {
  const [message, setMessage] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postTag, setPostTag] = useState("");
  const [chosenclass, setchosenclass] = useState("");
  const [data, setData] = useState([{}]);
  const [classes, setClasses] = useState([{}]);
  const [errorText, setErrorText] = useState("");
  const [inputs, setInputs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      //fetch classes list
      const classList = JSON.parse(sessionStorage.getItem('classes'))
      setClasses(classList);
      const temp = [];
      for (let k in classList) {
        temp.push(
          <option value={classList[k][0]}>{classList[k][1]}</option>
        );
        setInputs(temp);
        console.log(inputs);
      }
    }
    fetchData();

  }, []);
  async function createPost(credentials) {
    return fetch("http://localhost:5000/post", {
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

  async function createPost1(credentials) {
    return fetch("http://localhost:5000/post1", {
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
    console.log(inputs)
    e.preventDefault();
    if (chosenclass === "" || chosenclass === "Select a Class") {
      setErrorText("Please select a class.")
      return;
    }
    const token = await createPost({
      userID: sessionStorage.getItem('token'),
      postContent,
      postTitle,
      postTag,
      chosenclass
    });
    console.log(token.message)
    setMessage(token.message)
    if(token.message == "message") {
        await createPost1({
          userID: sessionStorage.getItem('token'),
          postContent,
          postTitle,
          postTag,
          chosenclass
        });
    }
    else {
        //pop up
    }
  }

  const handlePop = async e => {
    console.log(inputs)
    await createPost1({
      userID: sessionStorage.getItem('token'),
      postContent,
      postTitle,
      postTag,
      chosenclass
    });
    navigate("/")
  }


  const handleChange = (event) => {
    setchosenclass(event.target.value);
  }

  if (!sessionStorage.getItem('token')) {
    return <Navigate replace to="/login" />
  }
  else if (classes.length === 0) {
    return (
      <body>
        <p>No classes found associated with profile. Please sign up for a class before creating a post.</p>
        <Link to="/">Sign Up</Link>
      </body>
      //TODO: Change Link to profile page OR whatever page to sign up for classes.
    )
  }

  const paperStyle = { padding: "30px 20px", height: '70vh', width: '97%', margin: "40px auto" }
  const btnStyle = { margin: '40px 0' }

  return (
    
    <Grid>
    
      <Layout />
      <Paper elevation={10} style={paperStyle}>

        <form id = "onSubmit1" onSubmit1={handlePop}>
            if this doesnt answer your question click me to post:
          <input type="submit" value={message}></input>
         </form>

      <form onSubmit={handleSubmit}>
       
          
          <Select defaultValue="Select a Class" required={true} chosenclass={chosenclass} onChange={handleChange}>
            <option value="Select a Class">Select a Class</option>
            {inputs}
          </Select>
        <br />
        <br />
        <TextField 
          name="posttitle"
          type="text"
          id="standard-basic"
          class="input-box"
          placeholder="Post Title"
          required="required"
          variant="standard"
          onChange={(e) => setPostTitle(e.target.value)}
        ></TextField>
       
        
        <br />
        <TextareaAutosize
          name="postcontent"
          id="postcontent"
          class="input-box"
          placeholder="Please enter post content"
          required
          rowsMin={6}
          onChange={(e) => setPostContent(e.target.value)}
          style={{ width: '100%', height: '400px' }}
        />

        
        <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
          <InputLabel htmlFor="tag-select">Tag (Optional)</InputLabel>
          <Select
            labelId="tag-select"
            id="tag-select"
            value={postTag}
            onChange={(e) => setPostTag(e.target.value)}
            input={<Input id="tag" />}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="General">General</MenuItem>
            <MenuItem value="Homework">Homework</MenuItem>
            <MenuItem value="Exam">Exam</MenuItem>
            <MenuItem value="Project">Project</MenuItem>
            
          </Select>
        </FormControl>


        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Button type = 'submit' variant="contained" sx={{ backgroundColor: 'orange' }} style={btnStyle}>Create Post</Button>
        </Box>
      </form>
      <p>{errorText}</p>
    
      
      </Paper>
      
    </Grid>

    
      
  )
  
}

export default Create