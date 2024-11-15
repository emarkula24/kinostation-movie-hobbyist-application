import React from 'react';
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
