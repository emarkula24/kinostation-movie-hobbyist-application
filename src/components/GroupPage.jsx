import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import "./GroupPage.css";
import { FaUserNinja } from "react-icons/fa"; 

function GroupPage() {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [groupMovies, setGroupMovies] = useState(null);
    const [movies , setMovies] = useState([]);
    const [joinStatus, setJoinStatus] = useState(""); // State for feedback messages
    const [user, setUser] = useState(null); // State to hold user data
    const navigate = useNavigate();
   

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
            } catch (error) {
                console.error("Error fetching group members:", error);
            }
        };

        if (groupId) {
            fetchMembers();
        }
    }, [groupId]);

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
            setJoinStatus("Join request sent successfully.");
        } catch (error) {
            console.error("Error joining group:", error);
            setJoinStatus(error.response?.data?.error || "Failed to join group.");
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
            // Update members list after removal
            setMembers(members.filter(member => member.groupmember_users_id !== memberId));
        } catch (error) {
            console.error("Error removing member:", error);
            alert(error.response?.data?.error || "Failed to remove member.");
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
                     {user && user.users_id === group.group_owner_id && (
                        <button onClick={handleDeleteGroup} className="delete-button">
                            Delete Group
                        </button>
                    )}

                    <button onClick={handleJoinGroup}>Join</button>
                    {joinStatus && <p className="join-status">{joinStatus}</p>}

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
            </div>
 
                <div className="group-members">
                    <h2>Group Members</h2>
                        <ul>
                            {members.map((member) => (
                                <li key={member.groupmember_id}>
                                    <p>
                                        <FaUserNinja className='userIcon'/>
                                        ID: {member.groupmember_users_id}, Status: {member.groupmember_status}
                                       {/* Only show the remove button if the member is not the group owner */}
                            {member.groupmember_users_id !== group.group_owner_id && (
                                <button onClick={() => handleRemoveMember(member.groupmember_users_id)}>
                                    Remove
                                </button>
                            )}
                                    </p>
                                </li>
                            ))}
                        </ul>
                </div> 

          

            {/* commented this to compare when it was hardcoded */}
                        {/* <div className='group-movie'> commented this to  */ } 
{/* //                         <div className='movie-title'> 
//                             <h2>Movie Title</h2>
//                             <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero architecto, iste quisquam non cumque iure alias nemo voluptas culpa eum delectus quibusdam dolor dicta esse quod nulla totam provident impedit.</p>
//                             <div className='group-reviews'>
//                                 <div className='review-item'>
//                                     <FiPlus className='addIcon'/>
//                                     <p>Lorem ipsum dolor sit amet consectetur ad tur adipisicing elit. </p>
//                                 </div>
//                                 <div className='review-item'>
//                                     <FiPlus className='addIcon'/>
//                                     <p>Lorem ipsum dolor sit amet consectetur ad tur adipisicing elit. </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div> */}

                    {/* <div className='group-members'>
                                    <h2>Members</h2>
                                    <ul>
                                        <li>
                                            <FaUserNinja className='userIcon'/>
                                            Member 1
                                        </li>
                                        <li>
                                            <FaUserNinja className='userIcon'/>
                                            Member 2
                                        </li>
                                        <li>
                                            <FaUserNinja className='userIcon'/>
                                            Member 4
                                        </li>
                                        <li>
                                            <FaUserNinja className='userIcon'/>
                                            Member 5
                                        </li>
                                    </ul>
                                </div> */}
        </div>
    );
}

export default GroupPage;
