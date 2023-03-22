import React from 'react'
import { Avatar, Grid, Paper, TextField, Checkbox, FormControlLabel, Button, Typography, Link} from '@mui/material'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
const Register=()=> {

  const paperStyle = {padding: "30px 20px", height: '60vh', width: 320, margin: "20px auto"}
  const avatarStyle = {backgroundColor: 'orange'}
  const btnStyle = {margin: '8px 0'}
  
    return(
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align = 'center'>
                    <Avatar style={avatarStyle}><AccountBoxIcon/></Avatar>
                        <h2>User Registration</h2>
                </Grid>
                <TextField id="standard-basic" label="First Name" placeholder='Enter first name' variant="standard" fullWidth required/>
                <TextField id="standard-basic" label="Last Name" placeholder='Enter last name' variant="standard" fullWidth required/>
                <TextField id="standard-basic" label="Email" placeholder='Enter email' variant="standard" fullWidth required/>
                <TextField id="standard-basic" label="Password" placeholder='Enter password' type= 'password' variant="standard" fullWidth required/>
                <Button variant="contained" style={btnStyle} fullWidth>Sign up</Button>
                
            </Paper>
        </Grid>
    /*<div><body class="signup">
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
  </body></div>*/
  
  )
}

export default Register