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
router.post('/group_id/:group_id/join', async (req, res) => {
    const { group_id } = req.params;  
    const { users_id } = req.body;  

    // Validate input
    if (!group_id || !users_id) {
        return res.status(400).json({ error: 'Group ID and User ID are required.' });
    }

    try {
        // Check if the group exists and retrieve group details
        const groupCheck = await pool.query(
            'SELECT group_name, group_owner_id FROM usergroup WHERE group_id = $1',
            [group_id]
        );
        if (groupCheck.rowCount === 0) {
            return res.status(404).json({ error: 'Group not found.' });
        }
        const { group_name, group_owner_id } = groupCheck.rows[0];

        // Check if the user exists
        const userCheck = await pool.query(
            'SELECT users_email FROM users WHERE users_id = $1',
            [users_id]
        );
        if (userCheck.rowCount === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const { users_email } = userCheck.rows[0];

        // Check if the user is already a member or has a pending request
        const membershipCheck = await pool.query(
            'SELECT groupmember_status FROM groupmember WHERE groupmember_group_id = $1 AND groupmember_users_id = $2',
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

    console.log('Groupmember Inserted:', request.rows);

    // Ensure groupmember_id is retrieved from the previous insert
    const groupmember_id = request.rows[0]?.groupmember_id;  

    if (!groupmember_id) {
        return res.status(500).json({ error: 'Failed to retrieve groupmember_id from insertion.' });
    }

    // Create a notification for the group owner
    const notificationMessage = `${users_email} ("userid:"${users_id}) has requested to join your group "${group_name}".`;

    const notification = await pool.query(
        'INSERT INTO notification (notification_users_id, notification_group_id, notification_message, notification_type, notification_req_users_id, notification_groupmember_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [group_owner_id, group_id, notificationMessage, 'invitation', users_id, groupmember_id]
    );

    res.status(201).json({
        message: 'Join request created successfully. Notification sent to the group owner.',
        request: request.rows[0],
        notification: notification.rows[0],
        users: {
            email: users_email,
            id: users_id
        },
        group: {
            name: group_name,
            id: group_id,
            owner_id: group_owner_id
        }
    });


    } catch (err) {
        console.error('Error processing join request:', err);
        res.status(500).json({ error: 'Failed to process join request.' });
    }
});


// Dealing with request (Accept or Reject)
router.put('/group_id/:group_id/requests/:groupmember_id', async (req, res) => {
    const { group_id, groupmember_id } = req.params;  // Extract group_id and groupmember_id from URL
    const { groupmember_status, users_id } = req.body;  // Extract status and user_id (who is performing the action)

    // Validate input
    if (!groupmember_status || !users_id) {
        return res.status(400).json({ error: 'groupmember_status and users_id are required.' });
    }

    try {
        // Check if the group exists
        const groupCheck = await pool.query('SELECT * FROM usergroup WHERE group_id = $1', [group_id]);
        if (groupCheck.rowCount === 0) {
            return res.status(404).json({ error: 'Group not found.' });
        }

        const group = groupCheck.rows[0];

        // Check if the user performing the action is the group owner
        if (group.group_owner_id !== parseInt(users_id)) {
            return res.status(403).json({ error: 'Only the group owner can accept or reject requests.' });
        }

        // Check if the join request exists
        const requestCheck = await pool.query(
            'SELECT * FROM groupmember WHERE groupmember_group_id = $1 AND groupmember_id = $2',
            [group_id, groupmember_id] // Use group_id and groupmember_id in the query
        );
        if (requestCheck.rowCount === 0) {
            return res.status(404).json({ error: 'Join request not found.' });
        }

        // Check if the status is valid (active, inactive, pending)
        if (!['active', 'inactive'].includes(groupmember_status)) {
            return res.status(400).json({ error: 'Invalid status. Must be "active" (accepted) or "inactive" (rejected).' });
        }

        // Determine the notification type based on the action
        let notificationType;
        if (groupmember_status === 'active') {
            notificationType = 'status_change';  // Accepted -> 'status_change'
        } else if (groupmember_status === 'inactive') {
            notificationType = 'status_change'; // Rejected -> 'status_change'
        } else {
            return res.status(400).json({ error: 'Invalid groupmember_status.' });
        }

        // Update the request status
        const updatedRequest = await pool.query(
            'UPDATE groupmember SET groupmember_status = $1 WHERE groupmember_group_id = $2 AND groupmember_id = $3 RETURNING *',
            [groupmember_status, group_id, groupmember_id] // Corrected groupmember_group_id and groupmember_id
        );

        // Notify the user who requested to join the group
        await pool.query(
            'INSERT INTO notification (notification_users_id, notification_message, notification_type, created_at) VALUES ($1, $2, $3, NOW())',
            [
                requestCheck.rows[0].groupmember_users_id,  // The user ID who made the request
                `Your request to join the group "${group.group_name}" has been ${groupmember_status}.`,
                notificationType,  // Use the appropriate notification type
            ]
        );

        // Send success response
        res.status(200).json({
            message: `Request ${groupmember_status} successfully.`,
            request: updatedRequest.rows[0]
        });
    } catch (err) {
        console.error('Error updating join request:', err.message); // Log the error message for debugging
        res.status(500).json({ error: 'Failed to update request', details: err.message });
    }
});



// Get notifications for a specific user
router.get('/users/:users_id', async (req, res) => {
    const { users_id } = req.params;  // Extract userId from URL parameter
    try {
        // Fetch notifications for the given user, ordered by creation date
        const notifications = await pool.query(
            'SELECT * FROM notification WHERE notification_users_id = $1 ORDER BY created_at DESC',
            [users_id]  // Use notification_users_id to filter notifications for the specific user
        );
        res.status(200).json(notifications.rows);  // Return notifications in the response
    } catch (err) {
        // Handle any errors and send a 500 status with error details
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

export default router;
