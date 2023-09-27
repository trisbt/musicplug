import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams, useLoaderData } from 'react-router-dom';
import { createTheme, Box, Button, Card, CardContent, CardMedia, Grid, IconButton, styled, Typography, Theme } from '@mui/material';
import DisplayData from './DisplayData';
import { Link } from 'react-router-dom';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { grey } from '@mui/material/colors';
import { Artist, DataItem, AudioDataItem, ResultItem } from '@appTypes/dataTypes';

interface KeyMapping {
  [key: number]: [string, string];
}
type KeyConvertFunction = (num: number, mode: number) => string;

type CombinedDataType = DataItem & AudioDataItem;

interface DisplayDataProps {
  data: DataItem[];
  audioData: AudioDataItem[];
  username?: string | null;
  onLoadMore: () => void;
  userFav?: Record<string, boolean>;
  searchResult: string;
  customStyles?: React.CSSProperties;
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

const TopTracks = ({ username }) => {
  // const topTracksLoaded = useLoaderData();
  const [combinedTracks, setCombinedTracks] = useState([]);
  const [topUserFav, setTopUserFav] = useState([]);
  const [currentlyPlayingUrl, setCurrentlyPlayingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  // console.log('top', topTracksLoaded)

  useEffect(() => {
    async function fetchData() {
      try {
        const [topTracksResponse, favsResponse] = await Promise.all([
          fetch('/api/toptracks'),
          username ? fetch('/api/favs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
            credentials: 'include',
          }) : Promise.resolve(null)
        ]);

        const rawCombinedData = await topTracksResponse.json();

        const processedData = rawCombinedData.map(item => {
          const { name, preview_url, explicit, popularity, artists, id } = item;
          const images = item.album.images[0].url;
          const release_date = item.album.release_date;
          const albums = item.album.name;
          const key = keyConvert(item.key, item.mode);
          const tempo = tempoRound(item.tempo);
          const { loudness, energy, acousticness, analysis_url, danceability, duration_ms, instrumentalness, liveness, time_signature, track_href, uri, valence } = item;

          return {
            name, images, id, preview_url, release_date, artists, albums, explicit, popularity,
            key, tempo, loudness, energy, acousticness, analysis_url, danceability, duration_ms, instrumentalness, liveness, time_signature, track_href, uri, valence
          };
        });
        // console.log(processedData);
        setCombinedTracks(processedData);

        if (username) {
          const favData = await favsResponse?.json();
          const favArray = favData.favorites.map(el => el.id);
          const obj = {};
          for (const el of favArray) {
            if (!obj[el]) {
              obj[el] = true;
            }
          }
          setTopUserFav(obj);
        }

      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

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
        setTopUserFav((prevMap) => ({
          ...prevMap,
          [id]: true,
        }));
        // remove like
      } else {
        setTopUserFav((prevMap) => ({
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

      <Box>
        <Grid container item xs={12} justifyContent='center' alignItems='center' >
          {combinedTracks.length > 0 && (
            <>
              {/* text row */}
              <Grid item xs={11} md={8}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    margin: '10px 10px 0',
                    boxShadow: 3,
                    justifyContent: 'center',
                    backgroundColor: 'rgb(0, 71, 212, .6)',

                  }}
                >
                  <Typography variant='h4' sx={{
                    display: 'flex',

                    alignItems: 'center',
                    color: '#e8eaf6',
                    fontWeight: 'bold',
                    background: '#e8eaf6',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '1px',
                    borderRadius: '2px',
                    textTransform: 'uppercase',
                    '@media (max-width: 600px)': {
                      fontSize: '24px'
                    },
                  }}>
                    Daily Top Tracks
                  </Typography>
                </Card>
              </Grid>

              {/* main search */}
              {combinedTracks.map((item: ResultItem, index: number) => (

                <Grid item xs={11} md={8} key={index}>
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
                      isFavorite: topUserFav[item.id] || false,
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
                                  {topUserFav[item.id] ? <FavSolid /> : <FavOutlined />}
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
            </>
          )
          }
        </Grid >
      </Box>
    </div >
  );

}
export default TopTracks;

// export const topTracksLoader = async () => {
//   const res = await fetch('/api/toptracks');

//   if (!res.ok) {
//     throw new Error('Network response was not ok');
//   }

//   const data = await res.json();

//   const processedData = data.map(item => {
//     const {
//       name,
//       preview_url,
//       explicit,
//       popularity,
//       artists,
//       id,
//       album: {
//         images,
//         release_date,
//         name: albums
//       },
//       key: itemKey,
//       mode: itemMode,
//       tempo: itemTempo,
//       loudness,
//       energy,
//       acousticness,
//       analysis_url,
//       danceability,
//       duration_ms,
//       instrumentalness,
//       liveness,
//       time_signature,
//       track_href,
//       uri,
//       valence
//     } = item;

//     const key = keyConvert(itemKey, itemMode);
//     const tempo = tempoRound(itemTempo);

//     return {
//       name,
//       images: images[0].url,
//       id,
//       preview_url,
//       release_date,
//       artists,
//       albums,
//       explicit,
//       popularity,
//       key,
//       tempo,
//       loudness,
//       energy,
//       acousticness,
//       analysis_url,
//       danceability,
//       duration_ms,
//       instrumentalness,
//       liveness,
//       time_signature,
//       track_href,
//       uri,
//       valence
//     };
//   });

//   return processedData;
// }



