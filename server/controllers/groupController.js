import { selectAllGroups, createGroup, selectGroupById, selectGroupMovies, addMovieToGroups } from "../models/Groups.js";
import { emptyOrRows } from "../helpers/emptyOrRows.js";
import { pool } from "../helpers/db.js";

const getGroups = async (req, res, next) => {
    try {
        const result = await selectAllGroups()
        return res.status(200).json(emptyOrRows(result))
    } catch (error) {
        return next(error)
    }
}


const addGroup = async (req, res, next) => {
    const { group_users_id, group_name, group_owner_id, group_introduction } = req.body;

    try {
        const result = await createGroup(group_users_id, group_name, group_owner_id, group_introduction);
        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding group:", error.message);
        return next(error);
    }
};


const getGroupById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await selectGroupById(id);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Group not found" });
        }
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching group:", error.message);
        return next(error);
    }
};

const getGroupMovies = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await selectGroupMovies(id);
        return res.status(200).json(emptyOrRows(result));
    }
    catch (error) {
        console.error("Error fetching group movies:", error.message);
        return next(error);
    }
}

const addMovieToGroup = async (req, res, next) => {
    const { group_id, movie_id, user_id } = req.body;
   
    console.log("group_id:", group_id, "user_id:", user_id, "movie_id:", movie_id);
    try {
        // Validate membership
        const memberResult = await pool.query(`
            SELECT * FROM groupmember
            WHERE groupmember_group_id = $1 AND groupmember_users_id = $2 AND groupmember_status = 'active';
        `, [group_id, user_id]);
        if (memberResult.rows.length === 0) {
            return res.status(403).json({ error: "User is not a member of the group or is inactive." });
        }
        
        // Add movie to group
        const result = await addMovieToGroups(group_id, movie_id)
        console.log(result)
        if (!result.rows.length) {
            return res.status(200).json({ error: "Movie is already in the group." });
        }
        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Backend Error:", error);
        return next(error)
    }
};





export { getGroups, addGroup, getGroupById, getGroupMovies, addMovieToGroup}
