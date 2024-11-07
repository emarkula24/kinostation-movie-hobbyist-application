import { pool } from "../helpers/db.js";
import { Router } from "express";

const router = Router();

// Register Route
router.post("/register", async (req, res, next) => {
    try {
        const { users_email, users_password } = req.body;

        if (!users_email || !users_password || users_password.length < 8) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        const result = await pool.query(
            "INSERT INTO users (users_email, users_password) VALUES ($1, $2) RETURNING *",
            [users_email, users_password]
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

        if (users_password !== user.users_password) {
            return res.status(401).json({ error: invalid_message });
        }

        res.status(200).json({
            users_id: user.users_id,
            users_email: user.users_email
        });
    } catch (error) {
        return next(error);
    }
});

export default router;
