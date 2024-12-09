import Router from "express"
import { getGroups, addGroup, getGroupById, getGroupMovies } from "../controllers/groupController.js";


const router = Router()

router.get("/", getGroups)
router.post("/", addGroup)
router.get("/:id", getGroupById);
router.get("/:id/movies", getGroupMovies);


export default router