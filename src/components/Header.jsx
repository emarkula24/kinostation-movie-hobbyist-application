import React, { useEffect, useState } from 'react';
import './Header.css';
import { FaUserLarge } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import axios from "axios";
import { BiSolidCoffee } from 'react-icons/bi';
import XMLParser from 'react-xml-parser';
import { useNavigate } from 'react-router-dom';
import { FaBars } from "react-icons/fa";


function Header( { setSelectedMovie }) {

    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showtimes, setShowtimes] = useState(new Set());
    const [isTyping, setIsTyping] = useState(false);

    const [burgerMenuIsOpen, setBurgerMenuIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleBurgerMenu = () => {
        setBurgerMenuIsOpen(!burgerMenuIsOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const TMDB_URL = process.env.REACT_APP_TMDB_API_MOVIES_URL;
    const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie); // Set the selected movie in the parent state
        navigate('/MoviePage');  // Navigate to the MoviePage route
        setQuery('');
    };

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
                        <li onClick={
                            (e) => {
                                e.preventDefault();
                                window.location.href = '/Showtimes';
                            }
                        }>Showtimes</li>
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
                    <div 
                    key={movie.id} 
                    className='movie-item'
                    onClick={() => handleMovieClick(movie)}
                    >
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
            <div className="burger-Icon" onClick={toggleBurgerMenu}>
                <FaBars className='barIcon'/>
            </div>

            {burgerMenuIsOpen && (
                <div className="burger-menu">
                    <div className='burger-items'>
                        <ul>
                            <li>Favorites</li>
                            <li>Community</li>
                            <li>Trending</li>
                            <li onClick={
                                (e) => {
                                    e.preventDefault();
                                    window.location.href = '/Showtimes';
                                }
                            }>Showtimes</li>
                        </ul>
                    </div>
                    
                </div>
            )}
        </div>
    );
}

export default Header;
