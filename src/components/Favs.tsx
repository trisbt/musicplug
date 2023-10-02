import React, { useState, useEffect, FC } from 'react';
import CircleOfFifths from './CircleOfFifths';
import EnhancedTable from './Table';
import { type } from 'os';
import { Box, Typography } from '@mui/material';

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
    document.title = 'MusicPlug: User Favorites';
  }, [username, favDeleteRender]);


  return (
    <div>
      {/* <Box sx={{
        display:'flex',
        justifyContent:'center',
        // backgroundColor:'green'
      }}>
        <Typography className='song-sub-info' variant="h4" color="white" component="div" sx={{
          fontSize: '25px',
          display: 'flex',
          textAlign: 'center',
          // textShadow:'5px 8px 5px rgba(0, 0, 0, 0.9)',
          "@media (max-width: 600px)": {
            fontSize: '20px'
          }
        }}
        >
          FILTER YOUR FAVORTIES BY KEY
        </Typography>
      </Box> */}
      <CircleOfFifths activeSlice={activeSlice} setActiveSlice={setActiveSlice} />
      <EnhancedTable username={username} favorites={userFavorites} initialRenderDone={initialRenderDone} favDeleteRender={favDeleteRender} setFavDeleteRender={setFavDeleteRender} activeSlice={activeSlice} />

    </div>
  );
}

export default Favorites;



