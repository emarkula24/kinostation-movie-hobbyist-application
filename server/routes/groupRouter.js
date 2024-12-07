import Router from "express"
import { getGroups, addGroup, getGroupById } from "../controllers/groupController.js";


const router = Router()

router.get("/", getGroups)
router.post("/", addGroup)
router.get("/:id", getGroupById);


export default router