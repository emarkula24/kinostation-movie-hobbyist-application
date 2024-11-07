import React from 'react'
import"./Login.css"
import { BiSolidCoffee } from "react-icons/bi";
import { Link } from 'react-router-dom';


function Login() {
  return (
    <div className='Container'>
        <div className='app-title'>
            <BiSolidCoffee className='app-logo'/>
            <h1>Movie App</h1>
        </div>
        <form className='Form'>
            <label className='Label'>Email</label>
            <input className='form-input' type='email' placeholder='Enter Email'/>
            <label className='Label'>Password</label>
            <input className='form-input' type='password' placeholder='Enter Password' />
            <p id='forgot-password'>
                <Link to="ResetPassword">Forgot password?</Link>
            </p>
            <button className='btn' type='submit' >Login</button>
            <p>No Account? 
                <Link to={"/register"}>Register</Link>  
            </p>
        </form>

    </div>
  )
}

export default Login