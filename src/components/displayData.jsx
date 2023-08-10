import SearchId from './searchId';
import React, { useState, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';


const DisplayData = ({ data, username }) => {
    const [favoriteMap, setFavoriteMap] = useState({});
    // const [isFavorite, setIsFavorite] = useState(false);
    // const favoriteStateRef = useRef(isFavorite);
    const audioRef = useRef(null);
    if (!data || !data.tracks || !data.tracks.items) {
        return null;
    }
    const results = data.tracks.items.map((item) => {
        const { name, album, preview_url } = item;
        const artists = item.artists.map(artist => {
            return artist.name + '/';
        })
        const images = album.images[1].url;
        const id = item.id;
        const release_date = item.album.release_date;
        const albums = item.album.name;
        return { name, images, id, preview_url, release_date, artists, albums };
    });


    const playAudio = (previewUrl) => {
        audioRef.current.volume = .3;
        if (previewUrl) {
            if (audioRef.current.src === previewUrl && !audioRef.current.paused) {
                audioRef.current.pause();
            } else {
                audioRef.current.src = previewUrl;
                audioRef.current.play();
            }
        }
    };

    const handleFavorite = async (item, username) => {
        const { id, name, artists, albums, images } = item;
        try {
            const response = await fetch('http://localhost:4000/addFavs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, id, name, artists, albums, images }),
                credentials: 'include',
            });
            const data = await response.json();
            if (data.isFavorite === 'added') {
                //already added so make it GradeIcon
                setFavoriteMap((prevMap) => ({
                    ...prevMap,
                    [id]: true,
                }));
                // console.log('Track added to favorites:', data.song);
            } else {
                setFavoriteMap((prevMap) => ({
                    ...prevMap,
                    [id]: false,
                }));
                //already added so make it GradeIcon
                // console.log('Track removed from favorites', data.song);
            }
        } catch (error) {
            console.error('Error adding track to favorites:', error);
        }
    };

    return (
        <div>
            <h4>Search Results:</h4>
            <ul>
                {results.map((item, index) => (
                    <div key={index}>
                        <span className='result-artist'>{item.artists}</span>
                        <div className='star-div'>
                            <span className="result-name">{item.name}</span>

                        </div>
                        <span className='result-album'>{item.albums}</span>

                        <img className="result-image" src={item.images} alt={item.name} />
                        <span className='release-date'>Released: {item.release_date}</span>

                        {item.preview_url && (
                            <button className='preview' onClick={() => playAudio(item.preview_url)}>Preview track</button>
                        )}

                        <audio ref={audioRef}></audio>
                        <IconButton onClick={() => handleFavorite(item, username)}>
                            {favoriteMap[item.id]  ? <GradeIcon /> : <GradeOutlinedIcon />}
                        </IconButton>
                        <SearchId id={item.id} name={item.name} artists={item.artists} album={item.albums} />
                        <hr />
                    </div>
                ))}

            </ul>
        </div>
    );
};


export default DisplayData;
