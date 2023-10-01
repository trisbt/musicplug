import { Link, useLocation } from 'react-router-dom';
import React, { useState, useRef, useEffect, } from 'react';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import { Button, Card, CardContent, CardMedia, Checkbox, FormGroup, FormControlLabel, Grid, IconButton, styled, Typography, Theme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { grey } from '@mui/material/colors';
import { Artist, DataItem, AudioDataItem, ResultItem } from '@appTypes/dataTypes';
import CircleOfFifths from './CircleOfFifths';

interface KeyMapping {
  [key: number]: [string, string];
}
type KeyConvertFunction = (num: number, mode: number) => string;

type CombinedDataType = DataItem & AudioDataItem;

interface DisplayDataProps {
  data: DataItem[];
  audioData: AudioDataItem[];
  username?: string | null;
  // onLoadMore: () => void;
  userFav?: Record<string, boolean>;
  searchResult: string;
  theme?: Theme;
}

//styled buttons
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
const CustomAccordion = styled(Accordion)(({ theme }) => ({
  '& .MuiAccordionSummary-root': {
    padding: theme.spacing(0, 1),
    minHeight: '24px',
    '& .MuiAccordionSummary-content': {
      margin: theme.spacing(0.5, 0),
    },
  },
  '& .MuiAccordionDetails-root': {
    padding: theme.spacing(1),
  },
}));
const OverlayAccordionDetails = styled(AccordionDetails)({
  position: 'absolute',
  zIndex: 2,
  left: '100%',
  transform: 'translateX(-50%)', // Shift it back by half of its width
  width: '300px',
  background: 'transparent',
  // boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
});
const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  '&.Mui-expanded': {
    minHeight: 'initial',  // Or a specific height value if desired.
  },
  '& > .MuiAccordionSummary-content': {
    margin: '0px',
    '&.Mui-expanded': {
      margin: '0px',
    }
  }
}));


const Overlay = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backdropFilter: 'blur(5px)', // This applies the blur effect
  pointerEvents: 'none',  // Ensure it doesn't block any user interactions
  zIndex: 1,  // Ensure it stays below the accordion details
});

//bpm and key helper conversions
const keyConvert: KeyConvertFunction = (num: number, mode: number): string => {
  const chart: KeyMapping = {
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
function tempoRound(num: number): number {
  return Math.round(num * 2) / 2;
}

const DisplayData: React.FC<DisplayDataProps> = ({ handleLoadMore, data, audioData, username, userFav, searchResult, }) => {
  const [favoriteMap, setFavoriteMap] = useState<Record<string, boolean>>({});
  const [currentlyPlayingUrl, setCurrentlyPlayingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();
  const [isAnyAccordionActive, setIsAnyAccordionActive] = useState(false);
  const [activeSlice, setActiveSlice] = useState<string | null>(null);

  //needed to show user favorites in search results
  useEffect(() => {
    if (searchResult) {
      document.title = `MusicPlug: results for ${searchResult} `;
    }
    if (username && userFav) {
      setFavoriteMap(userFav);
    }
  }, [userFav, username, searchResult]);

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

  const results: ResultItem[] = [];

  for (let i = 0; i < basicData.length; i++) {
    const combinedObject = {
      ...basicData[i],
      ...audioFeatures[i]
    };
    results.push(combinedObject);
  }

  const playAudio = (event: React.MouseEvent, previewUrl: string | null) => {
    event.stopPropagation();
    event.preventDefault();
    if (audioRef.current && previewUrl) {
      audioRef.current.volume = .3;

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

  interface HandleFavoriteItem {
    id: string;
    name: string;
    artists: string[];
    albums: string;
    images: string;
    key: string;
    tempo: number;
    loudness: number;
  }

  const handleFavorite = async (event: React.MouseEvent, item, username: string) => {
    event.stopPropagation();
    event.preventDefault();
    const { id, name, artists, albums, images, key, tempo, loudness } = item;
    try {
      const response = await fetch('/api/addFavs', {
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

  const handleAccordionToggle = (event, expanded) => {
    setIsAnyAccordionActive(expanded);
  };

  return (
    <div>
      <Grid container item xs={12} justifyContent='center' >
        {location.search && results.length > 0 && (
          <>
            {/* search result text row */}
            <Grid item xs={12} sx={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              textAlign: 'center',
              fontSize: '20px',
              color: 'white',
            }}>
              Search Results for {searchResult}:
            </Grid>
            {/* filters row */}
            <Grid container justifyContent='center' xs={12}>
              <Grid item xs={2}>
                <CustomAccordion >
                  <StyledAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography fontSize='0.8rem' >Key</Typography>
                  </StyledAccordionSummary>
                  <OverlayAccordionDetails sx={{
                    width: '300px'
                  }}>
                    <CircleOfFifths activeSlice={activeSlice} setActiveSlice={setActiveSlice} />
                  </OverlayAccordionDetails>
                </CustomAccordion>
              </Grid>
              <Grid item xs={2}>
                <CustomAccordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography fontSize='0.8rem' >BPM</Typography>
                  </AccordionSummary>
                  <OverlayAccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                      malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                  </OverlayAccordionDetails>
                </CustomAccordion>
              </Grid>

            </Grid>

            {/* main search */}
            {results
              .filter(item => !activeSlice || item.key === activeSlice)
              .map((item: ResultItem, index: number) => (
                <Grid className='results' item xs={11} md={8} key={index}>
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
                        preview_url: item.preview_url,
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
                      username: username,
                      isFavorite: favoriteMap[item.id] || false,
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
                        paddingBottom: '15px',
                        '&:last-child': {
                          paddingBottom: '15px',
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
                            }}>
                              {username && (
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
                              )}
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
                                  onClick={(event) => playAudio(event, item.preview_url || null)}
                                >
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
                        </Grid>
                      </CardContent>

                    </Card>


                  </Link>
                </Grid>
              ))}


            <Grid item xs={12} sx={{
              paddingTop: '1em',
              paddingBottom: '1em',
            }}>
              <div className='loadmore'>
                <LoadButton
                  onClick={() => handleLoadMore()}
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
  );
};


export default DisplayData;
