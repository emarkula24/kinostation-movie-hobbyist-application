import React from "react";
import { useNavigate } from "react-router-dom";
import "./GroupLists.scss";

function GroupLists() {
    const navigate = useNavigate();
    const groups = [
        { id: "1", title: "DC Fans Group", message: "BatmanFan sent a message..." },
        { id: "2", title: "Marvel Fans Group", message: "IronManRules sent a message..." },
        { id: "3", title: "Star Wars Fans Group", message: "JediMasterYoda sent a message..." },
    ];

    return (
        <div className="group-list-item">
            <div className="title">
                <h1>Groups</h1>
                <div className='creategroup-button' onClick={() => {
                const user = sessionStorage.getItem('user'); 
                if (user) {
                    navigate('/CreateGroup'); 
                } else {
                    navigate('/login'); 
                }
            }} >Create a new group!<div/>
            </div>
            </div>
            <div className="group-list-grid">
                {groups.map((group) => (
                    <div
                        key={group.id}
                        className="groupList-card"
                        onClick={() => navigate(`/group/${group.id}`)} // Navigate to the specific group page
                    >
                        <div className="groupList-card-title">
                            <h3>{group.title}</h3>
                        </div>
                        <div className="subcription">
                            <p>{group.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GroupLists;
