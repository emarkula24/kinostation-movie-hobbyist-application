import Router from "express"
import { getGroups } from "../controllers/groupController.js"

const router = Router()

router.get("/", getGroups)

export default router