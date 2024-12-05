import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateGroup.css";
import axios from "axios";

function CreateGroup() {
  const url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const nameRef = useRef();
  const introductionRef = useRef();

  const [feedback, setFeedback] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    } else {
      navigate("/login"); 
    }
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const name = nameRef.current.value;
    const introduction = introductionRef.current.value;

    if (!user) {
      setFeedback("You must be logged in to create a group.");
      return;
    }

    console.log("Submitting group with data:", {
      name,
      users_id: user.users_id, 
      owner_id: user.users_id, 
      introduction
    });

    try {
      const response = await axios.post(url + "/notification/group", {
        group_name: name,           
        group_users_id: user.users_id,
        group_owner_id: user.users_id,
        group_introduction: introduction
      });


      console.log("Group created successfully:", response.data);

      setFeedback("Group created successfully!");

        // Clear the form
      nameRef.current.value = "";
      introductionRef.current.value = "";
    } catch (error) {
      console.error("Error creating group:", error);

      setFeedback(
        error.response?.data?.error || "Failed to create group. Try again later."
      );
    }
  };

  return (
    <div className="create-group-container">
      <h1>Create a new group</h1>
      <form className="create-group-form" onSubmit={handleSubmit}>
        <div>
          <label>Group Name</label>
          <input type="text" name="name" ref={nameRef} required />
        </div>
        <div>
          <label>Group Introduction</label>
          <input type="text" name="introduction" ref={introductionRef} required />
        </div>
        <button type="submit">Submit</button>
      </form>
      {/* Display feedback */}
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
}

export default CreateGroup;
