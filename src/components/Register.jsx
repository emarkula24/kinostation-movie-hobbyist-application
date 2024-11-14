import React, { useState } from 'react'
import"./Register.css"
import { BiSolidCoffee } from "react-icons/bi";
import { Link } from 'react-router-dom';
import axios from 'axios';

function Register() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const registerUser = async (e) => {
      e.preventDefault();
      if(email === '' || password === '' || confirmPassword === '') {
          alert('All fields are required');
          return;
      }
      if(password !== confirmPassword){
          alert('Password and Confirm Password do not match');
          return;
      }
      try{
          const response = await axios.post('http://localhost:3001/user/register',
          {
              users_email: email,
              users_password: password
          },
          {
              headers: {
                  'Content-Type': 'application/json'
              }
          });
          console.log('response data from register: ', response.data);
        }catch(error){
            console.log('error while register: ', error);
        }
  }

  return (
    <div className='Container'>
        <div className='app-title'>
            <BiSolidCoffee className='app-logo'/>
            <h1>Movie App</h1>
        </div>
        <form className='Form'>
            <label className='Label'>Email</label>
            <input onChange={(e)=>setEmail(e.target.value)} className='form-input' type='email' placeholder='Enter Email'/>
            <label className='Label'>Password</label>
            <input onChange={(e)=>setPassword(e.target.value)} className='form-input' type='password' placeholder='Enter Password' />
            <label className='Label'>Confirm Password</label>
            <input onChange={(e)=>setConfirmPassword(e.target.value)} className='form-input' type='password' placeholder='Confirm Password' />
            <button onClick={registerUser} className='btn' type='submit' >Register</button>
            <p>Already have account? 
                <Link to={"/login"}>Sign in</Link>
            </p>
        </form>

    </div>
  )
}

export default Register