import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserPage.css';

function UserPage() {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Parse user data
            fetchFavorites(JSON.parse(storedUser).users_id);
        } else {
            navigate('/login'); // Redirect to login if not logged in
        }
    }, [navigate]);
    
    const fetchFavorites = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:3001/userpage/?users_id=${userId}`);
            setFavorites(Array.isArray(response.data) ? response.data : [response.data]); // Ensure data is an array
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    return (
        <div className="user-page">
            {user ? (
                <div>
                    <h1>User Profile</h1>
                    <p><strong>Email:</strong> {user.users_email}</p>
                    <p><strong>User ID:</strong> {user.users_id}</p>

                    <h2>Favorite List</h2>
                    {favorites.length > 0 ? (
                        <ul className="favorite-list">
                            {favorites.map((favorite) => (
                                <li key={favorite.movie_id} className="favorite-item">
                                    {favorite.movie_id}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No favorites added yet.</p>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default UserPage;
