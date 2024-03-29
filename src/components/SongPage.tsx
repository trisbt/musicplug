import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Card, CardMedia, CardContent, createTheme, Fade, Grid, IconButton, LinearProgress, Modal, Paper, styled, Typography, } from '@mui/material';
import { useParams, useLocation, Link } from 'react-router-dom';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { grey } from '@mui/material/colors';
import SearchCredits from './SearchCredits';
import SearchData from './SearchData';
import SearchByIdOrArtistSong from '../utils/SearchByIdOrArtistSong';
import { Artist, LocationState, ResultItem, SongDetails, SongPageProps } from '@appTypes/dataTypes';



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
  width: '50px',
  height: '50px',
}));

const transformSpotifyURItoURL = (uri) => {
  const match = uri.match(/spotify:track:([a-zA-Z0-9]+)/);

  if (match && match[1]) {
      return `https://open.spotify.com/track/${match[1]}`;
  }
  return null; // or throw an error or return the original URI, as per your needs
}


//progress value color function
function determineColor(value: number): string {
  if (value > 80) {
    return 'linear-gradient(to right, rgba(66,187,7,0.7595413165266106) 0%, rgba(149,255,2,0.7595413165266106) 100%)';
  } else if (value > 50) {
    return 'linear-gradient(to right, #f9a825, #ffea00)';
  } else if (value >= 25 && value < 50) {
    return 'linear-gradient(to right, #e65100, #ff9800)';
  } else {
    return 'linear-gradient(to right, rgba(184,4,4,0.7595413165266106) 0%, rgba(255,2,2,0.7595413165266106) 100%)';
  }
}
//convert song duration format
const msConvert = (num: number): string => {
  let totalSeconds = Math.floor(num / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  let formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
  return minutes + ':' + formattedSeconds;
}

//main page func
const SongPage = (props: SongPageProps) => {
  const location = useLocation();
  const state = location.state as LocationState;
  const [open, setOpen] = useState<boolean>(false);
  const [aliasFromChild, setAliasFromChild] = useState<string | null>(null);
  const [currentlyPlayingUrl, setCurrentlyPlayingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [fetchedData, setFetchedData] = useState<{ songDetails: ResultItem} | null>(null);
  const { id, name, artist } = useParams();
  const dataToUse = state || fetchedData;
  const songDetails = dataToUse?.songDetails;


    //for navigation directly to page
    useEffect(() => {
      if (!state) {
        async function fetchData() {
          const data = await SearchByIdOrArtistSong({ id: id});
          setFetchedData(data);
        }
        fetchData();
      }
    }, [state, id]);

  const playAudio = (event: React.MouseEvent, previewUrl: string | null) => {
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

  //can show aliases for artist not used from songid
  const handleAlias = (alias: string[]) => {
    console.log(alias.join(', ').replace(/\s?\(.*?\)\s?/g, ''));
    setAliasFromChild(alias.join(', ').replace(/\s?\(.*?\)\s?/g, ''));
  };

  //handles for img modal
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#f5f5f5',
    ...theme.typography.body1,

    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <div className='song-page-container'>
      {songDetails && (
        <Card sx={{
          width: '90vw',
          // height: '100vh',
          overflowY: 'visible',
          maxHeight: 'inherit',
          borderRadius: '0',
          paddingTop: '3px',
          paddingLeft: '5px',
          paddingRight: '5px',
          paddingBottom: '5px'
        }}>
          <Grid item container xs={12} direction='row' justifyContent="center" padding='0'
            sx={{
              // backgroundColor:'#1a237e',
              width: '100vw',
              height: '8vh',
              alignItems: 'center',
              padding: '0',

            }}>
          </Grid>

          {/* top row */}
          <Grid item container xs={12} direction='row' justifyContent="center" sx={{
            padding: '1em',
          }}>
            {/* First Row - Image and Song Details */}
            <Grid container item xs={12} spacing={2} >
              {/* image and modal */}
              <Grid
                item xs={12} sm={5} md={4} lg={3}
              >
                <CardMedia
                  component="img"
                  onClick={handleOpen}
                  sx={{
                    cursor: 'pointer',
                    boxShadow: 2,
                    "@media (max-width: 500px)": {
                      width: '75%',
                    }
                  }}
                  image={songDetails.images}
                  alt={songDetails.name}
                />
                <Modal
                  open={open}
                  onClose={handleClose}
                  closeAfterTransition
                  BackdropProps={{
                    timeout: 500,
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Fade in={open}>
                    <img
                      src={songDetails.images}
                      alt={songDetails.name}
                      style={{ width: '50%', height: 'auto', boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.5)', }}
                    />
                  </Fade>
                </Modal>
              </Grid>

              {/* song info */}
              <Grid item container xs={12} sm={7} md={7.5} lg={9} direction="column" justifyContent="space-between" >

                <Grid item >
                  <Typography variant="h5" color='text.primary'>{songDetails.name}</Typography>
                  <Typography variant="h4">{songDetails.artists[0]?.name}</Typography>
                  <Typography variant="subtitle1">{songDetails.albums}</Typography>
                  <Typography variant="subtitle2">Released: {songDetails.release_date}</Typography>
                  <Typography>{aliasFromChild}</Typography>

                  <Grid item container xs={12} alignItems='center' justifyContent='space-between' >

                    {/*link spotify render*/}
                    <Link to={transformSpotifyURItoURL(songDetails.uri)}>
                      <svg
                        style={{ marginLeft: '-8px', paddingTop: '5px' }}
                        xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 24 24">
                        <path fill="#00e676" d="M17.9 10.9C14.7 9 9.35 8.8 6.3 9.75c-.5.15-1-.15-1.15-.6c-.15-.5.15-1 .6-1.15c3.55-1.05 9.4-.85 13.1 1.35c.45.25.6.85.35 1.3c-.25.35-.85.5-1.3.25m-.1 2.8c-.25.35-.7.5-1.05.25c-2.7-1.65-6.8-2.15-9.95-1.15c-.4.1-.85-.1-.95-.5c-.1-.4.1-.85.5-.95c3.65-1.1 8.15-.55 11.25 1.35c.3.15.45.65.2 1m-1.2 2.75c-.2.3-.55.4-.85.2c-2.35-1.45-5.3-1.75-8.8-.95c-.35.1-.65-.15-.75-.45c-.1-.35.15-.65.45-.75c3.8-.85 7.1-.5 9.7 1.1c.35.15.4.55.25.85M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z" />
                      </svg>
                    </Link>

                    {/*play button render*/}
                    {songDetails.preview_url && (
                      <PlayButton className='preview-button' sx={{
                        boxShadow: 3,
                        borderRadius: '50px',
                        display: { xs: 'none', sm: 'none', md: 'flex' },
                      }}
                        onClick={(event) => playAudio(event, songDetails.preview_url)}>
                        {currentlyPlayingUrl === songDetails.preview_url ? (
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
                    <audio ref={audioRef}></audio>


                    {/*small play button render*/}
                    {songDetails.preview_url && (
                      <SmallPlayButton className='preview-button' sx={{
                        display: { xs: 'flex', sm: 'flex', md: 'none' },
                        boxShadow: 3,
                        width: '3.5em',
                        height: '3.5em',
                      }}
                        onClick={(event) => playAudio(event, songDetails.preview_url)}>
                        {currentlyPlayingUrl === songDetails.preview_url ? (
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
                </Grid>

                {/* Other Details, shows inline with song details on large screens */}
                <Grid container item spacing={2} xs={1} justifyContent='center' sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' } }}>
                  <Grid item xs={3} >
                    <Item>
                      Key
                      <Typography variant="h5" color='text.primary' >{songDetails.key}</Typography>
                    </Item>
                  </Grid>
                  <Grid item xs={3}>
                    <Item>
                      Tempo
                      <Typography variant="h5" color='text.primary' >{songDetails.tempo}</Typography>
                    </Item>
                  </Grid>
                  <Grid item xs={3}>
                    <Item>
                      Duration
                      <Typography variant="h5" color='text.primary' >{msConvert(songDetails.duration_ms)}</Typography>
                    </Item>
                  </Grid>
                  <Grid item xs={3}>
                    <Item>
                      Time Signature
                      <Typography variant="h5" color='text.primary' >{`${songDetails.time_signature} / 4`}</Typography>
                    </Item>
                  </Grid>

                </Grid>

              </Grid>

              {/* Other Details, shows flex with song details on smaller screens */}
              <Grid container item xs={12} spacing={2} sx={{ display: { xs: 'flex', sm: 'flex', md: 'flex', lg: 'none' } }}>
                <Grid item xs={6} md={3} >
                  <Item>
                    Key
                    <Typography variant="h5" color='text.primary' >{songDetails.key}</Typography>
                  </Item>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Item>
                    Tempo
                    <Typography variant="h5" color='text.primary' >{songDetails.tempo}</Typography>
                  </Item>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Item>
                    Duration
                    <Typography variant="h5" color='text.primary' >{msConvert(songDetails.duration_ms)}</Typography>
                  </Item>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Item>
                    Time Signature
                    <Typography variant="h5" color='text.primary' >{`${songDetails.time_signature} / 4`}</Typography>
                  </Item>
                </Grid>

              </Grid>

            </Grid>
          </Grid>

          {/* analysis row */}
          <Grid item container xs={12} justifyContent='center' >

            <Grid item container xs={12} md={6}>
              <CardContent sx={{
                // backgroundColor: 'green',
                width: '100vw',
              }}>

                {/* loudness */}
                <Grid item container direction="row" xs={12} alignItems='center'>
                  <Grid item xs={3} sm={2} md={3}>
                    <Typography variant="subtitle2" color='text.primary'>Loudness</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" color='text.primary'>{songDetails.loudness}</Typography>
                  </Grid>
                </Grid>
                <Grid>
                  <LinearProgress variant="determinate" value={((songDetails.loudness + 60) / 60) * 100} sx={{
                    marginBottom: '.5em',
                    paddingBottom: '.2em',
                    '& .MuiLinearProgress-barColorPrimary': {
                      backgroundImage: determineColor(((songDetails.loudness + 60) / 60) * 100)
                    }
                  }} />
                </Grid>

                {/* energy */}
                <Grid item container direction="row" xs={12} alignItems='center'>
                  <Grid item xs={3} sm={2} md={3}>
                    <Typography variant="subtitle2" color='text.primary'>Energy</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" color='text.primary'>{songDetails.energy}</Typography>
                  </Grid>
                </Grid>
                <Grid>
                  <LinearProgress color='primary' variant="determinate" value={songDetails.energy * 100} sx={{
                    marginBottom: '.5em',
                    paddingBottom: '.2em',
                    '& .MuiLinearProgress-barColorPrimary': {
                      backgroundImage: determineColor(songDetails.energy * 100)
                    }
                  }} />
                </Grid>

                {/* valence */}
                <Grid item container direction="row" xs={12} alignItems='center'>
                  <Grid item xs={3} sm={2} md={3}>
                    <Typography variant="subtitle2" color='text.primary'>Valence</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" color='text.primary'>{songDetails.valence}</Typography>
                  </Grid>
                </Grid>
                <Grid>
                  <LinearProgress color='primary' variant="determinate" value={songDetails.valence * 100} sx={{
                    marginBottom: '.5em',
                    paddingBottom: '.2em',
                    '& .MuiLinearProgress-barColorPrimary': {
                      backgroundImage: determineColor(songDetails.valence * 100)
                    }
                  }} />
                </Grid>

                {/* acousticness */}
                <Grid item container direction="row" xs={12} alignItems='center'>
                  <Grid item xs={4} sm={2.5} md={3}>
                    <Typography variant="subtitle2" color='text.primary'>Acousticness</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" color='text.primary'>{songDetails.acousticness}</Typography>
                  </Grid>
                </Grid>
                <Grid>
                  <LinearProgress color='primary' variant="determinate" value={songDetails.acousticness * 100} sx={{
                    marginBottom: '.5em',
                    paddingBottom: '.2em',
                    '& .MuiLinearProgress-barColorPrimary': {
                      backgroundImage: determineColor(songDetails.acousticness * 100)
                    }
                  }} />
                </Grid>

                {/* danceability */}
                <Grid item container direction="row" xs={12} alignItems='center'>
                  <Grid item xs={4} sm={2} md={3}>
                    <Typography variant="subtitle2" color='text.primary'>Danceability</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" color='text.primary'>{songDetails.danceability}</Typography>
                  </Grid>
                </Grid>
                <Grid>
                  <LinearProgress color='primary' variant="determinate" value={songDetails.danceability * 100} sx={{
                    marginBottom: '.5em',
                    paddingBottom: '.2em',
                    '& .MuiLinearProgress-barColorPrimary': {
                      backgroundImage: determineColor(songDetails.danceability * 100)
                    }
                  }} />
                </Grid>


                {/* liveness */}
                <Grid item container direction="row" xs={12} alignItems='center'>
                  <Grid item xs={3} sm={2} md={3}>
                    <Typography variant="subtitle2" color='text.primary'>Liveness</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" color='text.primary'>{songDetails.liveness}</Typography>
                  </Grid>
                </Grid>
                <Grid>
                  <LinearProgress color='primary' variant="determinate" value={songDetails.liveness * 100} sx={{
                    marginBottom: '.5em',
                    paddingBottom: '.2em',
                    '& .MuiLinearProgress-barColorPrimary': {
                      backgroundImage: determineColor(songDetails.liveness * 100)
                    }
                  }} />
                </Grid>


                {/* popularity */}
                <Grid item container direction="row" xs={12} alignItems='center'>
                  <Grid item xs={3} sm={2} md={3}>
                    <Typography variant="subtitle2" color='text.primary'>Popularity</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" color='text.primary'>{songDetails.popularity}</Typography>
                  </Grid>
                </Grid>
                <Grid>
                  <LinearProgress color='primary' variant="determinate" value={songDetails.popularity} sx={{
                    marginBottom: '.5em',
                    paddingBottom: '.2em',
                    '& .MuiLinearProgress-barColorPrimary': {
                      backgroundImage: determineColor(songDetails.popularity)
                    }
                  }} />
                </Grid>

              </CardContent>
            </Grid>

            <Grid item container xs={10} md={6}
              // backgroundColor ='red'
              flexDirection='column'
              alignContent="center"
              alignItems='center'
              justifyContent='center'
            >
              <Typography variant="h4" color='text.primary' sx={{

              }}>Credits</Typography>

              <SearchCredits artists={songDetails.artists} song={songDetails.name} onReceiveAlias={handleAlias} />

            </Grid>
          </Grid>
        </Card>
      )}
    </div>
  )
}

export default SongPage;