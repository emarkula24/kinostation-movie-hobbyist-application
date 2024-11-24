import { selectAllReviews, insertReview } from "../models/Reviews.js"
import { emptyOrRows} from "../helpers/emptyOrRows.js"

const getReviews = async (req, res, next) => {
    try {
        const result = await selectAllReviews()
        return res.status(200).json(emptyOrRows(result))
    } catch (error) {
        return next(error)
    }
}

const createReview = async (req, res, next) => {
    try {
        const { user_id, movie_id, review, review_rating } = req.body;
        const result = await insertReview(user_id, movie_id, review, review_rating)
        return res.status(200).json({id: result.rows[0].review_id})
    } catch (error) {
        return next(error)
    }
}

export { getReviews, createReview }