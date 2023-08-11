import React, { useState } from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
// import { amber } from '@mui/material/colors';
import { blueGrey } from '@mui/material/colors';
import DisplayData from './displayData';

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

const keyConvert = (num) => {
    const chart = {
        '0': 'C',
        '1': 'C#, Db',
        '2': 'D',
        '3': 'D#, Eb',
        '4': 'E',
        '5': 'F',
        '6': 'F#, Gb',
        '7': 'G',
        '8': 'G#, Ab',
        '9': 'A',
        '10': 'A#, Bb',
        '11': 'B',
    }
    if (num in chart) {
        return chart[num];
    }
}

const SearchId = ({ id }) => {
    const [response, setResponse] = useState([]);
    // const [keySig, setKeySig] = useState('');
    // const [tempo, setTempo] = useState('');
    const [credits, setCredits] = useState([]);
    const fetchData = () => {
        fetch(`http://localhost:4000/advancedSearch?query=${id}`)
            .then(res => res.json())
            .then(data => {
                const keySig = keyConvert(data.key);
                const tempo = data.tempo;
                const loudness = data.loudness;
                const energy = data.energy;
                // Update the response state with the JSON data
                // setKeySig(keyConvert(data.key));
                // setTempo(data.tempo);
                setResponse([`Key: ${keySig} | Tempo: ${tempo} | Loudness: ${loudness}db | Energy: ${energy}`]);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        //get the track name by fetching to spotify again
        fetch(`http://localhost:4000/getTracks?query=${id}`)
            .then(res => res.json())
            .then(data => {
                const song = data.name;
                const artists = data.artists.map(artist => {
                    return artist.name + '/';
                })
                const albums = data.album.name;
                // const images = data.album.images[1].url;
                // setCurrData({ song: song, artist: artists, album: albums, image: images })
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
                            // setCredits(['credits not yet built'])
                            // return;
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
            .catch(error => {
                console.error('Error:', error);
            });
    };


    return (

        <div>
            <div className='more-main'>
                <MoreButton size="small" variant='filledTonal' onClick={fetchData}>Get Info/Credits</MoreButton>
            </div>
            {response}
            {credits.map((el, index) => (
                <ul className={index % 2 === 0 ? 'even-credit' : 'odd-credit'} key={el}>
                    <li>{el}</li>
                </ul>
            ))}
             {/* <p>Key: {keySig} | Tempo: {tempo}</p> */}
            {/* <DisplayData keySig={keySig} tempo={tempo}/> */}

        </div>
    );
};

export default SearchId;
