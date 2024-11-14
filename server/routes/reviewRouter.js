import { Router } from "express"
import { getReviews } from "../controllers/reviewController.js"
const router = Router()

router.get("/", getReviews)

export default router