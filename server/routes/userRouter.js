import { pool } from "../helpers/db.js";
import { Router } from "express";
import { compare, hash } from 'bcrypt';
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import { ApiError } from "../helpers/ApiError.js"

const router = Router();

// generate token

let refreshTokens = [];

router.post("/refresh", (req, res) => {
    console.log('hello from refresh route');
    //take the refresh token from the user
    const refreshToken = req.body.token;
    console.log('refresh token: ', refreshToken);

    //send error if there is no token or it's invalid
    if (!refreshToken) return res.status(401).json("You are not authenticated!");
    console.log('refresh token is valid');
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json("Refresh token is not valid!");
    }
    console.log('refresh token includes');
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (err, user) => {
        err && console.log('error from jwt verify: ', err);
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

        const newAccessToken = generateToken(user);
        const newRefreshToken = generateRefreshToken(user);

        console.log('new token generated')

        refreshTokens.push(newRefreshToken);

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    });

    //if everything is ok, create new access token, refresh token and send to user
});

const generateToken = (user)=>{
    return jwt.sign({ users_id: user.users_id, users_email: user.users_email }, process.env.JWT_SECRET_KEY, {expiresIn: '2h'});
}

const generateRefreshToken = (user)=>{
    return jwt.sign({ users_id: user.users_id, users_email: user.users_email }, process.env.JWT_REFRESH_SECRET_KEY, {expiresIn: '1d'});
}

// Register Route
router.post("/register", async (req, res, next) => {
    console.log('hello from register route');
    console.log(req.body);
    try {
        const { users_email, users_password } = req.body;

        if (!users_email || !users_password || users_password.length < 8) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        const uppercaseRegex = /[A-Z]/;
        if (!uppercaseRegex.test(users_password)) {
            return res.status(400).json({ error: "Password must contain at least one uppercase letter." });
        }
        const hashedPassword = await hash(users_password, 10);

        const result = await pool.query(
            "INSERT INTO users (users_email, users_password) VALUES ($1, $2) RETURNING *",
            [users_email, hashedPassword]
        );
        const user = result.rows[0];
        res.status(201).json({
            users_id: user.users_id,
            users_email: user.users_email
        });
    } catch (error) {
        return next(error);
    }
});

// Login Route
router.post("/login", async (req, res, next) => {
    const invalid_message = "Invalid Credentials";
    console.log("hello from login")
    try {
        const { users_email, users_password } = req.body;

        if (!users_email || !users_password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        
        const result = await pool.query(
            "SELECT * FROM users WHERE users_email = $1",
            [users_email]
        );
        
        if (result.rowCount === 0) {
            return res.status(401).json({ error: invalid_message });
        }

        
        const user = result.rows[0];

        if (!await compare(users_password, user.users_password)) {
            return (next(new ApiError(invalid_message, 401)))
        
        }
        // Generate tokens
        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        refreshTokens.push(refreshToken);
        
        res.status(200).json({
            users_id: user.users_id,
            users_email: user.users_email,
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.log(error)
        return next(error);
    }
});

const verify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid!");
            }

            req.user = user;
            next();
        });
    } else {
        res.status(401).json("You are not authenticated!");
    }
};

// logout user
// router.post("/logout", verify, (req, res) => {
//     // const refreshToken = req.body.token;

//     // refreshTokens = refreshTokens.filter(token => token !== refreshToken);

//     res.status(200).json("You logged out successfully!");
// });

router.post("/logout", verify, (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken || !refreshTokens.includes(refreshToken)) {
        return res.status(403).json("Refresh token is not valid or already logged out.");
    }
    
    console.log("before logout", refreshTokens)
    // Remove the refresh token from the list
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    console.log("after logout", refreshTokens)
    res.status(200).json("You logged out successfully!");
});

// delete user account
router.delete("/removeAccount/:id", verify, async (req, res) => {
    try {
        res.status(200).json("User was deleted!");
        // const { users_id } = req.user;
        // await pool.query("DELETE FROM users WHERE users_id = $1", [users_id]);
        // res.status(200).json("User was deleted!");
    } catch (error) {
        return next(error);
    }
});

