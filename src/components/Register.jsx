import React from 'react'
import"./Register.css"
import { BiSolidCoffee } from "react-icons/bi";
import { Link } from 'react-router-dom';

function Register() {
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
            <label className='Label'>Confirm Password</label>
            <input className='form-input' type='password' placeholder='Confirm Password' />
            <button className='btn' type='submit' >Register</button>
            <p>Already have account? 
                <Link to={"/"}>Sign in</Link>
            </p>
        </form>

    </div>
  )
}

export default Register