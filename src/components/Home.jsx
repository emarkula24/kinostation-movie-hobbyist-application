import React from 'react'
import "./Home.css"
import Header from './Header'
import Categories from './Categories'

function Home() {
  return (
    <div className='home'>
        
        <Header />

        <Categories />
    </div>
  )
}

export default Home