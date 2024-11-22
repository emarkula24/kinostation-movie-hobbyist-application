import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserPage.css';

function UserPage({setSelectedMovie}) {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            fetchFavorites(userData.users_id);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchFavorites = async (userId) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3001/userpage/?users_id=${userId}`);
            const favoriteMovies = Array.isArray(response.data) ? response.data : [response.data];
    
            const movieDetailsPromises = favoriteMovies.map(favorite =>
                axios.get(`https://api.themoviedb.org/3/movie/${favorite.movie_id}`, {
                    params: { api_key: TMDB_API_KEY }
                })
            );
    
            const movieDetailsResponses = await Promise.all(movieDetailsPromises);
            const movieDetails = movieDetailsResponses.map(response => response.data);
    
            const updatedFavorites = favoriteMovies.map((favorite, index) => ({
                ...favorite,
                title: movieDetails[index].title,
                overview: movieDetails[index].overview,
                poster_path: movieDetails[index].poster_path,
                vote_average: movieDetails[index].vote_average, 
                release_date: movieDetails[index].release_date 
            }));
    
            setFavorites(updatedFavorites);
            setLoading(false);
        } catch (error) {
            setError('Error fetching favorites. Please try again later.');
            setLoading(false);
            console.error('Error fetching favorites:', error);
        }
    };

    const handleMovieClick = (favorite) => {
        setSelectedMovie(favorite);
        navigate('/MoviePage');
      };
    

    return (
        <div className="user-page">
            {user ? (
                <div className='user-display'>
                    <div className='user-avatar'>
                    <h1>User Profile</h1>
                    <button className='logout-button'>Logout</button>
                    </div>
                    <p>Email: {user.users_email}</p>
                    <p>User ID: {user.users_id.toString().padStart(6, '0')}</p>
                    <button className='remove-button'>Delete account</button>

                    <h2>Favorite List</h2>
                    {loading ? (
                        <p>Loading favorites...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : favorites.length > 0 ? (
                        <div className="favorite-list">
                            {favorites.map((favorite, index) => (
                                <div key={index} className="favorite-card" onClick={() => handleMovieClick(favorite)}>
                                    {favorite.poster_path && (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${favorite.poster_path}`}
                                            alt={favorite.title}
                                            className="movie-poster"
                                        />
                                    )}
                                    <div className="favorite-card-content">
                                        <h3>{favorite.title}</h3>
                                        {/* <p>{favorite.overview}</p> */}
                                        <p>Rating: {favorite.vote_average ? favorite.vote_average.toFixed(1) : "N/A"}</p>
                                        <p>Release Date: {favorite.release_date || "Unknown"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No favorites added yet.</p>
                    )}
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
}

export default UserPage;
