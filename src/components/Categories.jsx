import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Categories.css';
import { useNavigate } from 'react-router-dom';

function Categories({ setSelectedMovie }) {
  
  const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      const response = await axios.get(`${BASE_URL}/trending/movie/week`, { params: { api_key: TMDB_API_KEY } });
      setTrendingMovies(response.data.results.slice(0, 3));
    };
    const fetchPopular = async () => {
      const response = await axios.get(`${BASE_URL}/movie/popular`, { params: { api_key: TMDB_API_KEY } });
      setPopularMovies(response.data.results.slice(0, 3));
    };
    const fetchTopRated = async () => {
      const response = await axios.get(`${BASE_URL}/movie/top_rated`, { params: { api_key: TMDB_API_KEY } });
      setTopRatedMovies(response.data.results.slice(0, 3));
    };
    fetchTrending();
    fetchPopular();
    fetchTopRated();
  }, [TMDB_API_KEY]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie); // Set selected movie for App
    navigate('/MoviePage'); // Navigate to MoviePage
  };


  const renderMovies = (movies) =>
    movies.map((movie) => (
      <div key={movie.id} className="card" onClick={() => handleMovieClick(movie)}>
        <img
          className="movie-poster"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <p>{movie.title}</p>
      </div>
    ));

  return (
    <div className="category-container">
      <div className="categories">
        <h1>Trending</h1>
        <div className="category">{renderMovies(trendingMovies)}</div>
      </div>
      <div className="categories">
        <h1>Popular</h1>
        <div className="category">{renderMovies(popularMovies)}</div>
      </div>
      <div className="categories">
        <h1>Top Rated</h1>
        <div className="category">{renderMovies(topRatedMovies)}</div>
      </div>
    </div>
  );
}

export default Categories;
