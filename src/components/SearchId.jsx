import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

//secondary search for discogs
const SearchId = ({ artists, song }) => {
  const [credits, setCredits] = useState([]);
  useEffect(() => {
        ///fetch to postgres
        fetch(`http://localhost:4000/getCredits/?artist=${artists[0].name}&song=${song}`)
          .then(response => response.json())
          .then(data => {
            if (data === 'No credits available') {
              setCredits([{name: 'No credits available'}])
              return;
            }
            setCredits(data);
          })
          .catch(err => {
            console.log(err);
            return;
          })
  },[]);

  return (

    <div className='credits-container'>
        <Box
          sx={{
            // border: 1,
            // borderColor: "grey.300",
            // borderRadius: 2,
            padding: 2,
            // overflow: "auto",
            // maxHeight: 300,
            width: '90vw',
            "@media (max-width: 600px)": {
              width: '90vw'
            }
          }}
        >
          <ul style={{
            columns: '2',
            columnGap: '16px',
            margin: 0,
            padding: 0
          }}>
            {credits.map((el, index) => (
              <li
                key={`${el.name}`}
                // className={index % 2 === 0 ? 'even-credit' : 'odd-credit'}
              >
               <span className="even-credit">{el.name}</span> - <span className="odd-credit">{el.artistRole}</span>
              </li>
            ))}
          </ul>
        </Box>
      {/* )} */}
    </div>
  );
};

export default SearchId;
