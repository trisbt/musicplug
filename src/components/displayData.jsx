import SearchId from './searchId';
import React, { useState, useRef } from 'react';
// import IconButton from '@mui/material/IconButton';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import { styled } from '@mui/material/styles';
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import { Button } from '@mui/material';



const PrevButton = styled(Button)(({ theme }) => ({
    color: theme.palette.secondary.main,
    // backgroundColor: theme.palette.primary.dark,
    '&:hover': {
        color: theme.palette.secondary.dark,
        backgroundColor: 'none',
    },
    // padding: theme.spacing(1.2),
}));

const FavButton = styled(Button)(({ theme }) => ({
    color: theme.palette.secondary.main,
    // backgroundColor: theme.palette.primary.dark,
    '&:hover': {
        color: theme.palette.secondary.dark,
        backgroundColor: 'none',
    },
    // padding: theme.spacing(1.2),
}));

const FavSolid = styled(GradeIcon)(({ theme }) => ({
    color: theme.palette.secondary.main,
    '&:hover': {
        color: theme.palette.secondary.dark,
        backgroundColor: 'none',
    },
    // padding: theme.spacing(1.2),
}));
const FavOutlined = styled(GradeOutlinedIcon)(({ theme }) => ({
    color: theme.palette.secondary.main,
    // backgroundColor: theme.palette.primary.light,
    '&:hover': {
        backgroundColor: 'none',
        color: theme.palette.secondary.dark,
    },
    // padding: theme.spacing(1.2),
}));


const DisplayData = ({ data, username }) => {
    const [favoriteMap, setFavoriteMap] = useState({});
    const audioRef = useRef(null);
    if (!data || !data.tracks || !data.tracks.items) {
        return null;
    }
    const results = data.tracks.items.map((item) => {
        const { name, album, preview_url } = item;
        const artists = item.artists
        // .map(artist => {
        //     return artist.name + ' | ';
        // })
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
            //add like
            if (data.isFavorite === 'added') {
                setFavoriteMap((prevMap) => ({
                    ...prevMap,
                    [id]: true,
                }));
                // remove like
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
            <h4 style={{ textAlign: 'center', fontSize: '20px' }}>Search Results:</h4>
            <ul>
                {results.map((item, index) => (
                    <div key={index}>
                        <div className='main-info'>
                            <div className='song-info'>
                                <span className='result-artist'>
                                    {item.artists.map((artist, index) => (
                                        <span key={index}>
                                            {artist.name}
                                            {index < item.artists.length - 1 && (
                                                <span style={{ color: '#B3C7ED', fontStyle: 'italic', marginLeft: '5px', marginRight: '5px' }}>|</span>
                                            )}
                                        </span>
                                    ))}
                                </span>
                                <span className="result-name">{item.name}</span>
                                <span className='result-album'>{item.albums}</span>
                                <span className='release-date'>Released: {item.release_date}</span>
                            </div>
                            <img className="result-image" src={item.images} alt={item.name} />
                        </div>
                        <div className='play-star'>
                            {item.preview_url && (
                                <PrevButton
                                    // variant='outlined'
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                    className='preview'
                                    onClick={() => playAudio(item.preview_url)}
                                    startIcon={<PlayCircleFilledWhiteOutlinedIcon />} // Replace YourIconComponent with the actual icon you want to use
                                >
                                    Preview track
                                </PrevButton>
                            )}
                            <audio ref={audioRef}></audio>
                            <FavButton

                                className='fav-icon'
                                onClick={() => handleFavorite(item, username)}
                                sx={{
                                    padding: '0',
                                    // display: 'flex',
                                    justifyContent: "flex-start",
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                {favoriteMap[item.id] ? <FavSolid /> : <FavOutlined />}
                                {/* Favorite */}
                            </FavButton>
                        </div>
                        <SearchId id={item.id} name={item.name} artists={item.artists} album={item.albums} />
                        <hr />
                    </div>
                ))}

            </ul>
        </div>
    );
};


export default DisplayData;
