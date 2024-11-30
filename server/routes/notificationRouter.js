import { Router } from "express";
import { pool } from "../helpers/db.js";


const router = Router(); 
// Create a group and insert the owner as a member
router.post('/group', async (req, res) => {
    const { group_name, group_users_id, group_owner_id } = req.body;

    // Validate input
    if (!group_name || !group_owner_id) {
        return res.status(400).json({ error: 'Group name and owner ID are required' });
    }

    try {
        // 1. Insert the group into the usergroup table
        const groupResult = await pool.query(
            'INSERT INTO usergroup (group_name, group_users_id, group_owner_id) VALUES ($1, $2, $3) RETURNING group_id, group_name, group_owner_id',
            [group_name, group_users_id || null, group_owner_id]
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
        if (err.code === '23503') {
            res.status(400).json({ error: 'Invalid ownerId or userId. Ensure they exist.' });
        } else {
            res.status(500).json({ error: 'Failed to create group and add member.' });
        }
    }
});

// Request to join a group 
router.post('/group/:group_id/join', async (req, res) => {
    const { group_id } = req.params;  
    const { users_id } = req.body;  

    // Validate input
    if (!group_id || !users_id) {
        return res.status(400).json({ error: 'Group ID and User ID are required.' });
    }

    try {
        // Check if the group exists
        const groupCheck = await pool.query('SELECT * FROM usergroup WHERE group_id = $1', [group_id]);
        if (groupCheck.rowCount === 0) {
            return res.status(404).json({ error: 'Group not found.' });
        }

        // Check if the user exists
        const userCheck = await pool.query('SELECT * FROM users WHERE users_id = $1', [users_id]);
        if (userCheck.rowCount === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Check if the user is already a member or has a pending request
        const membershipCheck = await pool.query(
            'SELECT * FROM groupmember WHERE groupmember_group_id = $1 AND groupmember_users_id = $2',
            [group_id, users_id]
        );

        if (membershipCheck.rowCount > 0) {
            const status = membershipCheck.rows[0].groupmember_status;
            return res.status(400).json({ 
                error: `User already has a ${status} status in this group.` 
            });
        }

        // Create a join request with status "pending"
        const request = await pool.query(
            'INSERT INTO groupmember (groupmember_group_id, groupmember_users_id, groupmember_status) VALUES ($1, $2, $3) RETURNING *',
            [group_id, users_id, 'pending']
        );

        res.status(201).json({
            message: 'Join request created successfully.',
            request: request.rows[0]
        });
    } catch (err) {
        console.error('Error processing join request:', err);
        // Provide detailed error messages
        res.status(500).json({ error: 'Failed to process join request.' });
    }
});



//dealing with request
router.put('/group/:groupId/requests/:requestId', async (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'
    try {
        const updatedRequest = await pool.query(
            'UPDATE group_members SET status = $1 WHERE id = $2 RETURNING *',
            [status, requestId]
        );
        res.status(200).json(updatedRequest.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update request' });
    }
});

//get notification
router.get('/users/:userId/notifications', async (req, res) => {
    const { userId } = req.params;
    try {
        const notifications = await pool.query(
            'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.status(200).json(notifications.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});


export default router;
