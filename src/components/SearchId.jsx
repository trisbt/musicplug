import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

const SearchId = ({ artists, song, onReceiveAlias }) => {
  const [credits, setCredits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/getCredits/?artist=${artists[0].name}&song=${song}`)
      .then(response => response.json())
      .then(res => {
        console.log(res.data)
      
        setIsLoading(false);  // Setting loading state to false here
        if (res.data === 'No credits available') {
          setCredits([{ artist_name: 'No credits available. Last updated 6/1/23' }]);
          return;
        }else{
          
            // onReceiveAlias(res.alias);
        
        }
        setCredits(res.data);
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
