import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import "./GroupPage.css";
import { FaUserNinja } from "react-icons/fa"; 
import toast from 'react-hot-toast';


function GroupPage() {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [groupMovies, setGroupMovies] = useState(null);
    const [movies , setMovies] = useState([]);
    const [user, setUser] = useState(null); // State to hold user data
    const navigate = useNavigate();
    const [isMember, setIsMember] = useState(false); // Track if the user is a member


    useEffect(() => {
        console.log("Fetching group with ID:", groupId); // Debug log

        const fetchGroup = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/groups/${groupId}`
                );
                console.log("Fetched group data:", response.data); // Debug log
                setGroup(response.data);
            } catch (error) {
                console.error("Error fetching group:", error);
            }
        };
        fetchGroup();
    }, [groupId]);

      // Fetch group members
      useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/groups/group_id/${groupId}/members`
                );
                setMembers(response.data.members); // Assuming the response contains a `members` array
                console.log("Fetched group members:", response.data.members);

                  // Check if the current user is in the members list
                  if (user) {
                    const isUserMember = response.data.members.some(
                        (member) => member.groupmember_users_id === user.users_id
                    );
                    setIsMember(isUserMember);
                }
            } catch (error) {
                console.error("Error fetching group details:", error);
            }
        };

        

        if (groupId) {
            fetchMembers();
        }
    }, [groupId, user]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/groups/${groupId}/movies`
                );
                setMovies(response.data); // Assuming the response is an array
                console.log("Fetched movies:", response.data);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };
        fetchMovies();
    }, [groupId]);


    useEffect(() => {
        // Retrieve user data from sessionStorage
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData); // Set user data
        }
    }, []);

    const handleJoinGroup = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/notification/group_id/${groupId}/join`,
                { users_id: user.users_id }
            );
            console.log("Join response:", response.data);
            toast.success("Join request sent successfully.");
        } catch (error) {
            console.error("Error joining group:", error);
            toast.error(error.response?.data?.error || "Failed to join group.");
        }
    };

    const handleLeaveGroup = async () => {
        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_API_URL}/groups/leave/${groupId}/member/${user.users_id}`
            );
            toast.success("You have successfully left the group.");
            setIsMember(false);
             // Re-fetch the group data, members, and movies after leaving
        setGroup(null); // Trigger re-fetch of the group
        setMembers([]); // Clear the members list temporarily to trigger the refet
        navigate('/'); // This will redirect to the homepage
        } catch (error) {
            console.error("Error leaving group:", error);
            toast.error(error.response?.data?.error || "Failed to leave group.");
        }
    };

    // Function to handle group deletion
    const handleDeleteGroup = async () => {
        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_API_URL}/groups/${groupId}`,
                { data: { user_id: user.users_id } }  // Send user_id to verify authorization
            );
            console.log("Group deleted:", response.data);
             // Show success alert
        alert("Group deleted successfully!");
            // Redirect to homepage after successful deletion
            navigate('/');  // This will redirect to the homepage
        } catch (error) {
            console.error("Error deleting group:", error);
            alert(error.response?.data?.error || "Failed to delete group.");
        }
    };

     // Function to handle removing a member from the group
     const handleRemoveMember = async (memberId) => {
        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_API_URL}/groups/${groupId}/member/${memberId}`,
                { data: { user_id: user.users_id } }  // Send user_id to verify authorization
            );
            console.log("Member removed:", response.data);
            toast.success("Member removed successfully.");
            // Update members list after removal
            setMembers(members.filter(member => member.groupmember_users_id !== memberId));
        } catch (error) {
            console.error("Error removing member:", error);
            toast.error(error.response?.data?.error || "Failed to remove member.");
        }
    };


    if (!group) {
        return <h1>Loading group details...</h1>;
    }


    return (
        <div className="group-container">
            <div className="group-card">
                <div className="group-info">
                    <h1>{group.group_name}</h1>
                    <p>{group.group_introduction}</p>
                </div>
                <div className="group-details">
                    <p>
                        Created by: <span>{group.group_owner_email.split('@')[0]}</span> 
                    </p>
                     {/* Show the Delete button only if the user is the owner */}
                     <div className="group-btns"> 
                     {user && user.users_id === group.group_owner_id && (
                        
                        <button onClick={handleDeleteGroup} className="delete-button">
                            Delete Group
                        </button>
                    )}
                    {/* {user && user.users_id === group.group_owner_id ? (
                        <p>You are the group owner.</p>
                    ) : ( */}
                    
                        {user && (
                        isMember ? (
                            
                            <button onClick={handleLeaveGroup} className="leave-button">
                                Leave Group
                            </button>
                            
                        ) : (

                            <button onClick={handleJoinGroup} className="join-button">
                                Join Group
                            </button>

                        )
                    )}
                    </div>
                </div>
                <div>
                    
                </div>
            </div>

            <div className="group-content">
                <div className="group-movies">
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <div className="group-movie" key={movie.groupmovie_id}>
                            <img src={movie.movie_image} alt={movie.movie_title} />
                            <div className="movie-title">
                                <h2>{movie.movie_title}</h2>
                                {/* <p>{movie.movie_description}</p> */}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No movies available for this group.</p>
                )}
                </div>

                <div className="group-members">
                    <h2>Group Members</h2>
                        <ul>
                            {members.map((member) => (
                                <li key={member.groupmember_id}>

                                        <FaUserNinja className='userIcon'/>
                                        ID: {member.groupmember_users_id}, Status: {member.groupmember_status}
                                        {/* Only show the remove button if the user is the group owner */}
                                {user && user.users_id === group.group_owner_id && member.groupmember_users_id !== group.group_owner_id && (
                                    <button className="delete-button" onClick={() => handleRemoveMember(member.groupmember_users_id)}>
                                        Remove
                                    </button>
                                )}

                                </li>
                            ))}
                        </ul>
                </div> 
            </div>
 
                

          
        </div>
    );
}

export default GroupPage;
