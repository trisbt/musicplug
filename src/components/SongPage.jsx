import React, { useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Modal, Fade, styled, Paper, LinearProgress } from '@mui/material';
import { useParams, useLocation, Link } from 'react-router-dom';
import DbScale from './DbScale';
import SearchId from './SearchId';

const msConvert = (num) => {
  let totalSeconds = Math.floor(num / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  let formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
  return minutes + ':' + formattedSeconds;
}
const SongPage = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { id } = useParams();
  const location = useLocation();
  const songDetails = location.state?.songDetails;
  // console.log(songDetails)
  // const username = location.state?.username;

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#f5f5f5',
    ...theme.typography.body1,

    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <div>
      {/* <Box sx={{ width: '100%' }}> */}
      {/* <Container maxWidth="xl"> */}
      {songDetails && (
        <Card sx={{
          width: '100vw',
          height: '100vh',
          overflowY: 'auto',
          borderRadius: '0',
          padding: '5px'
        }}>
          {/* top row */}
          <Grid container spacing={2} justifyContent="center" sx={{
            padding: '1em',
          }}>
            {/* First Row - Image and Song Details */}
            <Grid container item xs={12} spacing={2} >

              {/* image and modal */}
              <Grid item xs={12} sm={6} md={4} lg = {3}>
                <CardMedia
                  component="img"
                  onClick={handleOpen}
                  sx={{
                    width: 300,
                    height: 'auto',
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
              <Grid item container xs={12} sm={6} md={8} lg={8} spacing={7} direction="column">

                <Grid item >
                  <Typography variant="h5" color='text.primary'>{songDetails.name}</Typography>
                  <Typography variant="h4">{songDetails.artists[0]?.name}</Typography>
                  <Typography variant="subtitle1">{songDetails.albums}</Typography>
                  <Link to={songDetails.track_href}>
                    <svg
                      style={{ marginLeft: '-8px' }}
                      xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24">
                      <path fill="#00e676" d="M17.9 10.9C14.7 9 9.35 8.8 6.3 9.75c-.5.15-1-.15-1.15-.6c-.15-.5.15-1 .6-1.15c3.55-1.05 9.4-.85 13.1 1.35c.45.25.6.85.35 1.3c-.25.35-.85.5-1.3.25m-.1 2.8c-.25.35-.7.5-1.05.25c-2.7-1.65-6.8-2.15-9.95-1.15c-.4.1-.85-.1-.95-.5c-.1-.4.1-.85.5-.95c3.65-1.1 8.15-.55 11.25 1.35c.3.15.45.65.2 1m-1.2 2.75c-.2.3-.55.4-.85.2c-2.35-1.45-5.3-1.75-8.8-.95c-.35.1-.65-.15-.75-.45c-.1-.35.15-.65.45-.75c3.8-.85 7.1-.5 9.7 1.1c.35.15.4.55.25.85M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z" />
                    </svg>
                  </Link>


                </Grid>

                {/* Other Details, shows inline with song details on large screens */}
                <Grid container item spacing={2} sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' } }}>
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
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="space-evenly" alignItems='center' sx={{
            paddingTop: '1.5em',
            paddingLeft: '1em',
            // width: '80%'
          }}>
            <Grid xs={1} container alignItems='center' justifyContent="center" sx={{
              textAlign: 'center',
            }}>
              <Typography variant="subtitle1" color='text.primary' > Loudness</Typography>
              <Typography variant="subtitle2" color='text.primary' >{songDetails.loudness}</Typography>
              <Card sx={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#eceff1',
                // marginLeft: '1em',
                width: '80px',
                height: '170px',
              }}>
                <DbScale db={songDetails.loudness} maxDb={0} minDb={-30} />
              </Card>
            </Grid>

            <Grid xs={2}>
              <Item>
                Energy
                <LinearProgress color='primary' variant="determinate" value={songDetails.energy * 100}></LinearProgress>
                <Typography variant="h5" color='text.primary' >{songDetails.energy}</Typography>
              </Item>
            </Grid>

            <Grid xs={2}>
              <Item>
                Valence
                <LinearProgress color='warning' variant="determinate" value={songDetails.valence * 100}></LinearProgress>
                <Typography variant="h5" color='text.primary' >{songDetails.valence}</Typography>
              </Item>
            </Grid>

            <Grid xs={2}>
              <Item>
                Acousticness
                <LinearProgress color='success' variant="determinate" value={songDetails.acousticness * 100}></LinearProgress>
                <Typography variant="h5" color='text.primary' >{songDetails.acousticness}</Typography>
              </Item>
            </Grid>

            <Grid xs={2}>
              <Item>
                Danceability
                <LinearProgress color='error' variant="determinate" value={songDetails.danceability * 100}></LinearProgress>
                <Typography variant="h5" color='text.primary' >{songDetails.danceability}</Typography>
              </Item>
            </Grid>

            <Grid xs={2}>
              <Item>
                Liveness
                <LinearProgress color='secondary' variant="determinate" value={songDetails.liveness * 100}></LinearProgress>
                <Typography variant="h5" color='text.primary' >{songDetails.liveness}</Typography>
              </Item>
            </Grid>

            <Grid xs={2}>
              <Item>
                Popularity
                <LinearProgress color='secondary' variant="determinate" value={songDetails.popularity}></LinearProgress>
                <Typography variant="h5" color='text.primary' >{songDetails.popularity}</Typography>
              </Item>
            </Grid>

          </Grid>

          {/* credits row */}
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="space-evenly" alignItems='center' sx={{
            paddingTop: '1.5em',
            paddingLeft: '1em',
          }}>
            <Grid xs={1} container alignItems='center' justifyContent="center" >
            <SearchId artists = {songDetails.artists} song = {songDetails.name}/>
            </Grid>
          </Grid>


        </Card>
      )}
      {/* </Container> */}
      {/* </Box> */}
    </div>
  )
}

export default SongPage;