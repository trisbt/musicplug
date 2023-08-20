import SearchId from './searchId';
import React, { useState, useRef, useEffect } from 'react';
// import { useTheme } from '@mui/material/styles';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button } from '@mui/material';
import { grey } from '@mui/material/colors';




const PlayButton = styled(Button)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    backgroundColor: grey[900],
    '&:hover': {
        color: 'white',
        backgroundColor: '#00e676'
    },
    fontSize: '12px',
    width: '200px',
    height: '50px',
    lineHeight: '0',
}));

const FavButton = styled(Button)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    backgroundColor: grey[900],
    '&:hover': {
        color: 'white',
        backgroundColor: '#00e676'
    },
    fontSize: '12px',
    width: '200px',
    height: '50px',
    lineHeight: '0',
    
}));


const FavSolid = styled(GradeIcon)(({ theme }) => ({
    color: theme.palette.secondary.main,
    '&:hover': {
        color: theme.palette.secondary.dark,
        backgroundColor: 'none',
    },
}));
const FavOutlined = styled(GradeOutlinedIcon)(({ theme }) => ({
    color: theme.palette.secondary.main,
    '&:hover': {
        backgroundColor: 'none',
        color: theme.palette.secondary.dark,
    },
}));
const LoadButton = styled(Button)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.secondary.dark,
    '&:hover': {
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.contrastText,
    },
    // padding: theme.spacing(1.2),
}));

const keyConvert = (num) => {
    const chart = {
        '0': 'C',
        '1': 'C# | Db',
        '2': 'D',
        '3': 'D# | Eb',
        '4': 'E',
        '5': 'F',
        '6': 'F# | Gb',
        '7': 'G',
        '8': 'G# | Ab',
        '9': 'A',
        '10': 'A# | Bb',
        '11': 'B',
    }
    if (num in chart) {
        return chart[num];
    }
}
function tempoRound(num) {
    return Math.round(num * 2) / 2;
}

