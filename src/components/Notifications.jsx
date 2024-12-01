import React, { useState } from "react";
import "./Notifications.css";

const Notifications = () => {
  //fake notifications data
  const [notifications, setNotifications] = useState([
    { notifi_id: 1, user_id:1,user_email: "Alice@123.com", group_id:1, group_name: "DC fans group" },
    { notifi_id: 2, user_id:2,user_email: "Bob@234.com", group_id:2, group_name: "Marvel fans group" },
    { notifi_id: 3, user_id:3,user_email: "Charlie@6543.com", group_id:3, group_name: "Anime fans group" },
  ]);

  const handleAction = (id, action) => {
    alert(`${action} request from user with ID: ${id}`);
    setNotifications(notifications.filter((notif) => notif.notifi_id !== id));
  };

  return (
    <div className="notifications-page-container">
      <div className="notifications-container">
      <h1>Notifications</h1>
      <div className="notifications-card-container">
        {notifications.map((notif) => (
          <div className="notifications-card" key={notif.notifi_id}>
            <p className="notifications-user">
              {notif.user_email}
            </p>
            <p className="notifications-message">
              sent you a request to join "{notif.group_name}"
            </p>
            <div className="notifications-button-group">
              <button onClick={() => handleAction(notif.notifi_id, "Accepted")}>
                Accept
              </button>
              <button onClick={() => handleAction(notif.notifi_id, "Rejected")}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
     </div>
    </div> 
  );
};

export default Notifications;
