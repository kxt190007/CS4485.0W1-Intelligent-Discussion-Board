import React, { useState, useEffect } from 'react'
import {Navigate, useNavigate} from 'react-router-dom'


function Create() {
  const token = sessionStorage.getItem('token');
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postTag, setPostTag] = useState("");
  const [data, setData] = useState([{}])
  const navigate = useNavigate();
  async function createPost(credentials){
    return fetch("http://localhost:5000/post", {
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
  const handleSubmit = async e => {
    e.preventDefault();
    await createPost({
      userID: token,
      postContent,
      postTitle,
      postTag
    });
    navigate("/")
  }
  
  // const handleSubmit = (event) => {
  //   console.log(sessionStorage.getItem('token'))
  //   event.preventDefault();
  //   fetch("http://localhost:5000/post", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       userID: sessionStorage.getItem('token'),
  //       postTitle: postTitle,
  //       postContent: postContent,
  //       postTag: postTag,
  //     }),
  //   })
  //     .then(
  //       res => res.json()
  //     ).then(
  //       data => {
  //         setData(data)
  //         console.log(data)
  //       }
  //     )

  // }
  if(!sessionStorage.getItem('token')){
    return <Navigate replace to="/login"/>
  }
  return (
    
    <div><h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="posttitle"
          type="text"
          id="posttitle"
          class="input-box"
          placeholder="Post Title"
          required="required"
          onChange={(e) => setPostTitle(e.target.value)}
        ></input><br />
        <textarea
          name="postcontent"
          id="postcontent"
          class="input-box"
          placeholder="Post content"
          required="required"
          onChange={(e) => setPostContent(e.target.value)}
        ></textarea> <br />
        <label for="tag">Tag (Optional):</label>
        <input list="tagpresets" id="tag" name="tag" onChange={(e) => setPostTag(e.target.value)}></input>

        <datalist id="tagpresets">
          <option value="Homework"></option>
          <option value="Exam"></option>
          <option value="Project"></option>
          <option value="General"></option>
        </datalist> <br />
        <input type="submit" value="Create Post"></input>
      </form>
    </div>
  )
}

export default Create