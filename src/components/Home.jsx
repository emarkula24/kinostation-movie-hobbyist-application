import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import Categories from './Categories';
import './Home.css';

function Home({ setSelectedMovie }) {
  return (
    <div className="home">
      <Categories setSelectedMovie={setSelectedMovie} />
    </div>
  );
}

export default Home;
