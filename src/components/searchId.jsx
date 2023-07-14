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
let discogsToken = 'ohMHComnBxgyFklMSWRgRvPPYOtwXYRHNGnJZyvs';
const SearchId = ({ id }) => {
    const [response, setResponse] = useState([]);
    const [currData, setCurrData] = useState({})
    const [credits, setCredits] = useState([]);
    // const [isVisible, setIsVisible] = useState(false);
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
                        setResponse([`Key: ${keySig} / Tempo: ${tempo} / Loudness: ${loudness}db / Energy: ${energy}`]);

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
                        ///fetch to discogs with the artist and album name to get masterid

                        fetch(`https://api.discogs.com/database/search?q=${artists + albums}&token=${discogsToken}`)
                            // fetch(`https://api.discogs.com/masters/${masterId}`)
                            .then(response => response.json())
                            .then(data => {
                                console.log(data)
                                // console.log('discogs:', data.results);
                                //set masterid and then fetch
                                const masterId = data.results[0].master_id;
                                fetch(`https://api.discogs.com/masters/${masterId}`)
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.message === 'Master Release not found.') {
                                            setCredits(['No credits/Master release not found'])
                                            return;
                                        }
                                        const tracklistArr = data.tracklist;
                                        console.log('tracklist:', tracklistArr)
                                        //arr where credits will be stored
                                        const creditsArr = [];
                                        //set another song variable to take out feature
                                        const noFeatSong = song.replace(/\(.*\)/, "").trim();
                                        //iterate over the master tracklist
                                        for (const track of tracklistArr) {
                                            if (track.title.toLowerCase() === song.toLowerCase() || track.title.toLowerCase() === noFeatSong.toLowerCase()) {
                                                // console.log(track)
                                                //if credits are given then push into our credits arr
                                                if (track.extraartists) {
                                                    const crew = track.extraartists
                                                    for (const per of crew) {
                                                        creditsArr.push(per.role, per.name)
                                                    }
                                                }
                                            }
                                            // setCredits(['credits not yet built'])
                                            // return;
                                        }
                                        // console.log(creditsArr)
                                        setCredits(creditsArr);
                                        // console.log(credits)
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        return;
                                    })
                            })
                            .catch(err => {
                                console.log(err);
                                return;
                            })
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
                <button className='search-id' onClick={fetchData}>Get Info/Credits</button>
                <button className='star-button'>
                    <i onClick={handleClick} class="fa-solid fa-star"></i>
                </button>

            </div>
            {response}
            {credits.map((el, index) => (
                <ul className={index % 2 === 0 ? 'even-credit' : 'odd-credit'} key={el}>
                    <li>{el}</li>
                </ul>
            ))}


        </div>
    );
};

export default SearchId;
