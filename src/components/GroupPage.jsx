import React from 'react'
import './GroupPage.css'
import { FiPlus } from "react-icons/fi";
import { FaUserNinja } from "react-icons/fa";
import { useParams } from "react-router-dom";


function GroupPage() {

    const { groupId } = useParams(); // Get the groupId from the route params

    // Mock group data for now, fetch from the backend later
    const groups = [
        {
            id: "1",
            title: "DC Fans Group",
            description: "A group for all DC comics and movies fans!",
            createdBy: "BatmanFan",
        },
        {
            id: "2",
            title: "Marvel Fans Group",
            description: "For those who love the Marvel Universe.",
            createdBy: "IronManRules",
        },
        {
            id: "3",
            title: "Star Wars Fans Group",
            description: "May the force be with you, always!",
            createdBy: "JediMasterYoda",
        },
    ];

    const group = groups.find((group) => group.id === groupId);

    if (!group) {
        return <h1>Group not found</h1>;
    }

  return (
    <div className='group-container'>

        <div className='group-card'>
            <div className='group-info'>
                <h1>{group.title}</h1>
                <p>{group.description}</p>
            </div>

                <div className='group-details'>
                    <p>Created by: <span>{group.createdBy}</span></p>
                    <button>join</button>
                </div> 
            
            
        </div>
        

        <div className='group-content'>
            <div className='group-movies'>

                    <div className='group-movie'>
                        <img 
                        src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/m5x8D0bZ3eKqIVWZ5y7TnZ2oTVg.jpg" 
                        alt="movie poster" />
                        <div className='movie-title'>
                            <h2>Movie Title</h2>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero architecto, iste quisquam non cumque iure alias nemo voluptas culpa eum delectus quibusdam dolor dicta esse quod nulla totam provident impedit.</p>
                            <div className='group-reviews'>
                                <div className='review-item'>
                                    <FiPlus className='addIcon'/>
                                    <p>Lorem ipsum dolor sit amet consectetur ad tur adipisicing elit. </p>
                                </div>
                                <div className='review-item'>
                                    <FiPlus className='addIcon'/>
                                    <p>Lorem ipsum dolor sit amet consectetur ad tur adipisicing elit. </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='group-movie'>
                        <img 
                        src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/m5x8D0bZ3eKqIVWZ5y7TnZ2oTVg.jpg" 
                        alt="movie poster" />
                        <div className='movie-title'>
                            <h2>Movie Title</h2>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero architecto, iste quisquam non cumque iure alias nemo voluptas culpa eum delectus quibusdam dolor dicta esse quod nulla totam provident impedit.</p>
                            <div className='group-reviews'>
                                <div className='review-item'>
                                    <FiPlus className='addIcon'/>
                                    <p>Lorem ipsum dolor sit amet consectetur ad tur adipisicing elit. </p>
                                </div>
                                <div className='review-item'>
                                    <FiPlus className='addIcon'/>
                                    <p>Lorem ipsum dolor sit amet consectetur ad tur adipisicing elit. </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='group-movie'>
                        <img 
                        src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/m5x8D0bZ3eKqIVWZ5y7TnZ2oTVg.jpg" 
                        alt="movie poster" />
                        <div className='movie-title'>
                            <h2>Movie Title</h2>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero architecto, iste quisquam non cumque iure alias nemo voluptas culpa eum delectus quibusdam dolor dicta esse quod nulla totam provident impedit.</p>
                            <div className='group-reviews'>
                                <div className='review-item'>
                                    <FiPlus className='addIcon'/>
                                    <p>Lorem ipsum dolor sit amet consectetur ad tur adipisicing elit. </p>
                                </div>
                                <div className='review-item'>
                                    <FiPlus className='addIcon'/>
                                    <p>Lorem ipsum dolor sit amet consectetur ad tur adipisicing elit. </p>
                                </div>
                            </div>
                        </div>
                    </div>
                
            </div>

            <div className='group-members'>
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
            </div>
        </div>
        
    </div>
  )
}

export default GroupPage