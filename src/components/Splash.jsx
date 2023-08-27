import React from 'react';
import { Card, Typography } from '@mui/material';

  
const Splash = () => {

    return (
        <div>
            <Card sx={{
                display: 'flex',
                justifyContent: 'center',
                // alignItems:'center',
                textAlign: 'center',
                width: '60vw',
                height: '30vh',
                backgroundColor: 'transparent',
                boxShadow: 0,
                '@media (max-width: 600px)': {
                    width: '80vw',
                }
            }}>
                <Typography variant='h2' component="h2" sx={{
                    color: '#e8eaf6',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '1px',
                    backdropFilter: 'blur(10px)',
                    // backgroundColor: 'rgba(250, 250, 250, 0.05)',
                    padding: '0.5rem',
                    borderRadius: '5px',
                    textTransform: 'uppercase',
                    '@media (max-width: 1100px)': {
                        fontSize:'44px'
                    },
                    '@media (max-width: 600px)': {
                        fontSize:'34px'
                    },
                    '@media (max-width: 300px)': {
                        fontSize:'24px'
                    },
                    '@media (max-width: 900px), and (orientation: landscape)': {
                        fontSize:'34px'
                    },
                    // '@media (max-width: 900px), screen and (orientation: landscape)': {
                    //     fontSize:'44px'
                    // },
                   
            
                  
                }}>
                    Find A Song's Key, Tempo, Loudness and Credits
                </Typography>
            </Card>
        </div>
    );
}
export default Splash;