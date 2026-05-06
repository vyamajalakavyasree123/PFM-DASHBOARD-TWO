import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css';

function Login(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password
      });

      console.log(res.data);
      localStorage.setItem("email", email);
      alert("Login Successfully");
      navigate("/dashboard");
      

    } catch (error) {
      console.log(error.response?.data);
      alert("Login Failed");
    }
  };

  return(
    <div className="login-div">

      <i className="fa fa-user-circle login-icon"></i>

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Email</label>
          <input 
            type="text"
            className="form-control"
            placeholder="Enter Email"
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input 
            type="password"
            className="form-control"
            placeholder="Enter Password"
            onChange={(e)=>setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn">
          <i className="fa fa-sign-in-alt"></i> Login
        </button>

      </form>

    </div>
  );
}

export default Login;