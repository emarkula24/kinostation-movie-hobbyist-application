import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); 

  // localStorage.removeItem("handledNotifications");

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchNotifications(userData.users_id);
    }
  }, []);

  const fetchNotifications = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/notification/users/${userId}`);
      if (response.status === 200) {

        const handledNotifications = JSON.parse(localStorage.getItem("handledNotifications")) || [];
        
        const newNotifications = response.data.filter(
          (notif) => !handledNotifications.includes(notif.notification_id)
        );
        
        setNotifications(newNotifications);
      } else {
        setError("Failed to fetch notifications");
      }
    } catch (error) {
      setError("Error fetching notifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (groupId, groupmemberId, action, notificationId) => {
    if (!user) return;
    const groupmemberStatus = action === "accept" ? "active" : "inactive";

    try {
      const response = await axios.put(
        `http://localhost:3001/notification/group_id/${groupId}/requests/${groupmemberId}`,
        {
          groupmember_status: groupmemberStatus,
          users_id: user.users_id, 
        }
      );

      if (response.status === 200) {
        setSuccessMessage(`Request ${action}ed successfully!`);

        setNotifications((prev) =>
          prev.filter((notif) => notif.notification_id !== notificationId)
        );

        const handledNotifications = JSON.parse(localStorage.getItem("handledNotifications")) || [];
        handledNotifications.push(notificationId);
        localStorage.setItem("handledNotifications", JSON.stringify(handledNotifications));

        setTimeout(() => {
          setSuccessMessage("");
        }, 2000); 
      }
    } catch (err) {
      console.error(`Failed to ${action} request:`, err.message);
    }
  };

  const extractEmail = (message) => {
    const emailMatch = message.match(/^(.*?)\n/);
    return emailMatch ? emailMatch[1] : "Unknown Email";
  };

  const extractMessage = (message) => {
    const match = message.match(/has requested to join your group.*$/);
    return match ? match[0] : message;
  };

  return (
    <div className="notifications-page-container">
      <div className="notifications-container">
        <h1>Notifications</h1>
        <div className="notifications-card-container">
          {loading ? (
            <p>Loading notifications...</p>
          ) : error ? (
            <p>{error}</p>
          ) : notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((notif) => {
              const userEmail = extractEmail(notif.notification_message);
              const messageContent = extractMessage(notif.notification_message);

              return (
                <div className="notifications-card" key={notif.notification_id}>
                  <p className="notifications-user">{userEmail}</p>
                  <p className="notifications-message">{messageContent}</p>
                  <div className="notifications-button-group">
                    <button
                      onClick={() =>
                        handleAction(notif.notification_group_id, notif.notification_groupmember_id, "accept", notif.notification_id)
                      }
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleAction(notif.notification_group_id, notif.notification_groupmember_id, "reject", notif.notification_id)
                      }
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
