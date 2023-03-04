import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Outlet, Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import PropTypes from 'prop-types'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState([{}])
  const [text, setText] = useState("");
  const navigate = useNavigate();

  async function loginUser(credentials){
    return fetch("http://localhost:5000/login", {
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
    const token = await loginUser({
      email,
      password
    });
    console.log(token.token);
    if(token.token !== ''){
      sessionStorage.setItem('token', token.token);
      navigate("/");
    }
    else{
      setText("Incorrect email or password")
    }
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
              <p>{text}</p>
            </div>
            <button type="submit" class="LogButton">Login</button>
          </form>
          <Link to="/register">Sign Up</Link>
        </div>
      </body>
    </div>

  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}

export default Login