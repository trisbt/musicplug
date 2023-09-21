import React, { useState, useEffect, FC } from 'react';
import CircleOfFifths from './CircleOfFifths';
import EnhancedTable from './Table';
import { type } from 'os';

interface FavoritesProps {
  username: string;
}
interface UserFavorite {
  album: string;
  artist: string;
  id: string;
  image: string;
  key: string;
  loudness: number;
  song: string;
  tempo: number;
  _id: string;
}


const Favorites: FC<FavoritesProps> = ({ username }) => {
  const [userFavorites, setUserFavorites] = useState<UserFavorite[]>([]);
  const [initialRenderDone, setInitialRenderDone] = useState<boolean>(false);
  const [activeSlice, setActiveSlice] = useState<string | null>(null);
  const [favDeleteRender, setFavDeleteRender] = useState<boolean>(false);
  useEffect(() => {
    const fetchFavorites = () => {
      fetch('/api/favs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
        credentials: 'include',
      })
        .then(res => res.json())
        .then(res => {
          // const favArray = res;
          setUserFavorites(res);
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
      <EnhancedTable username={username} favorites={userFavorites} initialRenderDone={initialRenderDone} favDeleteRender={favDeleteRender} setFavDeleteRender={setFavDeleteRender} activeSlice={activeSlice} />

    </div>
  );
}

export default Favorites;



