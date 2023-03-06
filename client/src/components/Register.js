import React from 'react'

function Register() {
  return (
    <div><body class="signup">
    <div class="form-box">
      <h2>Sign Up</h2>

      <form>
        <div class="input-group">
          <i class="fa-solid fa-user"></i>
          <input
            type="email"
            id="SignE"
            class="user"
            placeholder="Your Email"
          />
        </div>
        <span class="error"></span>
        <div class="input-group">
          <i class="fa-solid fa-lock"></i>
          <input
            type="password"
            id="SignP"
            class="pass"
            placeholder="Password"
          />
        </div>
        <span class="error"></span>
        <input placeHolder="First Name"/>
        <input placeHolder="Last Name"/>

        <div class="SignButton">
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  </body></div>
  )
}

export default Register