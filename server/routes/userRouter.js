import { pool } from "../helpers/db.js";
import { Router } from "express";
import { compare, hash } from 'bcrypt';
import jwt from "jsonwebtoken";

const router = Router();

// generate token

let refreshTokens = [];

const generateToken = (user)=>{
    return jwt.sign({ users_id: user.users_id, users_email: user.users_email }, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
}

const generateRefreshToken = (user)=>{
    return jwt.sign({ users_id: user.users_id, users_email: user.users_email }, process.env.JWT_REFRESH_SECRET_KEY);
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

        if (!await compare(users_password, user.users_password)) return next(new ApiError(invalid_message, 401))

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
        return next(error);
    }
});

// const verify = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (authHeader) {
//         const token = authHeader.split(" ")[1];

//         jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
//             if (err) {
//                 return res.status(403).json("Token is not valid!");
//             }

//             req.user = user;
//             next();
//         });
//     } else {
//         res.status(401).json("You are not authenticated!");
//     }
// };

export default router;
