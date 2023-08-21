import React, { useState } from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { lightBlue } from '@mui/material/colors';


const MoreButton = styled(Button)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    backgroundColor: lightBlue[700],
    '&:hover': {
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main,
    },
    fontSize: '12px',
    width: '200px',
    height: '50px',
    lineHeight: '0',
}));
function getStringBeforeParenthesis(str) {
    const indexOfParenthesis = str.indexOf('(');
    if (indexOfParenthesis !== -1) {
        return str.substring(0, indexOfParenthesis).trim(); // trim to remove any spaces before '('
    }
    return str;
}
//secondary search for discogs
const SearchId = ({ id }) => {
    const [credits, setCredits] = useState([]);
    const [showCredits, setShowCredits] = useState(false);
    const fetchData = () => {
        //get the track name by fetching to spotify again
        fetch(`http://localhost:4000/getTracks?query=${id}`)
            .then(res => res.json())
            .then(data => {
                const song = data.name;
                const artists = data.artists.map(artist => {
                    return artist.name + '/';
                })
                const albums = data.album.name;
                ///fetch to discogs with the artist and album name to get masterid
                fetch(`http://localhost:4000/getCredits/?artist=${artists}&album=${albums}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.message === 'Master Release not found.' || data.message === 'The requested resource was not found.' || data === 'No masters found with extra artists.') {
                            setCredits(['No credits/Master release not found'])
                            return;
                        }
                        const tracklistArr = data.tracklist;
                        //arr where credits will be stored
                        const creditsArr = [];
                        //set another song variable to take out feature
                        const noFeatSong = song.replace(/\(.*\)/, "").trim();
                        //iterate over the master tracklist
                        for (const track of tracklistArr) {
                            
                            if (track.title.toLowerCase() === song.toLowerCase() || track.title.toLowerCase() === noFeatSong.toLowerCase() || song.toLowerCase() === getStringBeforeParenthesis(track.title.toLowerCase())) {
                                //if credits are given then push into our credits arr
                                if (track.extraartists) {
                                    const crew = track.extraartists
                                    for (const per of crew) {
                                        creditsArr.push(per.role, per.name);
                                    }
                                }
                            }
                        }
                        setCredits(creditsArr);
                        setShowCredits(true);
                    })
                    .catch(err => {
                        console.log(err);
                        return;
                    })
            })
            .catch(err => {
                console.log(err);
                return;
            })

    };
    const handleMoreButtonClick = () => {
        setShowCredits(!showCredits);
        if (!showCredits) {
            fetchData();
        }
    };

    return (

        <div className='credits-container'>
            <MoreButton className='credits-button' size="small" variant='filledTonal' onClick={handleMoreButtonClick}>Credits</MoreButton>
            {showCredits && (
               <Box
               sx={{
               
                   border: 1,
                   borderColor: "grey.300",
                   borderRadius: 2,
                   padding: 2,
                   overflow: "auto",
                   maxHeight: 300  ,
                   width: 700,
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
                           key={el}
                           className={index % 2 === 0 ? 'even-credit' : 'odd-credit'}
                       >
                           {el}
                       </li>
                   ))}
               </ul>
           </Box>
            )}
        </div>
    );
};

export default SearchId;