const DisplayData = ({ data, audioData, username, onLoadMore, inputField, userFav }) => {
    const [favoriteMap, setFavoriteMap] = useState({});

    const audioRef = useRef(null);
    useEffect(() => {
        setFavoriteMap(userFav)
    }, [userFav])
    if (!data && !audioData) {
        return null;
    }

    const basicData = data.map((item) => {
        const { name, album, preview_url } = item;
        const artists = item.artists
        const images = album.images[1].url;
        const id = item.id;
        const release_date = item.album.release_date;
        const albums = item.album.name;
        return { name, images, id, preview_url, release_date, artists, albums };
    });

    const audioFeatures = audioData.map((item) => {
        const key = keyConvert(item.key);
        const tempo = tempoRound(item.tempo);
        const loudness = item.loudness;
        const energy = item.energy;
        return { key, tempo, loudness, energy };
    });
    const results = [];
    for (let i = 0; i < basicData.length; i++) {
        const combinedObject = {
            ...basicData[i],
            ...audioFeatures[i]
        };
        results.push(combinedObject);
    }

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
        const { id, name, artists, albums, images, key, tempo, loudness } = item;
        try {
            const response = await fetch('http://localhost:4000/addFavs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, id, name, artists, albums, images, key, tempo, loudness, }),
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
            }
        } catch (error) {
            console.error('Error adding track to favorites:', error);
        }
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {results.length > 0 && (
                <>
                    <h4 style={{ textAlign: 'center', fontSize: '20px' }}>Search Results:</h4>
                    <ul style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0' }}>
                        {results.map((item, index) => (
                            <div key={index} >
                                <Card sx={{ margin: '10px 10px 0' }}>
                                    <Box >
                                        <CardContent sx={{ display: 'flex', flex: '1 0 auto', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '35%' }}>
                                                <Typography component="div" color="text.primary" variant="h5">
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="h6" color="text.secondary" component="div">
                                                    {item.artists.map((artist, index) => (
                                                        <span key={index}>
                                                            {artist.name}
                                                            {index < item.artists.length - 1 && (
                                                                <span style={{ color: '#B3C7ED', fontStyle: 'italic', marginLeft: '5px', marginRight: '5px' }}>|</span>
                                                            )}
                                                        </span>
                                                    ))}
                                                </Typography>
                                                <Typography variant="subtitle1" color="text.secondary" component="div">
                                                    {item.albums}
                                                </Typography>

                                                <CardMedia
                                                    component="img"
                                                    sx={{ width: 151 }}
                                                    image={item.images}
                                                    alt={item.name}
                                                />
                                                <Typography variant="subtitle2" color="text.secondary" component="div" >
                                                    Released: {item.release_date}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '70%', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'row', height: '50%', justifyContent: 'space-around' }}>
                                                    <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        Key
                                                        <Typography className='song-sub-info' variant="h4" color="text.secondary" component="div" sx={{
                                                            "@media (max-width: 600px)": {
                                                                fontSize: '25px'
                                                            }
                                                        }}>
                                                            {item.key}
                                                        </Typography>
                                                    </Typography>

                                                    <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        BPM
                                                        <Typography className='song-sub-info' variant="h4" color="text.secondary" component="div" sx={{
                                                            "@media (max-width: 600px)": {
                                                                fontSize: '25px'
                                                            }
                                                        }}>
                                                            {item.tempo}
                                                        </Typography>
                                                    </Typography>

                                                    <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        Loudness
                                                        <Typography className='song-sub-info' variant="h4" color="text.secondary" component="div" sx={{
                                                            "@media (max-width: 600px)": {
                                                                fontSize: '25px'
                                                            }
                                                        }}>
                                                            {item.loudness}
                                                        </Typography>
                                                    </Typography>

                                                    <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        Energy
                                                        <Typography className='song-sub-info' variant="h4" color="text.secondary" component="div" sx={{
                                                            "@media (max-width: 600px)": {
                                                                fontSize: '25px'
                                                            }
                                                        }}>
                                                            {item.energy}
                                                        </Typography>
                                                    </Typography>
                                                </Box>
                                                <Box className='card-buttons'
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'flex-start',
                                                        marginLeft:'55px',
                            
                                                        // height: '60px',
                                                        // "@media (max-width: 900px)": {
                                                        //     flexDirection: 'column',
                                                        //     alignItems: 'center',
                                                        // }
                                                    }}
                                                >
                                                
                                                    <FavButton
                                                        className='fav-icon-button'
                                                        onClick={() => handleFavorite(item, username)}
                                                        sx={{
                                                            padding: '0',
                                                            paddingRight: '5px',
                                                            display: 'flex',
                                                            justifyContent: "space-evenly",
                                                            marginRight:'55px',
                                                        }}
                                                    >
                                                        {favoriteMap[item.id] ? <FavSolid /> : <FavOutlined />}
                                                        add to Favorites
                                                    </FavButton>
                                                    {item.preview_url && (
                                                        <PlayButton className='preview-button'>
                                                            <PlayArrowIcon aria-label="play/pause"

                                                                onClick={() => playAudio(item.preview_url)}
                                                                sx={{ height: 38, width: 38 }} />
                                                            Preview track
                                                        </PlayButton>
                                                    )}
                                                    <audio ref={audioRef}></audio>

                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Box>
                                </Card>
                                {/* {showCredits && ( */}
                                    <Card sx={{ margin: '0 10px 0',  borderTop: '4px solid black'  }}>
                                        <CardContent sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-evenly',
                                        }}>
                                            
                                            <SearchId id={item.id} name={item.name} artists={item.artists} album={item.albums}  />
                                        </CardContent>
                                    </Card>
                                {/* )} */}
                                <hr />
                            </div>
                        ))}
                    </ul>
                    <div className='loadmore'>
                        <LoadButton
                            onClick={onLoadMore}
                            variant='outlined'
                            size='large'
                            sx={{
                                // display: 'flex',
                                marginBottom: '30px',
                            }}
                        >Load More...
                        </LoadButton>
                    </div>
                </>
            )}
        </div>
    );
};


export default DisplayData;
