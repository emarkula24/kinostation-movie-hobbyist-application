import { Router } from "express"
import { getReviews, createReview } from "../controllers/reviewController.js"
import { verifyToken } from "../helpers/verifyToken.js"

const router = Router()

router.get("/", getReviews)
router.post("/create", verifyToken, createReview)
export default router