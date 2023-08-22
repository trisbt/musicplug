import React, { useState, useEffect } from 'react';
import CircleOfFifths from './circleOfFifths';
import EnhancedTable from './table';

function Favorites({ username }) {
  const [userFavorites, setUserFavorites] = useState([]);
  const [initialRenderDone, setInitialRenderDone] = useState(false);
  const [activeSlice, setActiveSlice] = useState(null);

  useEffect(() => {
    const fetchFavorites = () => {
      fetch('http://localhost:4000/favs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
        credentials: 'include',
      })
        .then(res => res.json())
        .then(res => {
          const favArray = res.favorites;
          setUserFavorites(favArray);
          setInitialRenderDone(true);
        })
        .catch(err => {
          console.log(err);
        });
    };
    fetchFavorites();
  }, [username]);


  return (
    <div>
      <CircleOfFifths activeSlice={activeSlice} setActiveSlice={setActiveSlice} />
      <EnhancedTable favorites={userFavorites} initialRenderDone={initialRenderDone} activeSlice={activeSlice} />

    </div>
  );
}

export default Favorites;



