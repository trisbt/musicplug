import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface Credit {
  artist_name: string;
  role: string;
}

interface SearchIdProps {
  artists: { name: string }[];
  song: string;
  onReceiveAlias: (alias: string[]) => void;
}

const SearchId: React.FC<SearchIdProps>= ({ artists, song, onReceiveAlias }) => {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    fetch(`/api/getCredits/?artist=${artists[0].name}&song=${song}`)
      .then(response => response.json())
      .then(res => {
        setIsLoading(false);
        if (res.data === 'No credits available') {
          setCredits([{ artist_name: ' No credits available as of', role: '6/1/2023' }]);
          return;
        }
        setCredits(res.data);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
        return;
      })
  }, []);

  if (isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

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

export default SearchId;