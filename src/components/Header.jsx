import React from 'react'
import './Header.css'
import { FaUserLarge } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";




function Header() {
  return (
    <div className='header'>
        <nav>
            <ul>
                <li>Movies</li>
                <li>Series</li>
                <li>Documentaries</li>
                <li>More</li>
            </ul>
        </nav>

        <div className='search'>
            <div className='input-container'>
                <FaSearch className="searchIcon" />
                <input type='text' placeholder='Search for a movie, tv show, person...' />
            </div>
        </div>

        <div className='profile'>
            <IoMdNotificationsOutline className='notifIcon'/>
            <FaUserLarge className='userIcon'/>
            <span>Profile</span>
        </div>
    </div>
  )
}

export default Header