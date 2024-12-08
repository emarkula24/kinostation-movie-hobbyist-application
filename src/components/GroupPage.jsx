import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./GroupPage.css";

function GroupPage() {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState(null);
    const [groupMovies, setGroupMovies] = useState(null);
    const [movies , setMovies] = useState([]);

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
                    <button>Join</button>
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
