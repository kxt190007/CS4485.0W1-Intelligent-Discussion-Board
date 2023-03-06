import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import Layout from './Layout'
function Home() {
  if(!sessionStorage.getItem('token')){
    return (
      <div>
        <Link to="/login">Login</Link>
        <p>Please login to view class discussion boards.</p>
      </div>
    )
  }
  return (
    <div>
      <Layout/>
      <p>Home Page</p>
    </div>

  )
}

export default Home