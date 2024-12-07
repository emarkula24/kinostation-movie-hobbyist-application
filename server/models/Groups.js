import { pool } from "../helpers/db.js"

const selectAllGroups = async () => {
    return pool.query(`
        SELECT
            usergroup.group_id,
            usergroup.group_name,
            usergroup.group_owner_id,
            usergroup.group_users_id,
            usergroup.group_introduction
        FROM 
            usergroup
        `)
}

const createGroup = async (group_users_id, group_name, group_owner_id,group_introduction) => {
    return pool.query("INSERT INTO usergroup (group_users_id, group_name, group_owner_id,group_introduction) VALUES ($1, $2, $3,$4) RETURNING *",
        [group_users_id, group_name, group_owner_id,group_introduction]
    )
}

export { selectAllGroups, createGroup }