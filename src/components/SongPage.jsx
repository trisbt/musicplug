import React, { useState } from 'react';
import { Container, Box, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Modal, Backdrop, Fade, styled, Paper } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';
import DbScale from './DbScale';

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
  console.log(songDetails)
  // const username = location.state?.username;

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#eceff1',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    // width: '150px', height: '80px' 
  }));

  return (
    <div>
      {/* <Box sx={{ width: '100%' }}> */}
      {/* <Container maxWidth="xl"> */}
      {songDetails && (
        <Card sx={{
          width: '90vw',
          height: '100vh',
          borderRadius: '0',
          padding: '5px'
        }}>
          {/* top row */}
          <Grid container spacing={2} justifyContent="center" sx={{
            paddingTop: '1.5em',
          }}>
            {/* First Row - Image and Song Details */}
            <Grid container item xs={12} md={12} lg={11} spacing={2} >
              {/* image and modal */}
              <Grid item xs={12} sm={6} md={4}>
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
              <Grid item container xs={12} sm={10} md={8} lg={8} spacing={16} direction="column">
                <Grid item >
                  <Typography variant="h5" color='text.primary'>{songDetails.name}</Typography>
                  <Typography variant="h4">{songDetails.artists[0]?.name}</Typography>
                  <Typography variant="subtitle1">{songDetails.albums}</Typography>
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
                      Energy
                      <Typography variant="h5" color='text.primary' >{songDetails.loudness}</Typography>
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
                    Energy
                    <Typography variant="h5" color='text.primary' >{songDetails.loudness}</Typography>
                  </Item>
                </Grid>

              </Grid>

            </Grid>
          </Grid>


          {/* analysis row */}
          <Grid container spacing={2} justifyContent="space-evenly" alignItems='center' sx={{
            paddingTop: '1.5em',
            width: '90%'
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

            <Grid>
              <Item>hello</Item>
            </Grid>
            <Grid>
              <Item>hello</Item>
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