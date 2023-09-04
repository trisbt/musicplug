import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

const SearchId = ({ artists, song }) => {
  const [credits, setCredits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/getCredits/?artist=${artists[0].name}&song=${song}`)
      .then(response => response.json())
      .then(data => {
        setIsLoading(false);  // Setting loading state to false here
        if (data === 'No credits available') {
          setCredits([{ name: 'No credits available' }]);
          return;
        }
        setCredits(data);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);  // Also setting loading state to false in case of an error
        return;
      })
  }, []);

  if (isLoading) {
    return (
      <Box
      //  display="flex" justifyContent="center" alignItems="center" height="100vh"
       >
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
            <li key={`${el.name}`}>
              <span className="even-credit">{el.name}</span><span className="odd-credit"> - {el.artistRole}</span>
            </li>
          ))}
        </ul>
      </Box>
    </div>
  );
};

export default SearchId;
