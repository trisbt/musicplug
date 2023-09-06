import React, { useState, useEffect } from 'react';
import CircleOfFifths from './CircleOfFifths';
import EnhancedTable from './Table';

function Favorites({ username }) {
  const [userFavorites, setUserFavorites] = useState([]);
  const [initialRenderDone, setInitialRenderDone] = useState(false);
  const [activeSlice, setActiveSlice] = useState(null);
  const [favDeleteRender, setFavDeleteRender] = useState(false);

  useEffect(() => {
    const fetchFavorites = () => {
      fetch('/favs', {
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
  }, [username, favDeleteRender]);


  return (
    <div>
      <CircleOfFifths activeSlice={activeSlice} setActiveSlice={setActiveSlice} />
      <EnhancedTable username = {username} favorites={userFavorites} initialRenderDone={initialRenderDone} favDeleteRender={favDeleteRender}setFavDeleteRender={setFavDeleteRender} activeSlice={activeSlice} />

    </div>
  );
}

export default Favorites;



