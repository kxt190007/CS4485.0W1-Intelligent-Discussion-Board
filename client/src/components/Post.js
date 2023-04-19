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
import Textarea from '@mui/joy/Textarea';
import Moment from 'react-moment';
import moment from 'moment';
import { Link } from 'react-router-dom'


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
    const [newComment, setNewComment] = useState("");
    const [userIDs, setUserIDs] = useState([]);
    const [commentIDs, setCommentIDs] = useState([]);
    const [commentBodies, setCommentBodies] = useState([]);
    const [postTimes, setPostTimes] = useState([]);
    const [userNames, setUserNames] = useState([]);
    const paperStyle = { padding: "30px 20px", height: '90%', width: '90%', margin: "20px auto"}




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

           setTitle(postInfo["title"])
           setBody(postInfo["body"])

           const userIDs = []
           const commentBodies = []
           const postTimes = []
           const commentIDs = []
           const names = []
            for(let i = 0; i < commentList[0].length; i++){
                userIDs[i] = commentList[0][i]
                commentBodies[i] = commentList[1][i]
                postTimes[i] = commentList[2][i]
                commentIDs[i] = commentList[3][i]

            }
            setUserIDs(userIDs)
            setCommentBodies(commentBodies)
            setPostTimes(postTimes)
            setCommentIDs(commentIDs)

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

           setTitle(postInfo["title"])
           setBody(postInfo["body"])
           const userIDs = []
           const commentBodies = []
           const postTimes = []
           const commentIDs = []
           const names = []

            for(let i = 0; i < commentList[0].length; i++){
                userIDs[i] = commentList[0][i]
                commentBodies[i] = commentList[1][i]
                postTimes[i] = commentList[2][i]
                commentIDs[i] = commentList[3][i]

            }
            setUserIDs(userIDs)
            setCommentBodies(commentBodies)
            setPostTimes(postTimes)
            setCommentIDs(commentIDs)

            for(let i = 0; i < commentList[0].length; i++){
              let n = await getName({
                userID : userIDs[i]
                });
              names[i] = n.name
            }
            setUserNames(names)
          }

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

  async function remove(credentials) {
    console.log("remove is called")
    return fetch("http://localhost:5000/removeComment", {
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
      async function createComment(credentials){
        return fetch("http://localhost:5000/createComment", {
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

          <Card sx={{ maxWidth: "85%", m: 2, maxHeight: 200 ,marginLeft: 'auto', marginRight: 'auto'}}>
          <CardActionArea onClick = {(e) => handleChange(e)}>

            <CardContent >

              <Typography gutterBottom variant="body1" component="div" sx={{}}>
              {commentBodies[i] }
              </Typography>

              <Typography variant="caption text" color="text.secondary">
              {userNames[i]} commented at {postTimes[i]}
              </Typography>
              <Button onClick={() => removeComment({postID}, commentIDs[i])}>Delete</Button>
            </CardContent>
          </CardActionArea>
        </Card>
        )
    }
    function refreshPage(delay) {
      return new Promise(window.location.reload(false), setTimeout(delay));

    }
    const handleSubmit = async ev => {

      ev.preventDefault();
      let date_create = moment().format("YYYY-MM-DD hh:mm:ss")
      await createComment({
        userID: sessionStorage.getItem('token'),
        postID,
        comment: newComment,
        date: date_create
      });

    }
  const removeComment = async (index, commentIndex) => {
    console.log(index)
    console.log(commentIndex)
    await remove({
      postID: index,
      commentID: commentIndex,
    })


  }

    if(commentBodies.length != 0){
      return (
        <nav>
          <Layout/>
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
            
            <Paper style = {paperStyle} elevation={3}>
              <Grid sx={{
            display: 'flex',
            justifyContent: 'space-between',
            p: 0,
            m: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            }}>
            <Typography gutterBottom variant="h4" component="div">
              {title}
            </Typography>
            <Button  color="inherit" >
              <Link to={"/Board/"+classID}>Back</Link>
              </Button>
              </Grid>
            <Divider/>
            <Typography variant="body1" color="text.secondary">
              {body}
            </Typography> 
            <br />
          <br />



          <Typography gutterBottom variant="h5" component="div">
            <Box pl={6} pr={2} ml={13}>Comments</Box>
          </Typography>
          <Divider/>


          {comments}
          
  
            <Divider/>
            <Box sx={{m:2}}>
              <form
              onSubmit={handleSubmit}
            >
              <Textarea
                placeholder="Add a comment here..."
                required
                sx={{ mt: 1, width:'86.5%', marginLeft: 'auto', marginRight: 'auto', display: 'block'}}
                id="inputComment"
                onChange={(v) => setNewComment(v.target.value)}
                value = {newComment}
              />
              <Button type="submit" variant="contained" sx={{ marginLeft: 14 , marginTop: 2 }}>Submit</Button>
              <Typography variant="body2" color="text.secondary">
              <br />

              Click submit and refresh the page to see your comment
              </Typography>
            </form>
            </Box>
            
            
            
          </Paper>
          </Grid>
          </nav>
      )
    }
    else{
      return (
        <nav>
          <Layout/>
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
            
            <Paper style = {paperStyle} elevation={3}>
            <Typography gutterBottom variant="h4" component="div">
              {title}
            </Typography>
            <Divider/>
            <Typography variant="body1" color="text.secondary">
              {body}
            </Typography> 
              <Card sx={{ maxWidth: "100%", m: 2, maxHeight: 200}}>
                  <CardActionArea onClick = {(e) => handleChange(e)}>
                  
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                    It's quiet here... Be the first to comment!
                    </Typography>
                    <Divider/>
                  
                  </CardContent>
                </CardActionArea>
              </Card>
            <Divider/>
            <Box sx={{m:2}}>
              <form
              onSubmit={handleSubmit}
            >
              <Textarea
                placeholder="Add a comment here..."
                required
                sx={{ mt: 1, width:'86.5%', marginLeft: 'auto', marginRight: 'auto', display: 'block'}}
                id="inputComment"
                onChange={(v) => setNewComment(v.target.value)}
                value = {newComment}
              />
              <Button type="submit" variant="contained" sx={{ marginLeft: 14 , marginTop: 2 }}>Submit</Button>
              <Typography variant="body2" color="text.secondary">
              <br />

              Click submit and refresh the page to see your comment
              </Typography>
            </form>
            </Box>
            
  
            
          </Paper>
          </Grid>
          </nav>
      )
    }
    

}


export default Post;
