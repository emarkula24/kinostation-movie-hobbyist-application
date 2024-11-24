import { pool } from "../helpers/db.js"

const selectAllReviews = async () => {
    return await pool.query(`
        SELECT
            review.review_id,
            review.review_rating,
            review.review_text,
            review.review_created_at,
            review.review_users_id,
            movie.movie_id,
            movie.movie_image,
            movie.movie_title,
            movie.movie_description
        FROM
            review
        JOIN
            movie ON review.review_movie_id = movie.movie_id;
    `)
}

//insert review stuff: user_id, movie_id, review, review_rating

const insertReview = async (user_id, movie_id, review, review_rating) => {
    return await pool.query(`
        INSERT INTO review (review_users_id, review_movie_id, review_text, review_rating, review_created_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        RETURNING *;
        `, [user_id, movie_id, review, review_rating])
}

export { selectAllReviews, insertReview }