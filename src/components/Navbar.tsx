import { useState, MouseEvent, useEffect } from 'react';
import { useNavigation, useSearchParams, useNavigate, Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import { Card, Hidden } from '@mui/material';
import Popper from '@mui/material/Popper';
import musicpluglogow from '../assets/musicpluglogow.png';
import { useAuth } from './Auth';
import { AuthContextValue } from '@appTypes/authTypes';
import SearchData from './SearchData';


interface MenuState {
  anchorElNav: null | HTMLElement;
  anchorElUser: null | HTMLElement;
}
// const pages = [];
const settings = ['Favorites', 'Account', 'Logout', 'Login', 'Sign Up'];

function ResponsiveAppBar({ setOffset, offset, setResponse, response, setAudioInfo, audioInfo, setUserFav, userFav, setLoading, loading, setSearchResult, searchResult }) {
  const { loggedInUser, isLoggedIn, handleLogout } = useAuth() as AuthContextValue;
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();


  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const userInitial = loggedInUser ? loggedInUser[0].toUpperCase() : '';

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
        <Container maxWidth="xl"
          sx={{
            paddingLeft: 0,
            paddingRight: 1,

          }}>
          <Toolbar disableGutters sx={{
            minHeight: '45px',
            '@media (max-width: 600px)': {
              minHeight: '52px',
            }
          }}>
            <Box display="flex" justifyContent="space-between" alignItems={'center'} width="100%">
              <Box sx={{
                display: 'flex',
                height: '40px',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Card sx={{
                  // ml:'30em',
                  //  mr: 1,
                  display: 'flex',
                  height: '200px',
                  width: '175px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  boxShadow: '0'
                }}>
                  <Link to="/" onClick={handleHomeClick}>
                    <img src={musicpluglogow} alt="Plug Logo" className='plug-logo' />
                  </Link>
                </Card>
              </Box>
              {/* desktop and mobile search bar*/}
              <Hidden smDown>
                <Box>
                  <SearchData
                    setResponse={setResponse}
                    response={response}
                    setAudioInfo={setAudioInfo}
                    audioInfo={audioInfo}
                    setUserFav={setUserFav}
                    userFav={userFav}
                    setLoading={setLoading}
                    loading={loading}
                    setSearchResult={setSearchResult}
                    searchResult={searchResult}
                    setOffset={setOffset}
                    offset={offset}
                    username={loggedInUser}
                  />
                </Box>
              </Hidden>

              <Hidden only={['sm','md', 'lg', 'xl']}>
                <Box display='flex' flexGrow={3.2} justifyContent='flex-end'>
                  <Typography variant='subtitle2' color = '#f5f5f5' fontWeight={800}>
                    Search
                  </Typography>
                </Box>
              </Hidden>
            

              <Hidden smUp>
                <Box display='flex' flexGrow={1} justifyContent='flex-end' sx={{
                  margin: 0,
                  width: '0px',
                }}>
                  <SearchData
                    setResponse={setResponse}
                    response={response}
                    setAudioInfo={setAudioInfo}
                    audioInfo={audioInfo}
                    setUserFav={setUserFav}
                    userFav={userFav}
                    setLoading={setLoading}
                    loading={loading}
                    setSearchResult={setSearchResult}
                    searchResult={searchResult}
                    setOffset={setOffset}
                    offset={offset}
                    username={loggedInUser}
                  />
                </Box>
              </Hidden>

              <Box display='flex' justifyContent='center' alignItems='center'>
                {isLoggedIn ? (
                  <Box>
                    <Tooltip title="Open settings">
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar>{userInitial}</Avatar>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      disableScrollLock={true}
                      sx={{
                        mt: '12px',
                      }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      {settings.map((setting) => {
                        switch (setting) {
                          case 'Logout':
                            return (
                              <MenuItem key={setting} onClick={() => { handleCloseUserMenu(); handleLogout(() => navigate('/')); }}>
                                <Typography textAlign="center" color="black">{setting}</Typography>
                              </MenuItem>
                            );
                          case 'Favorites':
                            return (
                              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                <Link to="/favs">
                                  <Typography textAlign="center" color="black">{setting}</Typography>
                                </Link>
                              </MenuItem>
                            );
                          case 'Account':
                            return (
                              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                <Link to="/account">
                                  <Typography textAlign="center" color="black">{setting}</Typography>
                                </Link>
                              </MenuItem>
                            );
                        }
                      })}

                    </Menu>
                  </Box>
                ) : (
                  <Box>
                    <Hidden only={[ 'md', 'lg', 'xl']}>
                      <Box
                        sx={{
                          display: 'flex',
                          '& > a': {
                            textDecoration: 'none',
                            color: 'white',
                            margin: '0 10px',
                            fontWeight: 'bold',
                          },
                        }}
                      >
                        <Box>
                          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <MenuIcon sx={{
                              color: 'white',
                              fontSize: '28px',
                            }} />
                          </IconButton>
                          <Menu
                            disableScrollLock={true}
                            sx={{
                              mt: '20px',
                              // ml:'20px',
                            }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                          >
                            {settings.map((setting) => {
                              switch (setting) {
                                case 'Login':
                                  return (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                      <Link to="/login">
                                        <Typography textAlign="center" color="black">{setting}</Typography>
                                      </Link>
                                    </MenuItem>
                                  );
                                case 'Sign Up':
                                  return (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                      <Link to="/signup">
                                        <Typography textAlign="center" color="black">{setting}</Typography>
                                      </Link>
                                    </MenuItem>
                                  );
                              }
                            })}
                          </Menu>
                        </Box>
                      </Box>
                    </Hidden>

                    <Hidden only={['xs', 'sm']}>
                      <Link to="/login">Login</Link>
                      <span> or </span>
                      <Link to="/signup">Join</Link>
                    </Hidden>
                    
                  </Box>

                )}
              </Box>

            </Box>
          </Toolbar>
        </Container>
      </AppBar >
    </div >
  );
}
export default ResponsiveAppBar;
