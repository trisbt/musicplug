import React, { useState } from 'react';
import { Container, Box, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Modal, Backdrop, Fade, styled, Paper } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';



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
  // const username = location.state?.username;

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
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
          width: '90vw',
          height: '100vh',
          borderRadius: '0',
          padding: '5px'
        }}>
          <Grid container columnSpacing={{ xs: 1 }} sx={{
            paddingTop: '1.5em',

          }}>
            <Grid xs={3} sx={{
            }}>
              <CardMedia
                component="img"
                onClick={handleOpen}
                sx={{
                  width: 300,
                  height: 'auto',
                  marginLeft: '1em',
                  cursor: 'pointer',
                  boxShadow: 2,
                  "@media (max-width: 500px)": {
                    width: '75%',
                  }
                }}
                image={songDetails.images}
                alt={songDetails.name}
              />

              {/* Modal to show the enlarged image */}
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

            <Grid xs={8}>
              <Typography variant="h5" color='text.primary' >{songDetails.name}</Typography>
              <Typography variant="h4">{songDetails.artists[0]?.name}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Item>
                    <Typography variant="h5" color='text.primary' >{songDetails.key}</Typography>
                  </Item>
                </Grid>
                <Grid item xs={3}>
                  <Item>
                    <Typography variant="h5" color='text.primary' >{songDetails.tempo}</Typography>
                  </Item>
                </Grid>
                <Grid item xs={3}>
                  <Item>
                    <Typography variant="h5" color='text.primary' >{songDetails.loudness}</Typography>
                  </Item>
                </Grid>
                <Grid item xs={3}>
                  <Item>
                    <Typography variant="h5" color='text.primary' >{songDetails.energy}</Typography>
                  </Item>
                </Grid>
              </Grid>
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