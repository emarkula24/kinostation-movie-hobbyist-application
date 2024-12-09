import Router from "express"
import { getGroups, addGroup, getGroupById, getGroupMovies } from "../controllers/groupController.js";
import { pool } from "../helpers/db.js";
const router = Router()

router.get("/", getGroups)
router.post("/", addGroup)
router.get("/:id", getGroupById);
router.get("/:id/movies", getGroupMovies);


router.get('/group_id/:group_id/members', async (req, res) => {
    const { group_id } = req.params;
    try {
        const membersQuery = await pool.query(
            `SELECT 
                gm.groupmember_id, 
                gm.groupmember_users_id, 
                gm.groupmember_status
             FROM groupmember gm
             INNER JOIN users u ON gm.groupmember_users_id = u.users_id
             WHERE gm.groupmember_group_id = $1`,
            [group_id]
        );

        if (membersQuery.rowCount === 0) {
            return res.status(404).json({ error: 'No members found for this group.' });
        }

        res.status(200).json({
            message: 'Group members retrieved successfully.',
            members: membersQuery.rows,
        });
    } catch (err) {
        console.error('Error fetching group members:', err);
        res.status(500).json({ error: 'Failed to retrieve group members.' });
    }
});

// Create a group and insert the owner as a member
router.post('/creategroup', async (req, res) => {
    const { group_name, group_owner_id, group_introduction } = req.body;

    // Validate input
    if (!group_name || !group_owner_id) {
        return res.status(400).json({ error: 'Group name and owner ID are required' });
    }

    try {
        // 1. Insert the group into the usergroup table with valid group_users_id
        // If group_users_id is not provided, we can set it as the owner initially.
        const groupResult = await pool.query(
            'INSERT INTO usergroup (group_name, group_owner_id, group_introduction) VALUES ($1, $2, $3) RETURNING group_id, group_name, group_owner_id, group_introduction',
            [
                group_name,
                group_owner_id,
                group_introduction || 'No introduction provided' // Default value if introduction is missing
            ]
        );

        const group = groupResult.rows[0];

        // 2. Insert the owner as the first member in the groupmember table (active status)
        const memberResult = await pool.query(
            'INSERT INTO groupmember (groupmember_group_id, groupmember_users_id, groupmember_status) VALUES ($1, $2, $3) RETURNING *',
            [group.group_id, group_owner_id, 'active']
        );

        const member = memberResult.rows[0];

        // 3. Return the group and the first member inserted
        res.status(201).json({
            message: 'Group created and owner added as member successfully.',
            group: group,
            member: member
        });
    } catch (err) {
        console.error('Error creating group and adding member:', err);

        // Handle specific error codes (like foreign key violations)
        if (err.code === '23503') {
            res.status(400).json({ error: 'Invalid ownerId or userId. Ensure they exist.' });
        } else {
            res.status(500).json({ error: 'Failed to create group and add member.' });
        }
    }
});


export default router