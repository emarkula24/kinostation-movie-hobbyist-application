import React, { useEffect, useState } from 'react';
import './Header.css';
import { FaUserLarge } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import axios from "axios";
import { BiSolidCoffee } from 'react-icons/bi';
import XMLParser from 'react-xml-parser';

function Header() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showtimes, setShowtimes] = useState(new Set());
    const [isTyping, setIsTyping] = useState(false);

    const TMDB_URL = process.env.REACT_APP_TMDB_API_MOVIES_URL;
    const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

    // Function to fetch and parse showtimes from Finnkino
    const fetchShowtimes = async () => {
        try {
            const response = await axios.get("https://www.finnkino.fi/xml/Schedule");
            const xml = new XMLParser().parseFromString(response.data);
            const showtimeMovies = xml.getElementsByTagName('Title').map(node => node.value);
            setShowtimes(new Set(showtimeMovies));
        } catch (error) {
            console.error("Error fetching showtimes:", error);
        }
    };

    useEffect(() => {
        fetchShowtimes();
    }, []);

    useEffect(() => {
        if (query.length === 0) {
            setResults([]);
            setIsTyping(false); 
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            if (query) {
                // Fetch movies from TMDB
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
                        console.error('Error fetching movies:', error);
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
            <div className='left-header'>
                <div className='logo' onClick={(e) => 
                    {e.preventDefault();
                    window.location.href = '/';}
                }>
                    <BiSolidCoffee className='logoIcon'/>
                    <h1>Movie App</h1>
                </div>
                <nav>
                    <ul>
                        <li>Favorites</li>
                        <li>Community</li>
                        <li>Trending</li>
                        <li>Showtimes</li>
                    </ul>
                </nav>
            </div>

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
                        <p>
                            {movie.title} {showtimes.has(movie.title) && <span className='showtime'>(Showtime)</span>}
                        </p>
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
