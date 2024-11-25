import React from "react";
import "./GroupLists.scss";

function GroupLists() {
    const groups = [
        { title: "DC Fans Group", message: "BatmanFan sent a message..." },
        { title: "Marvel Fans Group", message: "IronManRules sent a message..." },
        { title: "Star Wars Fans Group", message: "JediMasterYoda sent a message..." },
    ];

    return (
        <div className="group-list-item">
            <div className="title">
                <h1>Groups</h1>
            </div>
            <div className="group-list-grid">
                {groups.map((group, index) => (
                    <div key={index} className="groupList-card">
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
