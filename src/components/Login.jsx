import React, { useState } from 'react'
import"./Login.css"
import { BiSolidCoffee } from "react-icons/bi";
import { Link } from 'react-router-dom';
import axios from 'axios';


function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginUser = async (e) => {
        e.preventDefault();
        if(email === '' || password === '') {
            alert('All fields are required');
            return;
        }
        try{
            const response = await axios.post('http://localhost:3001/user/login',
            {
                users_email: email,
                users_password: password
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('response data from login: ', response.data);
        }catch(error){
            console.log('error while login: ', error);
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
            <input onChange={ (e) => setEmail(e.target.value) } className='form-input' type='email' placeholder='Enter Email'/>
            <label className='Label'>Password</label>
            <input onChange={ (e) => setPassword(e.target.value) } className='form-input' type='password' placeholder='Enter Password' />
            <p id='forgot-password'>
                <Link to="../ResetPassword">Forgot password?</Link>
            </p>
            <button onClick={loginUser} className='btn' type='submit' >Login</button>
            <p>No Account? 
                <Link to={"/register"}>Register</Link>  
            </p>
        </form>

    </div>
  )
}

export default Login