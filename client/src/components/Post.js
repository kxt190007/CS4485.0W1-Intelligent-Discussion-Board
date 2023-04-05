import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { useLoaderData } from "react-router-dom";
import Layout from './Layout'
import { List,ListItem, ListItemText, ListItemButton, Divider, Accordion, Paper, Grid} from '@mui/material'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import Card from '@mui/material/Card';


export async function loader({ params }) {
  console.log(params.postID)
  //const classInfo = await getClass(params.classID);
  return [params.postID, params.classID]
}

function Post(){
    const loaderData = useLoaderData()
    const postID = loaderData[0]
    const classID = loaderData[1]
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [userIDs, setUserIDs] = useState([]);
    const [commentBodies, setCommentBodies] = useState([]);
    const [postTimes, setPostTimes] = useState([]);
    const [userNames, setUserNames] = useState([]);
    const paperStyle = { padding: "30px 20px", height: '90%', width: '93%', margin: "20px auto"}



    useEffect(() =>{
        console.log(title)


        async function fetchData(){
            //fetch post list as JSON
  
            const commentList = await getPostComments({
                postID : postID
            });
            console.log("comment list: ")
            console.log(commentList);
            
           const postInfo = await getPostTitleBody({
              postID: postID
           });
           console.log("postinfo: ")
           console.log(postInfo);
           console.log(postInfo["title"]);

           setTitle(postInfo["title"])
           setBody(postInfo["body"])
           const userIDs = []
           const commentBodies = []
           const postTimes = []
           const names = []
            for(let i = 0; i < commentList[0].length; i++){
                userIDs[i] = commentList[0][i]
                
                commentBodies[i] = commentList[1][i]
                postTimes[i] = commentList[2][i]
            }
            setUserIDs(userIDs)
            setCommentBodies(commentBodies)
            setPostTimes(postTimes)

            for(let i = 0; i < commentList[0].length; i++){
              let n = await getName({
                userID : userIDs[i]
                });
              names[i] = n.name
            } 
            setUserNames(names)
  
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
      async function getPostTitleBody(credentials){
        return fetch("http://localhost:5000/getPostTitleBody", {
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

      async function getName(credentials){
        return fetch("http://localhost:5000/getCommentUser", {
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
          <Card sx={{ maxWidth: "100%", m: 2, maxHeight: 200}}>
          <CardActionArea onClick = {(e) => handleChange(e)}>
            
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
              {commentBodies[i] }
              </Typography>
              <Divider/>
              <Typography variant="body2" color="text.secondary">
              {userNames[i]} commented at {postTimes[i]}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        )
    }

    return (
        <Grid>
          <Layout/>
          <Paper style = {paperStyle}>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Divider/>
          <Typography variant="body2" color="text.secondary">
            {body}
          </Typography>
 
          <Box
            sx={{
              display: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
              p: 1,
              m: 1,
              bgcolor: 'background.paper',
              maxWidth: "100%",
              borderRadius: 1,
            }}
          >
                {comments}
            </Box>
        </Paper>
        </Grid>
    )
}


export default Post;