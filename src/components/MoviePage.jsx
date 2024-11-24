import React, { useEffect, useState } from 'react';
import './MoviePage.css';
import { MdFavoriteBorder } from 'react-icons/md';
import XMLParser from 'react-xml-parser';
import { IoMdAdd } from "react-icons/io";
import { MdGroups } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import axios from 'axios';




function MoviePage({ movie }) {

  const [activeTab, setActiveTab] = useState("showtimes"); // Initial tab
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [writeReview, setWriteReview] = useState('');
  const [starReview, setStarReview] = useState('')
  const [reviews, setReviews] = useState([]);
  const [showGroups, setShowGroups] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);

  useEffect(() => {
    if (!movie) return;

    const fetchShowtimes = async () => {
      try {
        const response = await fetch('https://www.finnkino.fi/xml/Schedule/');
        const xmlText = await response.text();

        const xml = new XMLParser().parseFromString(xmlText);

        // Search for showtimes of the current movie by comparing titles
        const movieShowtimes = xml.getElementsByTagName('Show').filter(showtime => {
          // console.log('showtime', showtime);
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

  const handleInputReview = (e) => {
    e.preventDefault();
    setWriteReview(e.target.value);
  }

  const handleStarReview = (e) => {
    e.preventDefault();
    setStarReview(e.target.value);
  }

  const writeReviewHandle = async (e) => {
    e.preventDefault();
    // check session if user is logged in
    let user = JSON.parse(sessionStorage.getItem('user'));
    if(user !== null) {
      let user_id = user.users_id;
      let user_email = user.users_email;
      let movie_id = movie.id;
      let review = writeReview;
      let review_rating = starReview;

      let data = {
        user_id,
        user_email,
        movie_id,
        review,
        review_rating
      }

      let token = user.accessToken

      try {
        const response = await axios.post("http://localhost:3001/reviews/create", data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        console.log("Review submitted succesfully")
      } catch(error) {
        console.log("Error creating review", error.response || error)
      }

    }else{
      alert('You must be logged in to write a review');
    }

    setShowWriteReview(true)
  }

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:3001/reviews/review', {
        params: { movie_id: movie.id }
      });
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);


  

  const handleFavorite = () => {
    // check session if user is logged in
    let user = JSON.parse(sessionStorage.getItem('user'));
    if(user !== null) {
      let user_id = user.users_id;
      let movie_id = movie.id;

      let data = {
        user_id,
        movie_id
      }

      // call backend api to post favorite

      // axios.post('http://localhost:3001/favorite', data)
      // .then((response) => {
      //   console.log('response', response);
      // })

      console.log('data', data);
    }else{
      alert('You must be logged in to favorite a movie');
    }
  }

  const handleAddGroup = () => {
    setShowGroups(!showGroups);
  }

  const showWriteReviewHandle = () => {
    setShowWriteReview(!showWriteReview);
  }

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

          <div className='add-group'>

            <div className='add-group-title' onClick={handleAddGroup}>
              <IoMdAdd className='addIcon' />
              <p>Add this movie to a group</p>
            </div>

            {showGroups && 
            <div className='groups-options'>
              <div className='groups-item'>
                <MdGroups className='groupIcon'/>
                <p>Group 1</p>
              </div>
              <div className='groups-item'>
                <MdGroups className='groupIcon'/>
                <p>Group 2</p>
              </div>
              <div className='groups-item'>
                <MdGroups className='groupIcon'/>
                <p>Group 3</p>
              </div>
              <div className='groups-item'>
                <MdGroups className='groupIcon'/>
                <p>Group 4</p>
              </div>
              <div className='groups-item'>
                <MdGroups className='groupIcon'/>
                <p>Group 5</p>
              </div>
            </div>}

          </div>

         

        </div>
        <MdFavoriteBorder onClick={handleFavorite} className="favorite-btn" />
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

          <div className='reviews-head'>
            <div className='review-title'>
              <h1>Reviews</h1>
              <h3>Latest reviews</h3>
            </div>

            { showWriteReview ? 
              <div className='create-review-title' onClick={showWriteReviewHandle}>
                  <PiPencilSimpleLineBold className='reviewIcon'/>
                  <h3>Write a review</h3>
            </div> 
            : 
            <div className='create-review'>
                <input onChange={ handleStarReview } type="text" placeholder="how would you rate this from 1-5?" />
                <input onChange={handleInputReview} type="text" placeholder='write a review' />
                <button onClick={writeReviewHandle}>
                  <FaPencil className='reviewIcon'/>
                </button>
            </div>
            }
          </div>
          
          {reviews.length > 0 ? (
            reviews.filter((review) => review.movie_title === movie.title).length > 0 ? (
              <div className="reviews">
                {reviews
                  .filter((review) => review.movie_title === movie.title)
                  .map((review, index) => (
                    <div className="review" key={index}>
                      <h2>{review.movie_title}</h2>
                      <p>Rating: {review.review_rating}</p>
                      <p>Description: {review.review_text}</p>
                      <p>Created at: {new Date(review.review_created_at).toLocaleString()}</p>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="no-reviews">
                <p>No reviews available for this movie</p>
              </div>
            )
          ) : (
            <div className="no-reviews">
              <p>No reviews available for this movie</p>
            </div>
)}
        </div>
      )}
    </div>
  );
}

export default MoviePage;
