import SearchId from './searchId';
import React, { useState, useRef, useEffect } from 'react';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { Button } from '@mui/material';
import { IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';




const PlayButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: grey[900],
  '&:hover': {
    color: 'white',
    backgroundColor: '#00e676'
  },
  fontSize: '15px',
  width: '200px',
  height: '50px',
  lineHeight: '0',
}));

const SmallPlayButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: grey[900],
  '&:hover': {
    color: 'white',
    backgroundColor: '#00e676'
  },
  fontSize: '15px',
  width: '40px',
  height: '40px',
}));


const FavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: grey[900],
  '&:hover': {
    color: 'white',
    backgroundColor: '#00e676'
  },
  fontSize: '15px',
  width: '200px',
  height: '50px',
  lineHeight: '0',

}));

const SmallFavButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: grey[900],
  '&:hover': {
    color: 'white',
    backgroundColor: '#00e676'
  },
  fontSize: '15px',
  width: '40px',
  height: '40px',
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
  if (String(num) in chart) {
    return chart[String(num)];
  }
}
function tempoRound(num) {
  return Math.round(num * 2) / 2;
}

const DisplayData = ({ data, audioData, username, onLoadMore, inputField, userFav }) => {
  const [favoriteMap, setFavoriteMap] = useState({});
  const [currentlyPlayingUrl, setCurrentlyPlayingUrl] = useState(null);
  const audioRef = useRef(null);

  //needed to show user favorites in search results
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
    if (item) {
      const key = keyConvert(item.key);
      const tempo = tempoRound(item.tempo);
      const loudness = item.loudness;
      const energy = item.energy;

      return { key, tempo, loudness, energy };
    } else {
      return {};
    }
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
        setCurrentlyPlayingUrl(null);
      } else {
        if (!audioRef.current.paused) {
          // Stop currently playing audio if there is any
          audioRef.current.pause();
        }
        audioRef.current.src = previewUrl;
        audioRef.current.play();
        setCurrentlyPlayingUrl(previewUrl);
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', overflow:'hidden' }}>
      <Container maxWidth="xl" sx={{
        "@media (max-width: 900px)": {
          width: '110vw',
        }
      }}>
        {results.length > 0 && (
          <>
            <h4 style={{ textAlign: 'center', fontSize: '20px' }}>Search Results:</h4>
            <ul style={{ width: '100%', margin: '0 auto', padding: '0' }}>
              {results.map((item, index) => (
                <div key={index} >
                  <Card sx={{
                    margin: '10px 10px 0',
                    boxShadow: 3,

                  }}
                  >
                    <Box>
                      <CardContent sx={{
                        display: 'flex', flex: '1 0 auto', flexDirection: 'row', justifyContent: 'space-between',
                      }}>
                        <Box sx={{
                          display: 'flex', flexDirection: 'column', width: '35%',
                          "@media (max-width: 500px)": {
                            width: '50%',
                          }
                        }}>
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
                          <Typography variant="subtitle1" color="text.secondary" component="div" sx={{
                            "@media (max-width: 600px)": {
                              fontSize: '13px',
                            }
                          }}>
                            {item.albums}
                          </Typography>

                          <CardMedia
                            component="img"
                            sx={{
                              width: 151,
                              "@media (max-width: 500px)": {
                                width: '75%',
                                height: '50%'
                              }
                            }}
                            image={item.images}
                            alt={item.name}
                          />
                          <Typography variant="subtitle2" color="text.secondary" component="div" sx={{
                            "@media (max-width: 500px)": {
                              fontSize: '10px'
                            }
                          }} >
                            Released: {item.release_date}
                          </Typography>
                        </Box>
                        <Box sx={{
                          display: 'flex', flexDirection: 'column', width: '70%', justifyContent: 'space-between',
                          "@media (max-width: 500px)": {
                            justifyContent: 'space-between',
                            marginRight: '0',
                            width: '50%'
                          }
                        }}>
                          <Box sx={{
                            display: 'flex', flexDirection: 'row', height: '100px', justifyContent: 'space-around',
                            "@media (max-width: 500px)": {
                              display: 'flex',
                              justifyContent: 'space-evenly',
                              flexFlow: 'row wrap',
                              width: '200px',
                              height: '260px',
                            }
                          }}>
                            <Typography variant="subtitle1" color="text.secondary" component="div" sx={{
                              display: 'flex', flexDirection: 'column', alignItems: 'center',
                              "@media (max-width: 600px)": {
                                // fontSize: '20px',
                                width: '65px',
                              }
                            }}>
                              Key
                              <Typography className='song-sub-info' variant="h4" color="text.secondary" component="div" sx={{
                                "@media (max-width: 600px)": {
                                  fontSize: '20px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  width: '70px',
                                }
                              }}>
                                {item.key}
                              </Typography>
                            </Typography>

                            <Typography variant="subtitle1" color="text.secondary" component="div" sx={{
                              display: 'flex', flexDirection: 'column', alignItems: 'center',
                              "@media (max-width: 600px)": {
                                // fontSize: '20px',
                                width: '65px',
                              }
                            }}>
                              BPM
                              <Typography className='song-sub-info' variant="h4" color="text.secondary" component="div" sx={{
                                "@media (max-width: 600px)": {
                                  fontSize: '20px'
                                }
                              }}>
                                {item.tempo}
                              </Typography>
                            </Typography>

                            <Typography variant="subtitle1" color="text.secondary" component="div" sx={{
                              display: 'flex', flexDirection: 'column', alignItems: 'center',
                              "@media (max-width: 600px)": {
                                // fontSize: '20px',
                                width: '95px',
                              }
                            }}>
                              Loudness
                              <Typography className='song-sub-info' variant="h4" color="text.secondary" component="div" sx={{
                                "@media (max-width: 600px)": {
                                  fontSize: '20px'
                                }
                              }}>
                                {item.loudness}
                              </Typography>
                            </Typography>

                            <Typography variant="subtitle1" color="text.secondary" component="div" sx={{
                              display: 'flex', flexDirection: 'column', alignItems: 'center',
                              "@media (max-width: 600px)": {
                                // fontSize: '20px',
                                width: '95px',
                              }
                            }}>
                              Energy
                              <Typography className='song-sub-info' variant="h4" color="text.secondary" component="div" sx={{
                                "@media (max-width: 600px)": {
                                  fontSize: '20px'
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
                              justifyContent: item.preview_url ? 'space-evenly' : 'center',
                              "@media (max-width: 600px)": {
                                alignItems: 'flex-end',
                                justifyContent: 'space-between',
                                height: '45px',
                                width: '110px',
                                // flexDirection: 'column',
                                // alignItems: 'center',
                              }
                            }}
                          >
                            <FavButton
                              variant="elevated"
                              className='fav-icon-button'
                              onClick={() => handleFavorite(item, username)}
                              // noWrap
                              sx={{
                                display: { xs: 'none', sm: 'flex', md: 'flex' },
                                padding: '0',
                                paddingRight: '5px',
                                boxShadow: 3,
                                justifyContent: "space-evenly",
                                borderRadius: '50px',

                                "@media (max-width: 600px)": {
                                  margin: '0 0 10px',
                                  // width:'100px',
                                }
                              }}
                            >
                              {favoriteMap[item.id] ? <FavSolid /> : <FavOutlined />}
                              add to Favorites
                            </FavButton>

                            <SmallFavButton
                              size='small'
                              className='small-fav-icon-button'
                              // noWrap
                              onClick={() => handleFavorite(item, username)}
                              sx={{
                                display: { xs: 'flex', sm: 'none', md: 'none' },
                                padding: '0',
                                boxShadow: 3,
                                justifyContent: "space-evenly",
                                borderRadius: '50px',
                              }}
                            >
                              {favoriteMap[item.id] ? <FavSolid /> : <FavOutlined />}
                            </SmallFavButton>

                            {item.preview_url && (
                              <PlayButton className='preview-button' sx={{
                                boxShadow: 3,
                                borderRadius: '50px',
                                display: { xs: 'none', sm: 'flex', md: 'flex' },
                              }}
                                onClick={() => playAudio(item.preview_url)}>
                                {currentlyPlayingUrl === item.preview_url ? (
                                  <>
                                    <StopIcon aria-label="stop"
                                      sx={{
                                        height: 35,
                                        width: 35,
                                      }}
                                    />
                                    Stop track
                                  </>
                                ) : (
                                  <>
                                    <PlayArrowIcon aria-label="play/pause"
                                      sx={{
                                        height: 35,
                                        width: 35,
                                      }}
                                    />
                                    Preview track
                                  </>
                                )}
                              </PlayButton>
                            )}

                            {item.preview_url && (
                              <SmallPlayButton className='preview-button' sx={{
                                boxShadow: 3,
                                borderRadius: '50px',
                                display: { xs: 'flex', sm: 'none', md: 'none' },
                              }}
                                onClick={() => playAudio(item.preview_url)}>
                                {currentlyPlayingUrl === item.preview_url ? (
                                  <>
                                    <StopIcon aria-label="stop"
                                      sx={{
                                        height: 35,
                                        width: 35,
                                      }}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <PlayArrowIcon aria-label="play/pause"
                                      sx={{
                                        height: 35,
                                        width: 35,
                                      }}
                                    />
                                  </>
                                )}
                              </SmallPlayButton>
                            )}
                            <audio ref={audioRef}></audio>
                          </Box>

                        </Box>
                      </CardContent>
                    </Box>
                  </Card>
                  <Card sx={{
                    margin: '0 10px 0', borderTop: '1px solid grey', boxShadow: 3,
                    "@media (max-width: 600px)": {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',

                    }
                  }}>
                    <CardContent sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',

                    }}>
                      <SearchId id={item.id} name={item.name} artists={item.artists} album={item.albums} />
                    </CardContent>
                  </Card>
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
        )
        }
      </Container >
    </div >
  );
};


export default DisplayData;
