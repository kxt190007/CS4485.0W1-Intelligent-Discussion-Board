import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import Layout from './Layout'
import {useNavigate} from "react-router-dom";
import { List,ListItem, ListItemText, ListItemButton, Divider } from '@mui/material'
import Box from '@mui/material/Box';

function Board(){

    const navigate = useNavigate();
    const classList = JSON.parse(sessionStorage.getItem('classes'))
    const classID = sessionStorage.getItem('chosenClass')
    //const [postJSON, setPostJSON] = useState([{}][{}]);
    const [postIDs, setPostIDs] = useState([]);
    const [userIDs, setUserIDs] = useState([]);
    const [postStatus, setPostStatus] = useState([]);
    const [postBodies, setPostBodies] = useState([]);
    const [postTitles, setPostTitles] = useState([]);
    const [postTags, setPostTags] = useState([]);
    


    useEffect(() =>{
        async function fetchData(){
          //fetch post list as JSON

          const postList = await getPosts({
            classID : classID
          });
          console.log(postList);
          console.log("postlist at 1 1: ")
          console.log(postList[1][1])

         // setPostJSON(postList);
         // console.log(postJSON)
         const postIDs = [];
         const UserIDs = [];
         const postStatus = [];
         const postBodies = [];
         const postTitles = [];
         const postTags = [];

          for(let i = 0; i < postList[0].length; i++){
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

          console.log({postIDs})
          console.log({postBodies})


        }
        fetchData();
    
      }, []);

    async function getPosts(credentials){
        return fetch("http://localhost:5000/getPosts", {
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


    var postArr = [];
    for(let i = 0; i < postIDs.length; i++){
        postArr.push(
            <div value={i}>
              <ListItem  value={i} disablePadding onClick = {(e) => handleChange(e)}>
                <ListItemButton value={i} >
                <ListItemText>
                  <option value = {i}>{postTitles[i] }</option>
                </ListItemText>
                </ListItemButton>
              </ListItem>
              <p value={i} >{postBodies[i]}</p>

                <Divider/>
            </div>
        )
    }



    const handleChange = (event) => {
      console.log(event.target.value)
      sessionStorage.setItem('chosenPost', postIDs[event.target.value])
      sessionStorage.setItem('postTitle', postTitles[event.target.value])
      sessionStorage.setItem('postBody', postBodies[event.target.value])
      console.log(sessionStorage.getItem('chosenPost'))
      navigate("/post");
    }




    return (
        <div>
          <Layout/>
          <p>Discussion Board</p>
          <h2>Discussion Board for {classList[classID]}</h2>


          <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          <nav>
            <List>
                {postArr}
            </List>
          </nav>
      
        </Box>
        </div>
    )
}


export default Board;