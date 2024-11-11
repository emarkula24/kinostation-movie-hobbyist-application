import React, { useEffect, useState } from 'react';
import './Header.css';
import { FaUserLarge } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import axios from "axios";



function Header() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const TMDB_URL = process.env.REACT_APP_TMDB_API_MOVIES_URL;
    const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

    useEffect(() => {
        if (query.length === 0) {
            setResults([]);
            setIsTyping(false); 
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            if (query) {
                // Fetch movies directly in useEffect
                const fetchMovies = async () => {
                    try {
                        const response = await axios.get(TMDB_URL, {
                            params: {
                                api_key: TMDB_API_KEY,
                                query,
                            },
                        });
                        setResults(response.data.results);
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                };
                fetchMovies();
            }
            setIsTyping(false);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query, TMDB_URL, TMDB_API_KEY]);

        const handleInputChange = (event) => {
            setQuery(event.target.value);
            setIsTyping(true);
        };

    return (
        <div className='header'>
            <nav>
                <ul>
                    <li>Movies</li>
                    <li>Series</li>
                    <li>Documentaries</li>
                    <li>More</li>
                </ul>
            </nav>

            <div className='search'>
                <div className='input-container'>
                    <FaSearch className="searchIcon" />
                    <input
                        type='text'
                        placeholder='Search for a movie, tv show, person...'
                        value={query}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className='search-results'>
                {isTyping && query && <p>Searching...</p>}
                {results.map((movie) => (
                    <div key={movie.id} className='movie-item'>
                        <p>{movie.title}</p>
                    </div>
                ))}
            </div>

            <div className='profile'>
                <IoMdNotificationsOutline className='notifIcon'/>
                <FaUserLarge className='userIcon'/>
                <span>Profile</span>
            </div>
        </div>
    );
}

export default Header;
