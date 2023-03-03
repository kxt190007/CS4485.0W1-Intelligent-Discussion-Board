import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Outlet, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState([{}])

  const handleSubmit = (event) => {
    console.log(email);
    console.log(password);
    event.preventDefault();
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    })
    .then(
      res=>res.json()
    ).then(
      data=>{
        setData(data)
        console.log(data)
      }
    )
  }


  return (
    <div> Login
      <body>
        <div class="form-box">
          <h2>Log In</h2>
          <form onSubmit={handleSubmit}>
            <div class="input-group">
              <i class="fa-solid fa-user"></i>

              <input
                type="email"
                id="LogE"
                class="user"
                placeholder="Your Email"
                onChange = {(e) => setEmail(e.target.value)}
              />
              <span class="error"></span>
              <input
                type="password"
                id="LogP"
                class="pass"
                placeholder="Password"
                onChange = {(e) => setPassword(e.target.value)}
              />
              <span class="error"></span>
            </div>
            <button type="submit" class="LogButton">Login</button>
          </form>
          <Link to="/register">Sign Up</Link>
        </div>
      </body>
    </div>

  )
}

export default Login