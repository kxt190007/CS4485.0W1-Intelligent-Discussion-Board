import React, { useState, useEffect } from 'react'
import Create from './components/Create'
import Home from './components/Home.js'
import Login from './components/Login.js'
import Register from './components/Register'
import Layout from './components/Layout.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


function App() {

  const [data, setData] = useState([{}])

  // useEffect(() => {
  //   fetch("http://localhost:5000/post", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       email: "kcl190001@utdallas.edu",
  //       password: "test"
  //     }),
  //   })
  //   .then(
  //     res=>res.json()
  //   ).then(
  //     data=>{
  //       setData(data)
  //       console.log(data)
  //     }
  //   )
  // }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="create" element={<Create />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
