import React from 'react'
import "./Home.css"
import Header from './Header'
// import Categories from './Categories'
import MoviePage from './MoviePage'

function Home() {
  return (
    <div className='home'>
        
        <Header />

        {/* <Categories /> */}
        <div className='MoviePage'>
        <MoviePage />
        </div>
        
    </div>
  )
}

export default Home