import {useNavigate} from "react-router-dom";
import React, { useState, useEffect } from 'react'

function Logout(){
    const navigate = useNavigate();
    useEffect(() =>{
        sessionStorage.clear();
        navigate("/");
    });
    return(
        <p>Logging out</p>
    );
}

export default Logout