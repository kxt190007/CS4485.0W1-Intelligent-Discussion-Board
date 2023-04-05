import React, { useState, useEffect } from 'react'
import { useLoaderData } from "react-router-dom";
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import Layout from './Layout'
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemText, ListItemButton, Divider, Paper, Grid } from '@mui/material'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/joy/Stack';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';


export async function loader({ params }) {
  console.log(params.classID)
  //const classInfo = await getClass(params.classID);
  return params.classID
}

export function Board() {

  const navigate = useNavigate();
  const classList = JSON.parse(sessionStorage.getItem('classes'))
  const classID = useLoaderData()
  //const [postJSON, setPostJSON] = useState([{}][{}]);
  const [postIDs, setPostIDs] = useState([]);
  const [userIDs, setUserIDs] = useState([]);
  const [postStatus, setPostStatus] = useState([]);
  const [postBodies, setPostBodies] = useState([]);
  const [postTitles, setPostTitles] = useState([]);
  const [postTags, setPostTags] = useState([]);
  const paperStyle = { padding: "30px 20px", height: '90%', width: '97%', margin: "20px auto" }
  const [postArr, setPostArr] = useState([]);
  var className
  for (let i = 0; i < classList.length; i++) {
    if (classList[i][0] == classID)
      className = classList[i][1]
  }

  async function fetchData() {
    //fetch post list as JSON

    const postList = await getPosts({
      classID: classID,
    });
    console.log(postList);
    console.log("postlist at 1 1: ")
    console.log(postList[1][1])
    const moderator = await checkModerator({
      userID: sessionStorage.getItem('token'),
      classID,
    })
    // setPostJSON(postList);
    // console.log(postJSON)
    const postIDs = [];
    const UserIDs = [];
    const postStatus = [];
    const postBodies = [];
    const postTitles = [];
    const postTags = [];

    for (let i = 0; i < postList[0].length; i++) {
      postIDs[i] = postList[0][i]
      UserIDs[i] = postList[1][i]
      postStatus[i] = postList[2][i]
      postBodies[i] = postList[3][i]
      postTitles[i] = postList[4][i]
      postTags[i] = postList[5][i]
    }
    setPostIDs(postIDs)
    setUserIDs(UserIDs)
    setPostStatus(postStatus)
    setPostBodies(postBodies)
    setPostTitles(postTitles)
    setPostTags(postTags)

    console.log({ postIDs })
    console.log({ postBodies })
    const temp = []
    if (sessionStorage.getItem('accesslevel') == 5 || moderator.message == 'yes') {
      for (let i = 0; i < postIDs.length; i++) {
        temp.push(
          <Card sx={{ maxWidth: "100%", m: 2, maxHeight: 200 }}>
            <CardActionArea onClick={() => handleChange(postIDs[i])}>

              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  <option value={i}>{postTitles[i]}</option>
                </Typography>
                <Divider />
                <Typography variant="body2" color="text.secondary">
                  {postBodies[i]}

                </Typography>
              </CardContent>
            </CardActionArea>
            <Button onClick={() => removePost(postIDs[i])}>Delete</Button>
          </Card>
        )
      }
    }
    else {
      for (let i = 0; i < postIDs.length; i++) {
        temp.push(
          <Card sx={{ maxWidth: "100%", m: 2, maxHeight: 200 }}>
            <CardActionArea onClick={(e) => handleChange(e)}>

              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  <option value={i}>{postTitles[i]}</option>
                </Typography>
                <Divider />
                <Typography variant="body2" color="text.secondary">
                  {postBodies[i]}

                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        )
      }
    }
    setPostArr(temp)
  }

  useEffect(() => {

    fetchData();

  }, []);

  async function getPosts(credentials) {
    return fetch("http://localhost:5000/getPosts", {
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
  async function remove(credentials) {
    return fetch("http://localhost:5000/removePost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then(
        res => {
          res.json()
          fetchData()
        }
      )
  }
  async function checkModerator(credentials) {
    return fetch("http://localhost:5000/checkModerator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then(
        res => 
          res.json()
      )
  }
  const removePost = async (index) => {
    console.log(index)
    await remove({
      postID: index,
    })


  }





  const handleChange = (postID) => {
    // console.log(event.target.value)
    // sessionStorage.setItem('postTitle', postTitles[event.target.value])
    // sessionStorage.setItem('postBody', postBodies[event.target.value])
    console.log(sessionStorage.getItem('chosenPost'))
    navigate("post/" + postID);
  }




  return (
    <nav>
     <Layout />
    <Grid sx={{
              display: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
              p: 1,
              m: 0,
              bgcolor: 'background.paper',
              maxWidth: "100%",
              borderRadius: 1,
            }}>
      
      <Paper style={paperStyle} >
        <h2>Discussion Board for {className}</h2>
        <Divider />   
      {postArr}
      </Paper>
    </Grid> 
    </nav>
  )
}


export default Board;