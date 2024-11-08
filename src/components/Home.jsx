import React from 'react'
import "./Home.css"
import Sidebar from './Sidebar'
import Header from './Header'

function Home() {
  return (
    <div className='home'>
        <Sidebar />
        <Header />
    </div>
  )
}

export default Home