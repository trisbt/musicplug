import React from 'react';
import { Box, Link, Typography } from '@mui/material';

const Footer = () => {
  return (
    <div>
      <Box
        sx={{
          backgroundColor: '#0047d4',
          padding: '20px',  // Add some padding for spacing
          maxHeight: '300px', // Specific height for the footer. Adjust as needed.
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box sx={{
          width: '75%'
        }}>
          <Typography variant="h6" color='#FFFFFF' gutterBottom sx={{
            letterSpacing: '1px',
            textAlign: 'center',
            // padding: '0.5rem',
          }}>
            MusicPlug.com allows you to find information for any song, including BPM, Key, and Song Credits.
          </Typography>
          <hr />
          <Typography variant="subtitle1" color='#FFFFFF' gutterBottom sx={{
            letterSpacing: '1px',
            textAlign: 'center',
            // padding: '0.5rem',
          }}>
            Sign Up to store your favorites to use sort, filter, and Circle of Fifths wheel features.
          </Typography>
        </Box>
      </Box>
          <hr />
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          padding: '10px',
          maxHeight: '200px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box sx={{
          width: '80%',
          padding: '0.5rem',
          // backgroundColor:'red'
        }}>
          <Typography variant="subtitle2" color='text.secondary' gutterBottom sx={{
            // letterSpacing: '1px',
            display: 'flex',        
            alignItems: 'center',
           
          }}>
            Song data provided by
            <Link to={'https://www.spotify.com'} sx={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',    
              margin: '0.5rem',   
              alignItems: 'center',
              ':hover': {
                cursor: 'pointer',
              }

            }}>
              <svg
                style={{
                  // paddingTop: '5px',
                  paddingRight: '.2em',
                  // paddingLeft: '.2em',
                  // paddingBottom: '0px'
                }}
                xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
                <path fill="#00e676" d="M17.9 10.9C14.7 9 9.35 8.8 6.3 9.75c-.5.15-1-.15-1.15-.6c-.15-.5.15-1 .6-1.15c3.55-1.05 9.4-.85 13.1 1.35c.45.25.6.85.35 1.3c-.25.35-.85.5-1.3.25m-.1 2.8c-.25.35-.7.5-1.05.25c-2.7-1.65-6.8-2.15-9.95-1.15c-.4.1-.85-.1-.95-.5c-.1-.4.1-.85.5-.95c3.65-1.1 8.15-.55 11.25 1.35c.3.15.45.65.2 1m-1.2 2.75c-.2.3-.55.4-.85.2c-2.35-1.45-5.3-1.75-8.8-.95c-.35.1-.65-.15-.75-.45c-.1-.35.15-.65.45-.75c3.8-.85 7.1-.5 9.7 1.1c.35.15.4.55.25.85M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z" />
              </svg>
              Spotify
            </Link>
          </Typography>
          <Typography variant="subtitle2" color='text.secondary' gutterBottom sx={{
            // letterSpacing: '1px',
            // margin: '0.5rem',
          }}>
            Credits data provided by Discogs Monthly Data Dumps - last updated 06-01-2023
          </Typography>
          
        </Box>

      </Box>
      
    </div>
  );
};

export default Footer;
