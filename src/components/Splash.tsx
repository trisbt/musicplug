import React from 'react';
import { Card, Typography} from '@mui/material';


const Splash = () => {

    return (
        <div>
            <Card sx={{
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
                width: '60vw',
                // height: '30vh',
                alignContent:'center',
                borderRadius:'.5em',
                backgroundColor: 'rgb(200,200,200,.5)',
                // mask: 'linear-gradient(to bottom, transparent, black, black)',

                // backdropFilter: 'blur(2px)',
                boxShadow: 0,
                // '@media (max-width: 600px)': {
                //     width: '80vw',
                // }
            }}>
                <Typography variant='h2' component="h2" sx={{
                    display:'flex',
                    alignItems:'center',
                    color: '#e8eaf6',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '1px',
                    backdropFilter: 'blur(9px)',
                    padding: '0.5rem',
                    // textShadow:'2',
                    borderRadius: '2px',
                    textTransform: 'uppercase',
                    '@media (max-width: 1100px)': {
                        fontSize: '44px'
                    },
                    '@media (max-width: 600px)': {
                        fontSize: '24px'
                    },
                    // '@media (max-width: 300px)': {
                    //     fontSize: '14px'
                    // },
                    '@media (max-width: 900px), and (orientation: landscape)': {
                        // fontSize: '34px'
                    },
                }}>
                    Find A Song's Key, Tempo, and Credits
                    
                </Typography>
            </Card>
        </div>
    );
}
export default Splash;