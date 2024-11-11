import React from 'react'
import "./Home.css"
import Sidebar from './Sidebar'
import Header from './Header'
// import Categories from './Categories'

function Home() {
  return (
    <div className='home'>
        <Sidebar />
        <Header />

        {/* <Categories /> */}
    </div>
  )
}

export default Home