import React, { useState } from 'react';
import { Container, Box, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Modal, Backdrop, Fade } from '@mui/material';
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


  return (
    <div>
      <Box sx={{ width: '100%' }}>
        {/* <Container maxWidth="xl"> */}
        {songDetails && (
          // <Card sx={{
          //   width: '100vw',
          //   height: '100vh',
          //   borderRadius: '0',
          // }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid xs={4}>
              <CardMedia
                component="img"
                onClick={handleOpen}
                sx={{
                  width: 200,
                  cursor: 'pointer',
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
                // BackdropComponent={Backdrop}
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

            <Grid xs={4}>
              <Typography variant="h5">{songDetails.name}</Typography>
              <Typography variant="h6">{songDetails.artists[0]?.name}</Typography>
            </Grid>
          </Grid>
          // </Card>
        )}
        {/* </Container> */}
      </Box>
    </div>
  )
}

export default SongPage;