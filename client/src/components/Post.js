import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { useLoaderData } from "react-router-dom";
import Layout from './Layout'
import { List, ListItem, ListItemText, ListItemButton, Divider, Accordion, Paper, Grid, CircularProgress } from '@mui/material'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import Card from '@mui/material/Card';
import Textarea from '@mui/joy/Textarea';
import Moment from 'react-moment';
import moment from 'moment';
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import "./Post.css"


export async function loader({ params }) {
  console.log(params.postID)
  //const classInfo = await getClass(params.classID);
  return [params.postID, params.classID]
}

function Post() {
  const loaderData = useLoaderData()
  const postID = loaderData[0]
  const classID = loaderData[1]
  const [moderator, setModerator] = useState("")
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [newComment, setNewComment] = useState("");
  const [commentIDs, setCommentIDs] = useState([]);
  const [userIDs, setUserIDs] = useState([]);
  const [commentBodies, setCommentBodies] = useState([]);
  const [postTimes, setPostTimes] = useState([]);
  const [userNames, setUserNames] = useState(new Map());
  const [classList, setClassList] = useState([]);
  const [fetchDone, setFetchDone] = useState(false)
  const [clickID, setClickID] = useState(null)
  const [commentTotal, setCommentTotal] = useState([])
  const navigate = useNavigate();
  const paperStyle = { padding: "30px 20px", height: '90%', width: '90%', margin: "20px auto" }
  const [userReply, setUserReply] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")




  useEffect(() => {
    console.log(title)
    fetchData();

  }, []);

  async function fetchData() {
    //fetch post list as JSON
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
    const temp1 = token.classList
    setClassList(temp1)
    console.log(temp1)
    console.log(classID)
    var inClass = false
    for (let i = 0; i < temp1.length; i++) {
      if (temp1[i][0] == classID) {
        inClass = true
      }
    }
    if (!inClass) {
      console.log(token.classList)
      console.log("Exiting")
      navigate("/")
    }
    const token1 = await getPostComments({
      postID: postID
    });

    const postInfo = await getPostTitleBody({
      postID: postID
    });

    setTitle(postInfo["title"])
    setBody(postInfo["body"])
    setFirstName(postInfo['firstName'])
    setLastName(postInfo['lastName'])
    const commentList = token1.arr
    const userIDs = []
    const commentBodies = []
    const commentIDs = []
    const postTimes = []
    const names = []
    for (let i = 0; i < commentList[0].length; i++) {
      userIDs[i] = commentList[0][i]
      commentBodies[i] = commentList[1][i]
      postTimes[i] = commentList[2][i]
      commentIDs[i] = commentList[3][i]
    }
    setUserIDs(userIDs)
    setCommentBodies(commentBodies)
    setPostTimes(postTimes)
    setCommentIDs(commentIDs)
    setCommentTotal(token1.rows)
    console.log(token1.rows[0])

    // const userMap = new Map()
    // for (let i = 0; i < commentList[0].length; i++) {
    //   let n = await getName({
    //     userID: userIDs[i]
    //   });
    //   userMap.set(userIDs[i], n.name)
    // }
    // setUserNames(userMap)
    setFetchDone(true)
    const moderator = await checkModerator({
      userID: sessionStorage.getItem('token'),
      classID,
    })
    setModerator(moderator.message)
    console.log("checking mod")
    console.log(moderator.message)
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

  async function getPostComments(credentials) {
    return fetch("http://localhost:5000/getPostComments", {
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
  async function getPostTitleBody(credentials) {
    return fetch("http://localhost:5000/getPostTitleBody", {
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

  // async function getName(credentials) {
  //   return fetch("http://localhost:5000/getCommentUser", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(credentials),
  //   })
  //     .then(
  //       res => res.json()
  //     )
  // }
  async function createComment(credentials) {
    return fetch("http://localhost:5000/createComment", {
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

  const handleChange = (event) => {

  }
  function handleReplyChange(curID) {
    setClickID(curID)
    setUserReply("")
  }



  // var comments = [];
  var directComments = [];
  var comments1 = [];
  const mapMargin = new Map()
  var curMargin = 0;
  var prevCommentID = -1;
  for (let i = commentTotal.length - 1; i >= 0; i--) {
    if (commentTotal[i][5] == -1) {
      directComments.push(commentTotal[i])
    }
  }

  while (directComments.length != 0) {
    const curComment = directComments.pop()
    if (curComment[5] == -1) {
      curMargin = 0
      mapMargin.set(curComment[2], curMargin)
    }
    else if (prevCommentID == curComment[5]) {
      curMargin += 5
      mapMargin.set(curComment[2], curMargin)
    }
    else {
      curMargin = mapMargin.get(curComment[5]) + 5
      mapMargin.set(curComment[2], curMargin)
    }
    if (sessionStorage.getItem('accesslevel') == 5 || moderator == 'yes') {
    comments1.push(
      <Card sx={{ maxWidth: "85%", m: 2, maxHeight: 200, marginLeft: curMargin, marginRight: 'auto' }}>
        <CardActionArea onClick={(e) => handleChange(e)}>

          <CardContent >

            <Typography gutterBottom variant="body1" component="div" sx={{}}>
              {curComment[3]}
            </Typography>

            <Typography variant="caption text" color="text.secondary">
              {curComment[9] + " " + curComment[10]} commented at {curComment[4]}
            </Typography>

            <Button onClick={() => removeComment({ postID }, curComment[2])}>Delete</Button>
            <Button onClick={() => handleReplyChange(curComment[2])}>Reply</Button>
            <Textarea value={userReply} name={"reply-content-" + curComment[2]} className={clickID == curComment[2] ? "reply-text" : "reply-text-hidden"}
              onChange={(e) => setUserReply(e.target.value)}></Textarea>
            <Button onClick={() => handleReplySubmit(curComment[2])} className={clickID == curComment[2] ? "reply-text" : "reply-text-hidden"}>Post</Button>
          </CardContent>
        </CardActionArea>
      </Card>
    )
    }
    else {
        if(curComment[1] == sessionStorage.getItem('token')) {

        comments1.push(
      <Card sx={{ maxWidth: "85%", m: 2, maxHeight: 200, marginLeft: curMargin, marginRight: 'auto' }}>
        <CardActionArea onClick={(e) => handleChange(e)}>

          <CardContent >

            <Typography gutterBottom variant="body1" component="div" sx={{}}>
              {curComment[3]}
            </Typography>

            <Typography variant="caption text" color="text.secondary">
              {curComment[9] + " " + curComment[10]} commented at {curComment[4]}
            </Typography>

            <Button onClick={() => removeComment({ postID }, curComment[2])}>Delete</Button>
            <Button onClick={() => handleReplyChange(curComment[2])}>Reply</Button>
            <Textarea value={userReply} name={"reply-content-" + curComment[2]} className={clickID == curComment[2] ? "reply-text" : "reply-text-hidden"}
              onChange={(e) => setUserReply(e.target.value)}></Textarea>
            <Button onClick={() => handleReplySubmit(curComment[2])} className={clickID == curComment[2] ? "reply-text" : "reply-text-hidden"}>Post</Button>
          </CardContent>
        </CardActionArea>
      </Card>
    )
        }
        else {
            comments1.push(
      <Card sx={{ maxWidth: "85%", m: 2, maxHeight: 200, marginLeft: curMargin, marginRight: 'auto' }}>
        <CardActionArea onClick={(e) => handleChange(e)}>

          <CardContent >

            <Typography gutterBottom variant="body1" component="div" sx={{}}>
              {curComment[3]}
            </Typography>

            <Typography variant="caption text" color="text.secondary">
              {curComment[9] + " " + curComment[10]} commented at {curComment[4]}
            </Typography>
            <Button onClick={() => handleReplyChange(curComment[2])}>Reply</Button>
            <Textarea value={userReply} name={"reply-content-" + curComment[2]} className={clickID == curComment[2] ? "reply-text" : "reply-text-hidden"}
              onChange={(e) => setUserReply(e.target.value)}></Textarea>
            <Button onClick={() => handleReplySubmit(curComment[2])} className={clickID == curComment[2] ? "reply-text" : "reply-text-hidden"}>Post</Button>
          </CardContent>
        </CardActionArea>
      </Card>
        )
        }
    }
    for (let j = commentTotal.length - 1; j >= 0; j--) {
      if (curComment[2] == commentTotal[j][5]) {
        directComments.push(commentTotal[j])
      }
    }
    prevCommentID = curComment[2]
  }
  // for (let i = 0; i < userIDs.length; i++) {
  //   comments.push(

  //     <Card sx={{ maxWidth: "85%", m: 2, maxHeight: 200, marginLeft: 'auto', marginRight: 'auto' }}>
  //       <CardActionArea onClick={(e) => handleChange(e)}>

  //         <CardContent >

  //           <Typography gutterBottom variant="body1" component="div" sx={{}}>
  //             {commentBodies[i]}
  //           </Typography>

  //           <Typography variant="caption text" color="text.secondary">
  //             {userNames.get(userIDs[i])} commented at {postTimes[i]}
  //           </Typography>

  //           <Button onClick={() => removeComment({ postID }, commentIDs[i])}>Delete</Button>
  //           <Button onClick={() => setClickID(i)}>Reply</Button>
  //           <Textarea className={clickID == i ? "reply-text" : "reply-text-hidden"}></Textarea>
  //           <Button className={clickID == i ? "reply-text" : "reply-text-hidden"}>Post</Button>
  //         </CardContent>
  //       </CardActionArea>
  //     </Card>
  //   )
  // }
  // function refreshPage(delay) {
  //   return new Promise(window.location.reload(false), setTimeout(delay));

  // }
  function goBack() {
    navigate("/board/" + classID)
  }
  const handleSubmit = async ev => {
    if (newComment != "") {
      ev.preventDefault();
      setNewComment("")
      let date_create = moment().format("YYYY-MM-DD hh:mm:ss")
      await createComment({
        userID: sessionStorage.getItem('token'),
        postID,
        comment: newComment,
        date: date_create,
        commentReply: -1,
      });
      const token1 = await getPostComments({
        postID: postID
      });
      const commentList = token1.arr
      const userIDs = []
      const commentBodies = []
      const commentIDs = []
      const postTimes = []
      const names = []
      for (let i = 0; i < commentList[0].length; i++) {
        userIDs[i] = commentList[0][i]
        commentBodies[i] = commentList[1][i]
        postTimes[i] = commentList[2][i]
        commentIDs[i] = commentList[3][i]
      }
      setUserIDs(userIDs)
      setCommentBodies(commentBodies)
      setPostTimes(postTimes)
      setCommentIDs(commentIDs)
      setCommentTotal(token1.rows)
      console.log(token1.rows[0])
  
    //   const userMap = new Map()
    //   for (let i = 0; i < commentList[0].length; i++) {
    //     let n = await getName({
    //       userID: userIDs[i]
    //     });
    //     userMap.set(userIDs[i], n.name)
    //   }
    //   setUserNames(userMap)
    //   console.log(userMap)
     }
  }

  const removeComment = async (index, commentIndex) => {
    console.log(index)
    console.log(commentIndex)
    await remove({
      postID: index,
      commentID: commentIndex,
    })


  }
  const handleReplySubmit = async (commentID) => {
    if (userReply != "") {
      setUserReply("")
      setClickID(null)
      let date_create = moment().format("YYYY-MM-DD hh:mm:ss")
      await createComment({
        userID: sessionStorage.getItem('token'),
        postID,
        comment: userReply,
        date: date_create,
        commentReply: commentID,
      })
      const token1 = await getPostComments({
        postID: postID
      });
      const commentList = token1.arr
      const userIDs = []
      const commentBodies = []
      const commentIDs = []
      const postTimes = []
      const names = []
      for (let i = 0; i < commentList[0].length; i++) {
        userIDs[i] = commentList[0][i]
        commentBodies[i] = commentList[1][i]
        postTimes[i] = commentList[2][i]
        commentIDs[i] = commentList[3][i]
      }
      setUserIDs(userIDs)
      setCommentBodies(commentBodies)
      setPostTimes(postTimes)
      setCommentIDs(commentIDs)
      setCommentTotal(token1.rows)
      console.log(token1.rows[0])
  
      // const userMap = new Map()
      // for (let i = 0; i < commentList[0].length; i++) {
      //   let n = await getName({
      //     userID: userIDs[i]
      //   });
      //   userMap.set(userIDs[i], n.name)
      // }
      // setUserNames(userMap)
      // console.log(userMap)
    }
  }

  if (commentBodies.length != 0 && fetchDone) {
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

          <Paper style={paperStyle} elevation={3}>
            <Grid sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: 0,
              m: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}>
              <div>
                <Typography gutterBottom variant="h4" component="div">
                  {title}
                </Typography>
              </div>
              <Button variant="contained" color="primary" onClick={() => goBack()}>Back</Button>
            </Grid>
            <Divider />
            <Typography variant="body1" color="text.secondary">
              {body}
              <br/> Posted by: {firstName + " " + lastName}
            </Typography>
            <br />
            <br />



            <Typography gutterBottom variant="h5" component="div">
              <Box pr={2} >Comments</Box>
            </Typography>
            <Divider />


            {comments1}


            <Divider />
            <Box sx={{ my: 2 }}>
              <form
                onSubmit={handleSubmit}
              >
                <Textarea
                  placeholder="Add a comment here..."
                  required
                  sx={{ mt: 1, width: '86.5%', marginRight: 'auto'}}
                  id="inputComment"
                  onChange={(v) => setNewComment(v.target.value)}
                  value={newComment}
                />
                <Button type="submit" variant="contained" sx={{marginTop: 2 }}>Submit</Button>
              </form>
            </Box>



          </Paper>
        </Grid>
      </nav>
    )
  }
  else if (!sessionStorage.getItem('token')) {
    return <Navigate replace to="/" />
  }
  else if (fetchDone) {
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

          <Paper style={paperStyle} elevation={3}>
            <Grid sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: 0,
              m: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}>
              <div>
                <Typography gutterBottom variant="h4" component="div">
                  {title}
                </Typography>
                <Divider />
                <Typography variant="body1" color="text.secondary">
                  {body}
                </Typography>
              </div>
              <Button variant="contained" color="primary" onClick={() => goBack()}>Back</Button>
            </Grid>
            <Card sx={{ maxWidth: "100%", m: 2, maxHeight: 200 }}>
              <CardActionArea onClick={(e) => handleChange(e)}>

                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    It's quiet here... Be the first to comment!
                  </Typography>
                  <Divider />

                </CardContent>
              </CardActionArea>
            </Card>
            <Divider />
            <Box sx={{ my: 2 }}>
              <form
                onSubmit={handleSubmit}
              >
                <Textarea
                  placeholder="Add a comment here..."
                  required
                  sx={{ mt: 1, width: '86.5%', marginRight: 'auto'}}
                  id="inputComment"
                  onChange={(v) => setNewComment(v.target.value)}
                  value={newComment}
                />
                <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>Submit</Button>
              </form>
            </Box>



          </Paper>
        </Grid>
      </nav>
    )
  }
  else {
    return (
      <Grid >
        <Layout />
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '300px' }}>
          <CircularProgress color="success" size={80} />
        </Box>
      </Grid>
    )
  }


}


export default Post;
