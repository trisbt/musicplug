import React, { useState, useEffect } from 'react';


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
        // console.log(num);
        return chart[num];
    }
}
// let discogsToken = 'ohMHComnBxgyFklMSWRgRvPPYOtwXYRHNGnJZyvs';
const SearchId = ({ id }) => {
    const [response, setResponse] = useState([]);
    const [currData, setCurrData] = useState({})
    const fetchData = () => {
        //access token first fetch
        fetch('http://localhost:4000/api/accessToken')
            .then(res => res.json())
            .then(data => {
                const token = data.token;
                //fetch audio features with id
                fetch(`https://api.spotify.com/v1/audio-features/${id}`, { // Remove the extra quotes around the id
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        const keySig = keyConvert(data.key);
                        const tempo = data.tempo;
                        const loudness = data.loudness;
                        const energy = data.energy;
                        // console.log(data);
                        // Update the response state with the JSON data
                        setResponse([`key: ${keySig} / tempo: ${tempo} / loudness: ${loudness} / energy: ${energy}`]);

                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                //get the track name by fetching to spotify again
                fetch(`https://api.spotify.com/v1/tracks/${id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        // console.log(data);
                        const song = data.name;
                        const artists = data.artists.map(artist => {
                            return artist.name + '/';
                        })
                        const albums = data.album.name;
                        const images = data.album.images[1].url;
                        // const starData = () => {
                        setCurrData({ song: song, artist: artists, album: albums, image: images })
                        console.log('got currData:', currData)
                        // }
                        ///fetch to discogs with the specifc track name
                        // fetch(`https://api.discogs.com/database/search?q=${song}&token=${discogsToken}`)
                        //     .then(response => response.json())
                        //     .then(data => {
                        //         console.log(data);
                        //     })
                    })
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
    // for (const el of response) {
    //     console.log(el)

    // }

    const handleClick = () => {
        // Make an HTTP POST request to your server
        fetch('http://localhost:4000/favs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currData)

        })
            .then((response) => response.text())
            .then((result) => {
                console.log(result); // Log the server response
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    return (

        <div>
            <div className='star'>
                <button className='search-id' onClick={fetchData}>Get Audio Analysis</button>
                <button >
                    <i onClick={handleClick} class="fa-regular fa-star"></i>
                </button>

            </div>
            {response}
        </div>
    );
};

export default SearchId;
