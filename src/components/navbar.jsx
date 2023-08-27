import { useState } from 'react';
import { useNavigation, useSearchParams } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import PowerTwoToneIcon from '@mui/icons-material/PowerTwoTone';
import { Card } from '@mui/material';
import { Paper } from '@mui/material';
// import plugLogo from '../assets/pluglogo.png';
import musicpluglogow from '../assets/musicpluglogow.png';
import { useAuth } from './Auth';



const pages = [];
const settings = ['Favorites', 'Logout'];

function ResponsiveAppBar() {
    const { loggedInUser, isLoggedIn, handleLogout } = useAuth();
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    // const navigate = useNavigation();

    // const handleOpenNavMenu = (event) => {
    //     setAnchorElNav(event.currentTarget);
    // };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const userInitial = loggedInUser ? loggedInUser[0].toUpperCase() : '';

    const handleHomeClick = (event) => {
        event.preventDefault();
        setSearchParams({ q: '' });
        window.location.href = '/';
    }
    return (
        <AppBar position="static"
            sx={{

                boxShadow: '6',
                backdropFilter: 'blur(10px)',
                // backgroundColor: 'rgba(250, 250, 250, 0.4)',
                backgroundColor: '#0047d4',
                // borderRadius:'8px'
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
                        {/* <Box sx={{ display: 'flex', alignItems: 'center', }}></Box> */}
                        <Box sx={{
                            // ml:'30em',
                            // ml:2,
                            display: 'flex',
                            // height: '65px',
                            height: '40px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            // backgroundColor: 'transparent'
                        }}>
                            <Card sx={{
                                // ml:'30em',
                                //  mr: 1,
                                display: 'flex',
                                height: '200px',
                                width: '175px',
                                alignItems: 'center',
                                justifyContent: 'center',
                                // opacity:'30%',
                                backgroundColor: 'transparent',
                                // backgroundColor: 'blue',
                                boxShadow: '0'
                            }}>
                                <Link to="/" onClick={handleHomeClick}>
                                    <img src={musicpluglogow} alt="Plug Logo" className='plug-logo' />
                                </Link>
                            </Card>
                        </Box>
                        {isLoggedIn ? (
                            <Box
                                sx={{}}
                            >
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
                                    {settings.map((setting) => (
                                        setting === 'Logout' ? (
                                            <MenuItem key={setting} onClick={() => { handleCloseUserMenu(); handleLogout(); }}>
                                                <Typography textAlign="center" color="black">{setting}</Typography>
                                            </MenuItem>
                                        ) : (
                                            <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                                {setting === 'Favorites' ? (
                                                    <Link to="/favs" onClick={handleCloseNavMenu}>
                                                        <Typography textAlign="center" color="black">{setting} </Typography>
                                                    </Link>
                                                ) : (
                                                    <Typography textAlign="center" color="black">{setting}</Typography>
                                                )}
                                            </MenuItem>
                                        )
                                    ))}

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
                </Toolbar>
            </Container>
        </AppBar >

    );
}
export default ResponsiveAppBar;