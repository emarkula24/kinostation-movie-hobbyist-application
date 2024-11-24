import { Router } from "express"
import { getReviews, createReview } from "../controllers/reviewController.js"
const router = Router()

router.get("/", getReviews)
router.post("/create", createReview)
export default router