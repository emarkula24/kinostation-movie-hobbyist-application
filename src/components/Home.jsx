import React from 'react';
import Categories from './Categories';
import GroupLists from './GroupLists';
import './Home.css';

function Home({ setSelectedMovie }) {
  return (
    <div className="home">
      <Categories setSelectedMovie={setSelectedMovie} />
      <GroupLists />
    </div>
  );
}

export default Home;
