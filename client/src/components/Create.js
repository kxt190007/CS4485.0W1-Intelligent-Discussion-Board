import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
import Layout from './Layout.js'
import { ListItemText, ListItemButton, Paper, Divider, TextareaAutosize, Chip, Input } from '@mui/material'
import Box from '@mui/material/Box';
import { Avatar, Grid, TextField, Checkbox, FormControlLabel, Typography, CircularProgress } from '@mui/material'
import { FormControl, InputLabel, MenuItem, Select, Button } from '@mui/material';
import "./Create.css";


function Create() {
  const [popup, setpopup] = useState(false);
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postTag, setPostTag] = useState("");
  const [chosenclass, setchosenclass] = useState("");
  const [data, setData] = useState([{}]);
  const [classes, setClasses] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [inputs, setInputs] = useState([]);
  const [fetchDone, setFetchDone] = useState(false)
  const navigate = useNavigate();

  async function navHome() {
    navigate("/")
  }

  const togglepopup = () => {
    setpopup(!popup);
  };

  if (popup) {
    document.body.classList.add('popup')
  } else {
    document.body.classList.remove('popup')
  }

  useEffect(() => {
    async function fetchData() {
      //fetch classes list
      const token = await fetch("http://localhost:5000/getClasses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userID: sessionStorage.getItem('token')
        }),
      })
        .then((response) => response.json())
      const classList = token.classList
      setClasses(classList)
      const temp = [];
      for (let i = 0; i < classList.length; i++) {
        temp.push(
          <MenuItem value={classList[i][0]}>{classList[i][1]}</MenuItem>
        );
        setInputs(temp);
      }
      setFetchDone(true)
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
    if (token.message == "message") {
      const token1 = await createPost1({
        userID: sessionStorage.getItem('token'),
        postContent,
        postTitle,
        postTag,
        chosenclass
      });
      navigate('/board/' + token1.classID + '/post/' + token1.newID)
    }
    if (token.message.includes("localhost")) {
      setLink(token.message)
    }
    else {
      setMessage(token.message)
    }
    togglepopup();
  }

  const handlePop = async e => {
    const token = await createPost1({
      userID: sessionStorage.getItem('token'),
      postContent,
      postTitle,
      postTag,
      chosenclass
    });
    navigate('/board/' + token.classID + '/post/' + token.newID)
  }


  const handleChange = (event) => {
    setchosenclass(event.target.value);
  }

  const paperStyle = { padding: "30px 20px", height: '71vh', width: '97%', margin: "40px auto" }
  const btnStyle = { margin: '40px 0' }
  if (!sessionStorage.getItem('token')) {
    return <Navigate replace to="/login" />
  }
  else if (classes.length === 0 && fetchDone) {
    return (
      <body>
        <p>No classes found associated with profile. Please sign up for a class before creating a post.</p>
        <Link to="/">Sign Up</Link>
      </body>
      //TODO: Change Link to profile page OR whatever page to sign up for classes.
    )
  }
  else if (fetchDone) {
    return (

      <Grid>

        <Layout />
        <Paper elevation={10} style={paperStyle}>

          <>
            {popup && (
              <div className="popup">
                <div onClick={togglepopup} className="overlay"></div>
                <div className="popup-content">
                  <h2>Our intelligent discussion board has suggested an answer</h2>
                  <form id="onSubmit1" onSubmit={handlePop}>
                    <a href={link}> {link} </a>
                    {message}
                    <p> did that answer your question? </p>
                    <p> (pressing yes will NOT post your question) </p>
                    <input type="submit" value="no"></input>
                    <button onClick={navHome} > yes </button>
                  </form>
                </div>
              </div>
            )}
          </>



          <br />
          <form onSubmit={handleSubmit}>


            <Select defaultValue="Select a Class" required={true} chosenclass={chosenclass} onChange={handleChange}>
              <MenuItem value="Select a Class">Select a Class</MenuItem>
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
              style={{ width: '100%', height: '360px' }}
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
              <Button type='submit' variant="contained" sx={{ backgroundColor: 'orange' }} style={btnStyle}>Create Post</Button>
            </Box>
          </form>
          <p>{errorText}</p>


        </Paper>

      </Grid>



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

export default Create