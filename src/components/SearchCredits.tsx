import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface Credit {
  artist_name: string;
  role: string;
}

interface SearchCreditsProps {
  artists: { name: string }[];
  song: string;
  onReceiveAlias: (alias: string[]) => void;
}

const SearchCredits: React.FC<SearchCreditsProps> = ({ artists, song, onReceiveAlias }) => {
  const [credits, setCredits] = useState<Credit[]>([]);

  useEffect(() => {
    //prod
    fetch(`https://api.bpmkey.com/api/getCredits/?artist=${artists[0].name}&song=${song}`)
    //dev
    // fetch(`/api/getCredits/?artist=${artists[0].name}&song=${song}`)
      .then(response => response.json())
      .then(res => {
        if (res.data === 'No credits available') {
          setCredits([{ artist_name: ' No credits available as of', role: '10/1/2023' }]);
          return;
        }
        setCredits(res.data);
      })
      .catch(err => {
        console.log(err);
        return;
      })
  }, []);

  // useEffect(() => {
  //   setCredits([{ artist_name: ' Currently updating credits check back soon', role: '10/1/2023' }]);
  //   return;
  // }, []);

  return (
    <div className='credits-container'>
      <Box>
        <ul style={{
          columns: '2',
          paddingInlineStart: '0',
        }}>
          {credits.map((el, index) => (
            <li key={`${el.artist_name}`}>
              <span className="even-credit">{el.artist_name}</span><span className="odd-credit"> - {el.role}</span>
            </li>
          ))}
        </ul>
      </Box>
    </div>
  );
};

export default SearchCredits;