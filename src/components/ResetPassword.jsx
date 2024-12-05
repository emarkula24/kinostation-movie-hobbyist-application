import React, { useState } from 'react';
import "./ResetPassword.css"; 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const url = process.env.REACT_APP_API_URL
    const resetPassword = async (e) => {
        e.preventDefault();
        if (!email || !password || !confirmPassword || !otp) {
            alert('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(url + '/user/resetPassword', {
                email,
                password,
                otp
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.message) {
                setMessage(response.data.message);
                // Redirect to login or home page after successful password reset
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            console.log('Error while resetting password: ', error);
            if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error); // Display error message from the server
            } else {
                alert('An error occurred while resetting the password');
            }
        }
    };

    return (
        <div className="reset-password-container">
            <h1>Reset Password</h1>
            {message && <p className="message">{message}</p>}
            <form className="reset-password-form">
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label>OTP</label>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />

                <label>New Password</label>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <label>Confirm New Password</label>
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button onClick={resetPassword} type="submit" className="btn">
                    Reset Password
                </button>
            </form>
            <p>
                Remember your password? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}

export default ResetPassword;