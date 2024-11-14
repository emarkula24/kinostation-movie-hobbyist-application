import { selectAllReviews } from "../models/Reviews.js"
import { emptyOrRows} from "../helpers/emptyOrRows.js"

const getReviews = async (req, res, next) => {
    try {
        const result = await selectAllReviews()
        return res.status(200).json(emptyOrRows(result))
    } catch (error) {
        return next(error)
    }
}

export { getReviews }