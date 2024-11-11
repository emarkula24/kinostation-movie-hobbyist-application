import React from 'react'
import './Sidebar.css'
import { BiSolidCoffee } from "react-icons/bi";
import { TbMovie } from "react-icons/tb";
import { GrFavorite } from "react-icons/gr";
import { FiTrendingUp } from "react-icons/fi";
import { CiCalendar } from "react-icons/ci";
import { MdGroup } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineReviews } from "react-icons/md";




function Sidebar() {
  return (
    <div className='sidebar'>

        <div className='logo' onClick={ (e) => {
            e.preventDefault();
            window.location.href = '/';
        }}>
            <BiSolidCoffee className='logoIcon'/>
            <h1>Movie App</h1>
        </div>

        <div className='category'>
            <ul>
                <li>
                    <TbMovie className='icon'/>
                    Home
                </li>
                <li>
                    <GrFavorite className='icon'/>
                    Favorites
                </li>
                <li>
                    <FiTrendingUp className='icon'/>
                    Trending
                </li>
                <li>
                    <CiCalendar className='icon'/>
                    Coming Soon
                </li>
            </ul>
        </div>

        <div className='group'>
            <ul>
                <li>
                    <MdGroup className='icon'/>
                    Community
                </li>
                <li>
                    <MdOutlineReviews className='icon'/>
                    Reviews
                </li>
            </ul>
        </div>

        <div className='options'>
            <ul>
                <li>
                    <IoSettingsSharp className='icon'/>
                    Settings
                </li>
                <li>
                    <FiLogOut className='icon'/>
                    Sign Out
                </li>
            </ul>
        </div>

    </div>
  )
}

export default Sidebar