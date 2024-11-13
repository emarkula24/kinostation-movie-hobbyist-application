import { pool } from "../helpers/db.js"

const selectAllReviews = async () => {
    return await pool.query("SELECT * FROM review")
}

export { selectAllReviews }