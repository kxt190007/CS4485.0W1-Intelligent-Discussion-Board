import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import Layout from './Layout'
import { List,ListItem, ListItemText, ListItemButton, Divider, Accordion } from '@mui/material'
import Box from '@mui/material/Box';

function Post(){

    const postID = sessionStorage.getItem('chosenPost')
    const title = sessionStorage.getItem('postTitle')
    const body = sessionStorage.getItem('postBody')
    const [userIDs, setUserIDs] = useState([]);
    const [commentBodies, setCommentBodies] = useState([]);
    const [postTimes, setPostTimes] = useState([]);



    useEffect(() =>{
        console.log(title)


        async function fetchData(){
            //fetch post list as JSON
  
            const commentList = await getPostComments({
                postID : postID
            });
            console.log("comment list: ")
            console.log(commentList);
  
           // setPostJSON(postList);
           // console.log(postJSON)
           const userIDs = []
           const commentBodies = []
           const postTimes = []
  
            for(let i = 0; i < commentList[0].length; i++){
                userIDs[i] = commentList[0][i]
                commentBodies[i] = commentList[1][i]
                postTimes[i] = commentList[2][i]
            }
            setUserIDs(userIDs)
            setCommentBodies(commentBodies)
            setPostTimes(postTimes)
    
  
          }
          fetchData();






    
      }, []);

    async function getPostComments(credentials){
        return fetch("http://localhost:5000/getPostComments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        })
        .then(
          res=>res.json()
        )
      }


    const handleChange = (event) => {

    }


    var comments = [];
    for(let i = 0; i < userIDs.length; i++){
        comments.push(
            <div>
              <ListItem disablePadding onClick = {(e) => handleChange(e)}>
                <ListItemButton>
                <ListItemText>
                  <option value = {i}>{commentBodies[i] }</option>
                </ListItemText>
                </ListItemButton>
              </ListItem>
              <p>{postTimes[i]}</p>

                <Divider/>
            </div>
        )
    }

    return (
        <div>
          <Layout/>
          <p>Post Page</p>
          <h2>Post Title: {title}</h2>
          <p>Body: <h4>{body}</h4></p>
          <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>

        <List>
            {comments}
        </List>
        </Box>
        </div>
    )
}


export default Post;