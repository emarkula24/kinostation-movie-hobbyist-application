import React from 'react'
import './Categories.css'

function Categories() {
  return (
    <div className='container'>

      <div className='categories'>
       <h1>Trending</h1>
          <div className='category'>
            <div className="card">
              <img className='movie-poster'
                   src='https://image.tmdb.org/t/p/w500/6MKr3KgOLmzOP6MSuZERO41Lpkt.jpg' alt='movie'/>
              <p>Movie Title</p>
            </div>

            <div className="card">
              <img className='movie-poster'
                   src='https://image.tmdb.org/t/p/w500/6MKr3KgOLmzOP6MSuZERO41Lpkt.jpg' alt='movie'/>
              <p>Movie Title</p>
            </div>

            <div className="card">
              <img className='movie-poster'
                   src='https://image.tmdb.org/t/p/w500/6MKr3KgOLmzOP6MSuZERO41Lpkt.jpg' alt='movie'/>
              <p>Movie Title</p>
            </div>

            {/* <div className="card">
              <img className='movie-poster'
                   src='https://image.tmdb.org/t/p/w500/6MKr3KgOLmzOP6MSuZERO41Lpkt.jpg' alt='movie'/>
              <p>Movie Title</p>
            </div> */}

          </div>
      </div>

      
      <div className='categories'>
        <h1>Trending</h1>
          <div className='category'>
            <div className="card">
              <img className='movie-poster'
                   src='https://image.tmdb.org/t/p/w500/6MKr3KgOLmzOP6MSuZERO41Lpkt.jpg' alt='movie'/>
              <p>Movie Title</p>
            </div>

            <div className="card">
              <img className='movie-poster'
                   src='https://image.tmdb.org/t/p/w500/6MKr3KgOLmzOP6MSuZERO41Lpkt.jpg' alt='movie'/>
              <p>Movie Title</p>
            </div>

            <div className="card">
              <img className='movie-poster'
                   src='https://image.tmdb.org/t/p/w500/6MKr3KgOLmzOP6MSuZERO41Lpkt.jpg' alt='movie'/>
              <p>Movie Title</p>
            </div>

            {/* <div className="card">
              <img className='movie-poster'
                   src='https://image.tmdb.org/t/p/w500/6MKr3KgOLmzOP6MSuZERO41Lpkt.jpg' alt='movie'/>
              <p>Movie Title</p>
            </div> */}

          </div>
      </div>

    </div>
  )
}

export default Categories