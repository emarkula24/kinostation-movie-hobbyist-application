import React from 'react'
import './MoviePage.css'
import { MdFavoriteBorder } from "react-icons/md";


function MoviePage() {
  return (
    <div className='container'>

        <div className='movie-info'>
            <img 
            src='https://www.themoviedb.org/t/p/w600_and_h900_bestv2/6Wdl9N6dL0Hi0T1qJLWSz6gMLbd.jpg' 
            alt='Mortal Kombat' />
            <div className='movie-details'>
                <h1>Mortal Kombat</h1>
                <div className='paragraph-1'>
                    <p>director: John Doe</p>
                    <p>Stars: John Doe, Jane Doe...</p>
                </div>
                
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                    Sint consectetur ipsam blanditiis esse vero. 
                    Esse, consequuntur incidunt quibusdam hic pariatur soluta, 
                    provident ipsum nisi dolore non impedit? 
                    Velit, molestiae fuga?
                </p>
                <div className='btns'>
                    <button>Showtimes</button>
                    <button>Reviews</button>
                </div>
                
            </div>
                <MdFavoriteBorder className='favorite-btn'/>
        </div>

        <div className='showtimes'>
            <h1>Showtimes</h1>
            <div className='dates-btns'>
                <button>Monday</button>
                <button>Tuesday</button>
                <button>Wednesday</button>
                <button>Thursday</button>
                <button>Friday</button>
                <button>Saturday</button>
                <button>Sunday</button>
            </div>
            <p>Date: 13th November 2024, Wednesday</p>
            <div className='theatres'>
                <h2>Available Theatres:</h2>
                <div className='theatre'>
                    <h3>Oulu Plaza</h3>
                    <p>Location: 1234 Street, City, State, 12345</p>
                    <div className='times'>
                        <p>10:00 AM</p>
                        <p>1:00 PM</p>
                        <p>4:00 PM</p>
                        <p>7:00 PM</p>
                    </div>
                    <button>Tickets</button>
                </div>

            </div>

        </div>
    
    </div>
  )
}

export default MoviePage

{/* <div className='movie-page'>
            <div className='movie-info'>
            <img src={movie.poster} alt={movie.title} />
            <div className='movie-details'>
                <h1>{movie.title}</h1>
                <p>{movie.description}</p>
                <p>Rating: {movie.rating}</p>
                <p>Duration: {movie.duration} min</p>
                <p>Genre: {movie.genre}</p>
            </div>
            </div>
            <div className='movie-cast'>
            <h2>Cast</h2>
            <ul>
                {movie.cast.map((actor) => (
                <li key={actor}>{actor}</li>
                ))}
            </ul>
            </div>
        </div> */}