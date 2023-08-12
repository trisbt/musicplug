import React, { useState } from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
// import { amber } from '@mui/material/colors';
import { blueGrey } from '@mui/material/colors';


const MoreButton = styled(Button)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    backgroundColor: blueGrey[500],
    '&:hover': {
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main,
    },
    fontSize: '12px',
    width:'160px',
    height:'30px',
    lineHeight:'0',
}));

//secondary search for discogs
const SearchId = ({ id, credits, setCredits }) => {
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
                        if (data.message === 'Master Release not found.' || data.message === 'The requested resource was not found.') {
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
                            if (track.title.toLowerCase() === song.toLowerCase() || track.title.toLowerCase() === noFeatSong.toLowerCase()) {
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


    return (

        <div>
            <div className='more-main'>
                <MoreButton size="small" variant='filledTonal' onClick={fetchData}>Credits</MoreButton>
            </div>
            {credits.map((el, index) => (
                <ul className={index % 2 === 0 ? 'even-credit' : 'odd-credit'} key={el}>
                    <li>{el}</li>
                </ul>
            ))}

        </div>
    );
};

export default SearchId;
