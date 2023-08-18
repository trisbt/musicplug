import SearchId from './searchId';
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import { styled } from '@mui/material/styles';
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { Button } from '@mui/material';
import { blueGrey } from '@mui/material/colors';

// const bull = (
//     <Box
//         component="span"
//         sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
//     >
//     </Box>
// );



const PrevButton = styled(Button)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    backgroundColor: blueGrey[500],
    // backgroundColor: theme.palette.primary.dark,
    '&:hover': {
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main,
    },
    fontSize: '12px',
    width: '160px',
    height: '30px',
    marginBottom: '10px',
    lineHeight: '0',

}));

const FavButton = styled(Button)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    backgroundColor: blueGrey[500],
    '&:hover': {
        color: theme.palette.secondary.dark,
        backgroundColor: theme.palette.secondary.main,
    },
    // padding: theme.spacing(1.2),
    marginBottom: '10px',
    marginTop: '10px',
    fontSize: '12px',
    width: '160px',
    height: '30px',
    lineHeight: '0',
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

const DisplayData = ({ data, audioData, username, onLoadMore, inputField, userFav }) => {
    const [favoriteMap, setFavoriteMap] = useState({});
    const theme = useTheme();
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
        const tempo = item.tempo;
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
        <div>
            {results.length > 0 && (
                <>
                    <h4 style={{ textAlign: 'center', fontSize: '20px' }}>Search Results:</h4>
                    <ul>
                        {results.map((item, index) => (
                            <div key={index}>
                                <div className='main-info'>
                                    <Card sx={{ display: 'flex' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <CardContent sx={{ flex: '1 0 auto' }}>
                                                <Typography component="div" variant="h5">
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="subtitle1" color="text.secondary" component="div">
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
                                                <Typography variant="subtitle1" color="text.secondary" component="div">
                                                Released: {item.release_date}
                                                </Typography>
                                                <Typography variant="subtitle1" color="text.secondary" component="div">
                                                Key: {item.key}
                                                </Typography>
                                                <Typography variant="subtitle1" color="text.secondary" component="div">
                                                BPM: {item.tempo} 
                                                </Typography>
                                                <Typography variant="subtitle1" color="text.secondary" component="div">
                                                Loudness: {item.loudness}
                                                </Typography>
                                                <Typography variant="subtitle1" color="text.secondary" component="div">
                                                Energy: {item.energy}
                                                </Typography>
                                                <CardMedia
                                            component="img"
                                            sx={{ width: 151 }}
                                            image={item.images} 
                                            alt={item.name}
                                        />
                                        
                                                <FavButton
                                                    className='fav-icon'
                                                    onClick={() => handleFavorite(item, username)}
                                                    sx={{
                                                        padding: '0',
                                                        display: 'flex',
                                                        justifyContent: "space-evenly",
                                                    }}
                                                >
                                                    {favoriteMap[item.id] ? <FavSolid /> : <FavOutlined />}
                                                    add to Favorites
                                                </FavButton>
                                                <SearchId id={item.id} name={item.name} artists={item.artists} album={item.albums}/>
                                            </CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                                                {item.preview_url && (
                                                    <IconButton>
                                                        <PlayArrowIcon aria-label="play/pause"
                                                            className='preview'
                                                            onClick={() => playAudio(item.preview_url)} 
                                                            sx={{ height: 38, width: 38 }} />
                                                        Preview track
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>
                                       
                                    </Card>
                                    {/* <div className='song-info'>
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
                                    <img className="result-image" src={item.images} alt={item.name} /> */}
                                </div>
                                {/* <div className='audio-features'>
                                    <span>Key: {item.key}</span>
                                    <span>Tempo: {item.tempo}</span>
                                    <span>Loudness: {item.loudness}</span>
                                    <span>Energy: {item.energy}</span>
                                </div> */}
                                {/* <div className='play-star'>
                                    <FavButton
                                        className='fav-icon'
                                        onClick={() => handleFavorite(item, username)}
                                        sx={{
                                            padding: '0',
                                            display: 'flex',
                                            justifyContent: "space-evenly",
                                        }}
                                    >
                                        {favoriteMap[item.id] ? <FavSolid /> : <FavOutlined />}
                                        add to Favorites
                                    </FavButton>
                                    {item.preview_url && (
                                        <PrevButton
                                            className='preview'
                                            onClick={() => playAudio(item.preview_url)}
                                            startIcon={<PlayCircleFilledWhiteOutlinedIcon />} // Replace YourIconComponent with the actual icon you want to use
                                        >
                                            Preview track
                                        </PrevButton>
                                    )}
                                    <audio ref={audioRef}></audio>

                                </div> */}

                                <SearchId id={item.id} name={item.name} artists={item.artists} album={item.albums}/>
                                
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
