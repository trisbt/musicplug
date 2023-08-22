import { useState } from 'react';
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
import { useAuth } from './auth';



const pages = [];
const settings = ['Favorites', 'Logout'];

function ResponsiveAppBar() {
    const { loggedInUser, isLoggedIn, handleLogout } = useAuth();
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

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
    return (
        <AppBar position="static"

            sx={{ background: 'linear-gradient(169deg, rgba(0,0,0,1) 0%, rgba(41,5,111,1) 40%, rgba(52,3,109,1) 55%, rgba(8,1,97,1) 82%)' }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters >
                    <PowerTwoToneIcon
                        sx={{ display: { xs: 'none', md: 'flex', lg: 'flex' }, mr: 1 }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            mr: 1,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'Rafika, arial',
                            // textShadow:'4px 4px 4px 4px #aaa',
                            // fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                            //   fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <Link to="/">Plug</Link>
                    </Typography>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'Rafika, arial',
                            // fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <Link to="/" >Plug</Link>

                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: '1em' }}>
                        {pages.map((page) => (
                            page === 'Favorites' ? (
                                <Link key={page} to="/favs" sx={{ my: 2, color: 'white', display: 'block' }} onClick={handleCloseNavMenu}>
                                    Favorites
                                </Link>
                            )
                                : (
                                    <Button
                                        key={page}
                                        onClick={handleCloseNavMenu}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        {page}
                                    </Button>
                                )
                        ))}
                    </Box>
                    {isLoggedIn ? (
                        <Box
                            sx={{ flexGrow: 0 }}
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

                </Toolbar>
            </Container>
        </AppBar>

    );
}
export default ResponsiveAppBar;