router.post("/sendEmail", async (req, res) => {
    console.log('hello from send email route');
    let email = req.body.email;
    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    const result = await pool.query(
        "SELECT * FROM users WHERE users_email = $1",
        [email]
    );

    if (result.rowCount === 0) {
        return res.status(401).json({ error: 'Email not found' });
    }

    let user = result.rows[0];

    console.log(result.rows[0]);

    await sendEmail({id: user.users_id , email: user.users_email});

    res.status(200).json({message: 'Email sent successfully'});
});

async function sendEmail({id, email}){
    console.log('email: ', email);

    // generate 4 didit otp code
    const otp = Math.floor(1000 + Math.random() * 9000);

    console.log('otp: ', otp);
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.YOUR_EMAIL_ID_TO_SENT_MAIL,
            pass: process.env.YOUR_EMAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: 'bebibbadnat@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js',
        text: 'Your OTP is: ' + otp
    };

    transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
            console.log('error from send email: ', error);
        } else {
            console.log('Email sent: ' + info.response);

            let otp_insert_data = await pool.query("INSERT INTO otp (otp_id, otp_users_id, otp_code, otp_created_at, otp_validated) VALUES (DEFAULT, $1, $2, DEFAULT, DEFAULT) RETURNING *", [id, otp]);

            let otp_table_data = otp_insert_data.rows[0];
            console.log('otp_table_data: ', otp_table_data);

            return true;
        }
    });
}

router.post("/verifyOtp", async (req, res) => {
    let otp = req.body.otp;
    let email = req.body.email;

    if (!otp || !email) {
        return res.status(400).json({ error: "Email and OTP is required." });
    }

    const result = await pool.query(
        "SELECT * FROM users WHERE users_email = $1",
        [email]
    );

    if (result.rowCount === 0) {
        return res.status(401).json({ error: 'Email not found' });
    }

    let user = result.rows[0];

    let otp_result = await pool.query("SELECT * FROM otp WHERE otp_users_id = $1 AND otp_code = $2", [user.users_id, otp]);

    if (otp_result.rowCount === 0) {
        return res.status(401).json({ error: 'Invalid OTP' });
    }

    let otp_data = otp_result.rows[0];

    let currentDate = new Date();

    let otp_created_at = new Date(otp_data.otp_created_at);

    let diff = currentDate - otp_created_at;

    let diffInMinutes = diff / 60000;

    if (diffInMinutes > 5) {
        return res.status(401).json({ error: 'OTP expired' });
    }

    // change otp_validated to true
    let updatedOtp = await pool.query("UPDATE otp SET otp_validated = $1 WHERE otp_id = $2 RETURNING *", [true, otp_data.otp_id]);
    console.log('updatedOtp: ', updatedOtp.rows[0]);

    let userData = {
        users_id: user.users_id,
        users_email: user.users_email
    }

    res.status(200).json({message: 'OTP verified successfully', userData});
})

router.post("/resetPassword", async (req, res) => {
    let password = req.body.password;
    let email = req.body.email;

    if (!password || !email) {
        return res.status(400).json({ error: "Email and password is required." });
    }

    const result = await pool.query(
        "SELECT * FROM users WHERE users_email = $1",
        [email]
    );

    if (result.rowCount === 0) {
        return res.status(401).json({ error: 'Email not found' });
    }

    // check if otp is validated and time should not be more than 15 minutes from otp created time
    let checkOtp = await pool.query("SELECT * FROM otp WHERE otp_users_id = $1 AND otp_validated = $2", [result.rows[0].users_id, true]);

    if (checkOtp.rowCount === 0) {
        return res.status(401).json({ error: 'OTP not validated' });
    }

    let otp_data = checkOtp.rows[0];

    let currentDate = new Date();

    let otp_created_at = new Date(otp_data.otp_created_at);

    let diff = currentDate - otp_created_at;

    let diffInMinutes = diff / 60000;

    if (diffInMinutes > 15) {
        return res.status(401).json({ error: 'OTP expired. Not able to change password.' });
    }

    let user = result.rows[0];

    const hashedPassword = await hash(password, 10);

    let updatedUser = await pool.query("UPDATE users SET users_password = $1 WHERE users_id = $2 RETURNING *", [hashedPassword, user.users_id]);

    res.status(200).json({message: 'Password updated successfully'});
});

export default router;
