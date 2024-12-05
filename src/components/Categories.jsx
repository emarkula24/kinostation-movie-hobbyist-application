import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Categories.scss";
import { useNavigate } from "react-router-dom";

function Categories({ setSelectedMovie }) {
  const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const BASE_URL = process.env.REACT_APP_API_URL + "/movie";
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [visibleRange, setVisibleRange] = useState({ startIndex: 0, endIndex: 5 }); // Track visible range
  const navigate = useNavigate();

  // Fetch movie data
  useEffect(() => {
    const fetchMovies = async () => {
      try {

        const trendingResponse = await axios.get("/trending")
        const popularResponse = await axios.get(BASE_URL + "/popular")
        const topRatedResponse = await axios.get(BASE_URL + "/toprated")

        console.log('trendingResponse', trendingResponse.data)
        setTrendingMovies(trendingResponse.data.slice(0, 20));
        setPopularMovies(popularResponse.data.slice(0, 20)); 
        setTopRatedMovies(topRatedResponse.data.slice(0, 20)); 
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovies();
  }, [TMDB_API_KEY]);

  // Handle movie card click
  // const handleMovieClick = (movie) => {
  //   setSelectedMovie(movie);
  //   navigate("/MoviePage");
  // };
  const handleMovieClick = (movie) => {
    navigate(`/MoviePage/${movie.id}`);
  };
  

  // Scroll functionality for moving horizontally
  const scrollRow = (direction, category) => {
    // Adjust the visible range based on the direction of scroll
    const totalMovies = category === "trending" ? trendingMovies : category === "popular" ? popularMovies : topRatedMovies;
    let { startIndex, endIndex } = visibleRange;

    if (direction === "next" && endIndex < totalMovies.length) {
      setVisibleRange({ startIndex: startIndex + 5, endIndex: endIndex + 5 });
    } else if (direction === "back" && startIndex > 0) {
      setVisibleRange({ startIndex: startIndex - 5, endIndex: endIndex - 5 });
    }
  };

  // Render movie cards for each category
  const renderMovies = (movies) => {
    const { startIndex, endIndex } = visibleRange;
    return movies.slice(startIndex, endIndex).map((movie) => (
      <div
        key={movie.id}
        className="MovieCard"
        onClick={() => handleMovieClick(movie)}
      >
        <div className="MovieCard_logo">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
          {/* <div
            className="MovieCard_favoriteBtn"
            onClick={(e) => {
              e.stopPropagation();
              alert("Favorite button clicked!");
            }}
          >
            <i className="fas fa-heart"></i>
          </div>
          <div
            className="MovieCard_sendtogroupBtn"
            onClick={(e) => {
              e.stopPropagation();
              alert("Send to group button clicked!");
            }}
          >
            <i className="fa-solid fa-star"></i>
          </div> */}
        </div>
        <div className="MovieCard_title">
          <h3>{movie.title}</h3>
          <p>Release date: {movie.release_date}</p>
        </div>
      </div>
    ));
  };

  // Categories data to display
  const categoriesData = [
    { title: "Trending", movies: trendingMovies },
    { title: "Popular", movies: popularMovies },
    { title: "Top Rated", movies: topRatedMovies },
  ];

  return (
    <div className="category-container">
      {categoriesData.map((category, index) => {
        return (
          <div className="categories" key={index}>
            <h1>{category.title}</h1>
            <div className="scroll-container">
              <button
                className="scroll-btn back"
                onClick={() => scrollRow("back", category.title.toLowerCase())}
              >
                &lt;
              </button>
              <div className="category">
                {renderMovies(category.movies)}
              </div>
              <button
                className="scroll-btn next"
                onClick={() => scrollRow("next", category.title.toLowerCase())}
              >
                &gt;
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Categories;
