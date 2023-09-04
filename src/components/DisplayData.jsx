import { Link } from 'react-router-dom';
import React, { useState, useRef, useEffect, } from 'react';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import { Box, Button, Card, CardContent, CardMedia, Container, Grid, IconButton, styled, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { grey } from '@mui/material/colors';


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

const keyConvert = (num, mode) => {
  const chart = {
    '0': ['C', 'Am'],
    '1': ['Db', 'Bbm'],
    '2': ['D', 'Bm'],
    '3': ['Eb', 'Cm'],
    '4': ['E', 'C#m'],
    '5': ['F', 'Dm'],
    '6': ['Gb', 'Ebm'],
    '7': ['G', 'Em'],
    '8': ['Ab', 'Fm'],
    '9': ['A', 'F#m'],
    '10': ['Bb', 'Gm'],
    '11': ['B', 'G#m'],
  }

  if (mode === 1) {
    return chart[num][0];
  } else if (mode === 0) {
    return chart[num][1];
  } else {
    return "Unknown";
  }
}


function tempoRound(num) {
  return Math.round(num * 2) / 2;
}

const DisplayData = ({ data, audioData, username, onLoadMore, userFav, searchResult }) => {
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
    const { name, album, preview_url, explicit, popularity } = item;
    const artists = item.artists
    const images = album.images[0].url;
    const id = item.id;
    const release_date = item.album.release_date;
    const albums = item.album.name;

    return { name, images, id, preview_url, release_date, artists, albums, explicit, popularity };
  });

  const audioFeatures = audioData.map((item) => {
    if (item) {
      const key = keyConvert(item.key, item.mode);
      const tempo = tempoRound(item.tempo);
      const { loudness, energy, acousticness, analysis_url, danceability, duration_ms, instrumentalness, liveness, time_signature, track_href, uri, valence } = item
      return {
        key,
        tempo,
        loudness,
        energy,
        acousticness,
        analysis_url,
        danceability,
        duration_ms,
        instrumentalness,
        liveness,
        time_signature,
        track_href,
        uri,
        valence,
      };
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

  const playAudio = (event, previewUrl) => {
    event.stopPropagation();
    event.preventDefault();

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

  const handleFavorite = async (event, item, username) => {
    event.stopPropagation();
    event.preventDefault();
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
      <Grid container justifyContent='center' >
        {results.length > 0 && (
          <>
            {/* search result text row */}
            <Grid item xs={12}>
              <h4
                style={{ textAlign: 'center', fontSize: '20px' }}>
                Search Results for {searchResult}:</h4>
            </Grid>

            {/* main search */}
            {results.map((item, index) => (

              <Grid item xs={11} md={8} direction="row" key={index}>
                {/* each card */}
                <Link
                  to={{
                    pathname: `/${encodeURIComponent(item.name)}/${encodeURIComponent(item.artists[0].name)}/${item.id}`,
                  }}
                  state={{
                    songDetails: {
                      id: item.id,
                      name: item.name,
                      artists: item.artists,
                      albums: item.albums,
                      images: item.images,
                      release_date: item.release_date,
                      key: item.key,
                      tempo: item.tempo,
                      loudness: item.loudness,
                      energy: item.energy,
                      acousticness: item.acousticness,
                      analysis_url: item.analysis_url,
                      danceability: item.danceability,
                      duration_ms: item.duration_ms,
                      instrumentalness: item.instrumentalness,
                      liveness: item.liveness,
                      time_signature: item.time_signature,
                      track_href: item.track_href,
                      uri: item.uri,
                      valence: item.valence,
                      explicit: item.explicit,
                      popularity: item.popularity,
                    },
                    username: username
                  }}
                  key={index}
                >

                  {/* <div key={index} > */}
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      margin: '10px 10px 0',
                      boxShadow: 3,
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      }
                    }}
                  >
                    <CardContent sx={{
                      paddingBottom: '10px',
                      '&:last-child': {
                        paddingBottom: '10px',
                      }
                    }}>
                      <Grid container >
                        {/* image */}
                        <Grid item xs={3} sm={2} >
                          <CardMedia
                            component="img"
                            sx={{
                              // width: '80%',
                              "@media (max-width: 600px)": {
                                // width: '100%',
                                // height:'60%'
                              }
                            }}
                            image={item.images}
                            alt={item.name}
                          />
                        </Grid>
                        {/* song info */}
                        <Grid item xs={9} sm={5} sx={{
                          paddingLeft: '.5em',
                        }}>
                          <Typography component="div" color="text.primary" variant="h5" sx={{
                            "@media (max-width: 600px)": {
                              fontSize: '1rem'
                            },
                          }}>
                            {item.name}
                          </Typography>
                          <Typography variant="h6" color="text.secondary" component="div" sx={{
                            "@media (max-width: 600px)": {
                              fontSize: '1rem'
                            },
                          }}>
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
                              fontSize: '.7em',
                            }
                          }}>
                            {item.albums}
                          </Typography>
                        </Grid>

                        <Grid container item xs={12} sm={5} alignItems='center' rowSpacing={1} sx={{
                          "@media (max-width: 600px)": {
                            paddingTop: '.8rem',
                          }
                        }}>
                          <Grid item xs={3} sm={6}  >
                            {/* <Card sx={{ width: '90%' }}> */}
                            <Typography variant="subtitle1" color="text.secondary" component="div"
                              sx={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '0.5rem',
                                "@media (max-width: 600px)": {
                                  fontSize: '.8em',
                                }
                              }}
                            >
                              Key
                              <Typography className='song-sub-info' variant="h4" color="text.primary" component="div" sx={{
                                "@media (max-width: 600px)": {
                                  fontSize: '1.5rem',
                                }
                              }}>
                                {item.key}
                              </Typography>
                            </Typography>
                            {/* </Card> */}
                          </Grid>

                          <Grid item xs={3.5} sm={6} sx={{
                            "@media (max-width: 600px)": {
                              marginRight: '.5em',
                            }
                          }}>
                            {/* <Card sx={{ width: '90%' }}> */}
                            <Typography variant="subtitle1" color="text.secondary" component="div"
                              sx={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '0.5rem',
                                "@media (max-width: 600px)": {
                                  fontSize: '.8em',
                                }
                              }}
                            >
                              BPM
                              <Typography className='song-sub-info' variant="h4" color="text.primary" component="div" sx={{
                                "@media (max-width: 600px)": {
                                  fontSize: '1.5rem',
                                }
                              }}>
                                {item.tempo}
                              </Typography>
                            </Typography>
                            {/* </Card> */}
                          </Grid>

                          {/* fav button */}
                          <Grid item xs={2.5} sm={6} sx={{
                            display: 'flex',
                            justifyContent: 'center'
                          }} >
                            <SmallFavButton
                              size='small'
                              className='small-fav-icon-button'
                              onClick={(event) => handleFavorite(event, item, username)}
                              sx={{
                                boxShadow: 3,
                              }}
                            >
                              {favoriteMap[item.id] ? <FavSolid /> : <FavOutlined />}
                            </SmallFavButton>
                          </Grid>
                          {/* preview button */}
                          <Grid item xs={2.5} sm={6} sx={{
                            display: 'flex',
                            justifyContent: 'center'
                          }} >
                            {item.preview_url && (
                              <SmallPlayButton className='preview-button' sx={{
                                boxShadow: 3,
                                borderRadius: '50px',
                                // display: { xs: 'flex', sm: 'none', md: 'none' },
                              }}
                                onClick={(event) => playAudio(event, item.preview_url)}>
                                {currentlyPlayingUrl === item.preview_url ? (
                                  <>
                                    <StopIcon aria-label="stop"
                                      sx={{
                                        height: 36,
                                        width: 36,
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
                          </Grid>


                          {/* </Grid> */}
                        </Grid>












                        {/* </Box>
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
                                    }
                                  }}
                                > */}

                        {/* <FavButton
                                    variant="elevated"
                                    className='fav-icon-button'
                                    onClick={(event) => handleFavorite(event, item, username)}
                                    sx={{
                                      display: { xs: 'none', sm: 'flex', md: 'flex' },
                                      padding: '0',
                                      paddingRight: '5px',
                                      boxShadow: 3,
                                      justifyContent: "space-evenly",
                                      borderRadius: '50px',

                                      "@media (max-width: 600px)": {
                                        margin: '0 0 10px',
                                      }
                                    }}
                                  >
                                    {favoriteMap[item.id] ? <FavSolid /> : <FavOutlined />}
                                    add to Favorites
                                  </FavButton>

                                  <SmallFavButton
                                    size='small'
                                    className='small-fav-icon-button'
                                    onClick={(event) => handleFavorite(event, item, username)}
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
                                      onClick={(event) => playAudio(event, item.preview_url)}>
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
                                      onClick={(event) => playAudio(event, item.preview_url)}>
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

                              </Box> */}
                      </Grid>
                    </CardContent>

                  </Card>
                  {/* <hr /> */}
                  {/* </div> */}

                </Link>
              </Grid>
            ))}
            {/* </ul> */}

            <Grid xs={12} sx={{
              paddingTop: '1em',
              paddingBottom:'1em',
            }}>
              <div className='loadmore'>
                <LoadButton
                  onClick={onLoadMore}
                  variant='outlined'
                  size='large'
                  sx={{
                    // marginBottom: '30px',
                  }}
                >Load More...
                </LoadButton>
              </div>
            </Grid>
          </>
        )
        }
      </Grid >
    </div >




    // <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', overflow: 'hidden' }}>

    //   <Container maxWidth="xl" sx={{
    //     "@media (max-width: 900px)": {
    //       width: '110vw',
    //     }
    //   }}>
    //     {results.length > 0 && (
    //       <>
    //         <h4 style={{ textAlign: 'center', fontSize: '20px' }}>Search Results for {searchResult}:</h4>
    //         <ul style={{ width: '100%', margin: '0 auto', padding: '0' }}>
    //           {results.map((item, index) => (
    //             <Link
    //               to={{
    //                 pathname: `/${encodeURIComponent(item.name)}/${encodeURIComponent(item.artists[0].name)}/${item.id}`,
    //               }}
    //               state={{
    //                 songDetails: {
    //                   id: item.id,
    //                   name: item.name,
    //                   artists: item.artists,
    //                   albums: item.albums,
    //                   images: item.images,
    //                   release_date: item.release_date,
    //                   key: item.key,
    //                   tempo: item.tempo,
    //                   loudness: item.loudness,
    //                   energy: item.energy,
    //                   acousticness: item.acousticness,
    //                   analysis_url: item.analysis_url,
    //                   danceability: item.danceability,
    //                   duration_ms: item.duration_ms,
    //                   instrumentalness: item.instrumentalness,
    //                   liveness: item.liveness,
    //                   time_signature: item.time_signature,
    //                   track_href: item.track_href,
    //                   uri: item.uri,
    //                   valence: item.valence,
    //                   explicit: item.explicit,
    //                   popularity: item.popularity,
    //                 },
    //                 username: username
    //               }}
    //               key={index}
    //             >
    //               <div key={index} >
    //                 <Card sx={{
    //                   margin: '10px 10px 0',
    //                   boxShadow: 3,
    //                   "&:hover": {
    //                     backgroundColor: "#eee",
    //                   }
    //                 }}
    //                 >
    //                   <Box>
    //                     <CardContent sx={{
    //                       display: 'flex', flex: '1 0 auto', flexDirection: 'row', justifyContent: 'space-between',
    //                     }}>
    //                       <Box sx={{
    //                         display: 'flex', flexDirection: 'column', width: '35%',
    //                         "@media (max-width: 500px)": {
    //                           width: '50%',
    //                         }
    //                       }}>
    //                         <Typography component="div" color="text.primary" variant="h5">
    //                           {item.name}
    //                         </Typography>
    //                         <Typography variant="h6" color="text.secondary" component="div">
    //                           {item.artists.map((artist, index) => (
    //                             <span key={index}>
    //                               {artist.name}
    //                               {index < item.artists.length - 1 && (
    //                                 <span style={{ color: '#B3C7ED', fontStyle: 'italic', marginLeft: '5px', marginRight: '5px' }}>|</span>
    //                               )}
    //                             </span>
    //                           ))}
    //                         </Typography>
    //                         <Typography variant="subtitle1" color="text.secondary" component="div" sx={{
    //                           "@media (max-width: 600px)": {
    //                             fontSize: '13px',
    //                           }
    //                         }}>
    //                           {item.albums}
    //                         </Typography>

    //                         <CardMedia
    //                           component="img"
    //                           sx={{
    //                             width: 151,
    //                             "@media (max-width: 500px)": {
    //                               width: '75%',
    //                               // height: '50%'
    //                             }
    //                           }}
    //                           image={item.images}
    //                           alt={item.name}
    //                         />
    //                         {/* <Typography variant="subtitle2" color="text.secondary" component="div" sx={{
    //                           "@media (max-width: 500px)": {
    //                             fontSize: '10px'
    //                           }
    //                         }} >
    //                           Released: {item.release_date}
    //                         </Typography> */}
    //                       </Box>
    //                       <Box sx={{
    //                         display: 'flex', flexDirection: 'column', width: '70%', justifyContent: 'space-between',
    //                         "@media (max-width: 500px)": {
    //                           justifyContent: 'space-between',
    //                           marginRight: '0',
    //                           width: '50%'
    //                         }
    //                       }}>
    //                         <Box sx={{
    //                           display: 'flex', flexDirection: 'row', height: '100px', justifyContent: 'space-around',
    //                           "@media (max-width: 500px)": {
    //                             display: 'flex',
    //                             justifyContent: 'space-evenly',
    //                             flexFlow: 'row wrap',
    //                             width: '200px',
    //                             height: '260px',
    //                           }
    //                         }}>
    //                           <Typography variant="subtitle1" color="text.secondary" component="div" sx={{
    //                             display: 'flex', flexDirection: 'column', alignItems: 'center',
    //                             "@media (max-width: 600px)": {
    //                               // fontSize: '20px',
    //                               width: '65px',
    //                             }
    //                           }}>
    //                             Key
    //                             <Typography className='song-sub-info' variant="h4" color="text.secondary" component="div" sx={{
    //                               "@media (max-width: 600px)": {
    //                                 fontSize: '20px',
    //                                 display: 'flex',
    //                                 justifyContent: 'center',
    //                                 width: '70px',
    //                               }
    //                             }}>
    //                               {item.key}
    //                             </Typography>
    //                           </Typography>

    //                           <Typography variant="subtitle1" color="text.secondary" component="div" sx={{
    //                             display: 'flex', flexDirection: 'column', alignItems: 'center',
    //                             "@media (max-width: 600px)": {
    //                               // fontSize: '20px',
    //                               width: '65px',
    //                             }
    //                           }}>
    //                             BPM
    //                             <Typography className='song-sub-info' variant="h4" color="text.secondary" component="div" sx={{
    //                               "@media (max-width: 600px)": {
    //                                 fontSize: '20px'
    //                               }
    //                             }}>
    //                               {item.tempo}
    //                             </Typography>
    //                           </Typography>

    //                           {/* <Typography variant="subtitle1" color="text.secondary" component="div" sx={{
    //                             display: 'flex', flexDirection: 'column', alignItems: 'center',
    //                             "@media (max-width: 600px)": {
    //                               // fontSize: '20px',
    //                               width: '95px',
    //                             }
    //                           }}>
    //                             Loudness
    //                             <Typography className='song-sub-info' variant="h4" color="text.secondary" component="div" sx={{
    //                               "@media (max-width: 600px)": {
    //                                 fontSize: '20px'
    //                               }
    //                             }}>
    //                               {item.loudness}
    //                             </Typography>
    //                           </Typography>

    //                           <Typography variant="subtitle1" color="text.secondary" component="div" sx={{
    //                             display: 'flex', flexDirection: 'column', alignItems: 'center',
    //                             "@media (max-width: 600px)": {
    //                               // fontSize: '20px',
    //                               width: '95px',
    //                             }
    //                           }}>
    //                             Energy
    //                             <Typography className='song-sub-info' variant="h4" color="text.secondary" component="div" sx={{
    //                               "@media (max-width: 600px)": {
    //                                 fontSize: '20px'
    //                               }
    //                             }}>
    //                               {item.energy}
    //                             </Typography>
    //                           </Typography> */}
    //                         </Box>
    //                         <Box className='card-buttons'
    //                           sx={{
    //                             display: 'flex',
    //                             flexDirection: 'row',
    //                             justifyContent: item.preview_url ? 'space-evenly' : 'center',
    //                             "@media (max-width: 600px)": {
    //                               alignItems: 'flex-end',
    //                               justifyContent: 'space-between',
    //                               height: '45px',
    //                               width: '110px',
    //                             }
    //                           }}
    //                         >

    //                           <FavButton
    //                             variant="elevated"
    //                             className='fav-icon-button'
    //                             onClick={(event) => handleFavorite(event, item, username)}
    //                             sx={{
    //                               display: { xs: 'none', sm: 'flex', md: 'flex' },
    //                               padding: '0',
    //                               paddingRight: '5px',
    //                               boxShadow: 3,
    //                               justifyContent: "space-evenly",
    //                               borderRadius: '50px',

    //                               "@media (max-width: 600px)": {
    //                                 margin: '0 0 10px',
    //                               }
    //                             }}
    //                           >
    //                             {favoriteMap[item.id] ? <FavSolid /> : <FavOutlined />}
    //                             add to Favorites
    //                           </FavButton>

    //                           <SmallFavButton
    //                             size='small'
    //                             className='small-fav-icon-button'
    //                             onClick={(event) => handleFavorite(event, item, username)}
    //                             sx={{
    //                               display: { xs: 'flex', sm: 'none', md: 'none' },
    //                               padding: '0',
    //                               boxShadow: 3,
    //                               justifyContent: "space-evenly",
    //                               borderRadius: '50px',
    //                             }}
    //                           >
    //                             {favoriteMap[item.id] ? <FavSolid /> : <FavOutlined />}
    //                           </SmallFavButton>

    //                           {item.preview_url && (
    //                             <PlayButton className='preview-button' sx={{
    //                               boxShadow: 3,
    //                               borderRadius: '50px',
    //                               display: { xs: 'none', sm: 'flex', md: 'flex' },
    //                             }}
    //                               onClick={(event) => playAudio(event, item.preview_url)}>
    //                               {currentlyPlayingUrl === item.preview_url ? (
    //                                 <>
    //                                   <StopIcon aria-label="stop"
    //                                     sx={{
    //                                       height: 35,
    //                                       width: 35,
    //                                     }}
    //                                   />
    //                                   Stop track
    //                                 </>
    //                               ) : (
    //                                 <>
    //                                   <PlayArrowIcon aria-label="play/pause"
    //                                     sx={{
    //                                       height: 35,
    //                                       width: 35,
    //                                     }}
    //                                   />
    //                                   Preview track
    //                                 </>
    //                               )}
    //                             </PlayButton>
    //                           )}

    //                           {item.preview_url && (
    //                             <SmallPlayButton className='preview-button' sx={{
    //                               boxShadow: 3,
    //                               borderRadius: '50px',
    //                               display: { xs: 'flex', sm: 'none', md: 'none' },
    //                             }}
    //                               onClick={(event) => playAudio(event, item.preview_url)}>
    //                               {currentlyPlayingUrl === item.preview_url ? (
    //                                 <>
    //                                   <StopIcon aria-label="stop"
    //                                     sx={{
    //                                       height: 35,
    //                                       width: 35,
    //                                     }}
    //                                   />
    //                                 </>
    //                               ) : (
    //                                 <>
    //                                   <PlayArrowIcon aria-label="play/pause"
    //                                     sx={{
    //                                       height: 35,
    //                                       width: 35,
    //                                     }}
    //                                   />
    //                                 </>
    //                               )}
    //                             </SmallPlayButton>
    //                           )}
    //                           <audio ref={audioRef}></audio>
    //                         </Box>

    //                       </Box>
    //                     </CardContent>
    //                   </Box>
    //                 </Card>
    //                 {/* <Card sx={{
    //                   margin: '0 10px 0', borderTop: '1px solid grey', boxShadow: 3,
    //                   "@media (max-width: 600px)": {
    //                     display: 'flex',
    //                     flexDirection: 'column',
    //                     justifyContent: 'flex-start',

    //                   }
    //                 }}>
    //                   <CardContent sx={{
    //                     display: 'flex',
    //                     flexDirection: 'row',
    //                     justifyContent: 'space-evenly',

    //                   }}>
    //                     <SearchId id={item.id} name={item.name} artists={item.artists} album={item.albums} />
    //                   </CardContent>
    //                 </Card> */}
    //                 <hr />
    //               </div>
    //             </Link>
    //           ))}
    //         </ul>
    //         <div className='loadmore'>
    //           <LoadButton
    //             onClick={onLoadMore}
    //             variant='outlined'
    //             size='large'
    //             sx={{
    //               // display: 'flex',
    //               marginBottom: '30px',
    //             }}
    //           >Load More...
    //           </LoadButton>
    //         </div>
    //       </>
    //     )
    //     }
    //   </Container >

    // </div >
  );
};


export default DisplayData;
