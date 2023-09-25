import { useState, MouseEvent } from 'react';
import { useNavigation, useSearchParams, useNavigate } from "react-router-dom";
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
import { Link } from 'react-router-dom';
import { Card } from '@mui/material';
import musicpluglogow from '../assets/musicpluglogow.png';
import { useAuth } from './Auth';
import { AuthContextValue } from '@appTypes/authTypes';

interface MenuState {
  anchorElNav: null | HTMLElement;
  anchorElUser: null | HTMLElement;
}
// const pages = [];
const settings = ['Favorites', 'Account', 'Logout'];

function ResponsiveAppBar() {
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
                        mt: '45px',
                      }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: 'top',
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
                          default:
                            return (
                              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                <Typography textAlign="center" color="black">{setting}</Typography>
                              </MenuItem>
                            );
                        }
                      })}

                    </Menu>
                  </Box>
                ) : (
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
                    <Link to="/login">Login</Link>
                    or
                    <Link to="/signup">Join</Link>
                  </Box>
                )}
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar >
    </div>
  );
}
export default ResponsiveAppBar;
