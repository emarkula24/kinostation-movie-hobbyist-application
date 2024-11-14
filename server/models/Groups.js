import { pool } from "../helpers/db.js"

const selectAllGroups = async () => {
    return pool.query(`
        SELECT
            usergroup.group_id,
            usergroup.group_name,
            usergroup.group_owner_id,
            usergroup.group_users_id
        FROM 
            usergroup
        `)
}

const createGroup = async (group_users_id, group_name, group_owner_id) => {
    return pool.query("INSERT INTO usergroup (group_users_id, group_name, group_owner_id) VALUES ($1, $2, $3) RETURNING *",
        [group_users_id, group_name, group_owner_id]
    )
}

export { selectAllGroups, createGroup }