import { useState, MouseEvent, useEffect } from 'react';
import { useNavigation, useSearchParams, useNavigate, Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import { Card, Hidden } from '@mui/material';
import Popper from '@mui/material/Popper';
import musicpluglogow from '../assets/musicpluglogow.png';
import SearchData from './SearchData';

interface MenuState {
  anchorElUser: null | HTMLElement;
}

function ResponsiveAppBar({ setOffset, offset, setResponse, response, setAudioInfo, audioInfo, setSearchResult, searchResult }) {

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleHomeClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setSearchParams({ q: '' });
    window.location.href = '/';
  }
  return (
    <div>
      <AppBar position="static"
        sx={{
          backgroundColor: '#0047d4',

        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{
            minHeight: '45px',
            '@media (max-width: 600px)': {
              minHeight: '52px',
            }
          }}>
            <Box sx={{
              display: 'flex',
              height: '40px',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden' 
            }}>
              <Card sx={{

                display: 'flex',
                height: '100px',
                width: '175px',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                boxShadow: '0',
                overflow: 'hidden' 
              }}>
                <Link to="/" onClick={handleHomeClick}>
                  <img src={musicpluglogow} alt="Plug Logo" className='plug-logo' />
                </Link>
              </Card>
            </Box>

            {/* desktop and mobile search bar*/}
            <Hidden only={['sm', 'md', 'lg', 'xl']}>
              <Box display='flex' justifyContent='flex-end' sx={{
                flexGrow: {
                  flexGrow: 3,  // default value for smaller screens
                  '@media (min-width:500px)': {
                    flexGrow: 6, // value for screens 500px and larger
                  }
                }
              }}>
                <Typography variant='subtitle2' color='#f5f5f5' fontWeight={800}>
                  {/* Search */}
                </Typography>
              </Box>
            </Hidden>

            <Box display='flex' flexGrow={1} justifyContent='center' sx={{
              margin: 0,
              width: '0px',
              // backgroundColor:'green',
            }}>
              <SearchData
                setResponse={setResponse}
                response={response}
                setAudioInfo={setAudioInfo}
                audioInfo={audioInfo}
                setSearchResult={setSearchResult}
                searchResult={searchResult}
                setOffset={setOffset}
                offset={offset}
              />
            </Box>

           
          </Toolbar>
        </Container>
      </AppBar >
    </div >
  );
}
export default ResponsiveAppBar;
