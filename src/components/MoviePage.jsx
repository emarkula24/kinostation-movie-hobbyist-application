import React, { useEffect, useState } from 'react';
import './MoviePage.css';
import { MdFavoriteBorder } from 'react-icons/md';
import XMLParser from 'react-xml-parser';

function MoviePage({ movie }) {

  const [activeTab, setActiveTab] = useState("showtimes"); // Initial tab
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movie) return;

    const fetchShowtimes = async () => {
      try {
        const response = await fetch('https://www.finnkino.fi/xml/Schedule/');
        const xmlText = await response.text();

        const xml = new XMLParser().parseFromString(xmlText);

        // Search for showtimes of the current movie by comparing titles
        const movieShowtimes = xml.getElementsByTagName('Show').filter(showtime => {
          console.log('showtime', showtime);
          const showtimeTitle = showtime.getElementsByTagName('Title')[0].value.toLowerCase();
          return showtimeTitle === movie.title.toLowerCase(); // Compare titles exactly
        });

        setShowtimes(movieShowtimes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching showtimes:', error);
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movie]);

  if (!movie) return <div>Select a movie to view details</div>;

  return (
    <div className="movie-container">
      <div className="movie-info">
        <img
          src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="movie-details">
          <h1>{movie.title}</h1>
          <p>{movie.overview}</p>
          <p>Rating: {movie.vote_average.toFixed(1)}</p>
          <p>Release Date: {movie.release_date}</p>
          <div className="btns">
            <button 
            className={activeTab === "showtimes" ? "active" : ""}
            onClick={() => setActiveTab("showtimes")}
            >Showtimes</button>
            <button 
            className={activeTab === "reviews" ? "active" : ""}
            onClick={() => setActiveTab("reviews")}
            >Reviews</button>
          </div>
        </div>
        <MdFavoriteBorder className="favorite-btn" />
      </div>

      {activeTab === 'showtimes' && (
        <div className="showtimes">
          <h1>Showtimes</h1>
          {loading ? (
            <p>Loading showtimes...</p>
          ) : showtimes.length > 0 ? (
            <div className="theatres">
              {showtimes.map((showtime, index) => (
                <div className="theatre" key={index}>
                  <h3>{showtime.getElementsByTagName('Theatre')[0].value}</h3>
                  <p>Location: {showtime.getElementsByTagName('TheatreAndAuditorium')[0].value}</p>
                  <p>Showtime: {showtime.getElementsByTagName('dttmShowStart')[0].value}</p>
                  <button>Tickets</button>
                </div>
              ))}
            </div>
          ) : (
            <p>No showtimes available for this movie</p>
          )}
        </div>
      )}

      {activeTab === "reviews" && (
        <div className='reviews-container'>
          <div className='review-title'>
            <h1>Reviews</h1>
            <h3>Latest reviews</h3>
          </div>
          <div className='reviews'>
            <div className='review'>
              <h2>Gladiator 2</h2>
              <p>Rating: 5/5</p>
              <p>Description: This movie was amazing!</p>
              <p>Created at: 11/11/2024, 10:10AM</p>
            </div>
            <div className='review'>
              <h2>Gladiator 2</h2>
              <p>Rating: 5/5</p>
              <p>Description: This movie was amazing!</p>
              <p>Created at: 11/11/2024, 10:10AM</p>
            </div>
            <div className='review'>
              <h2>Gladiator 2</h2>
              <p>Rating: 5/5</p>
              <p>Description: This movie was amazing!</p>
              <p>Created at: 11/11/2024, 10:10AM</p>
            </div>
            <div className='review'>
              <h2>Gladiator 2</h2>
              <p>Rating: 5/5</p>
              <p>Description: This movie was amazing!</p>
              <p>Created at: 11/11/2024, 10:10AM</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoviePage;
