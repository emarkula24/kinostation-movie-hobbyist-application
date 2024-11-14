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
export { selectAllReviews }