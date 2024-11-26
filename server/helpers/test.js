import fs from "fs"
import path from "path"
import { pool } from "./db.js"
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { hash } from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
const { sign } = jwt

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const initializeTestDb = () => {
    const sql = fs.readFileSync(path.resolve(__dirname, "../test.sql"), "utf8");
    pool.query(sql)
}

const insertTestUser = async (email, password) => {
    
    const hashedPassword = await hash(password, 10);
        await pool.query("insert into users (users_email, users_password) values ($1, $2)",
            [email, hashedPassword])
    }

const getToken = (email) => {
    return sign({user: email}, process.env.JWT_SECRET_KEY)
}

export { initializeTestDb, insertTestUser, getToken }