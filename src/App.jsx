import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SearchData from './components/SearchData';
import Favorites from './components/Favs';
import { useAuth } from './components/Auth';
import ResponsiveAppBar from './components/Navbar';
import './App.css';
import SignIn from './components/Login';
import SignUp from './components/Signup';
import Splash from './components/Splash';
import SongPage from './components/SongPage';
import TopTracks from './components/TopTracks';
import AccountSettings from './components/AccountSettings';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import backgroundImg from './assets/Musicplugbg.jpg';
import Footer from './components/Footer';



const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", sans-serif',
  },
  palette: {
    primary: {
      light: '#99cbfd',
      main: '#4d97f8',
      dark: '#3746a2',
      contrastText: '#fff',
    },
    secondary: {
      light: '#fffbe8',
      main: '#eec94b',
      dark: '#9e7937',
      contrastText: '#000',
    },
  },
});

function MainContent() {
  const { isLoggedIn, loggedInUser, successfulLogin, setSuccessfulLogin, successfulLogout, setSuccessfulLogout } = useAuth();
  // const [showSplash, setShowSplash] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/' && !location.search;

  // Use this value to set the showSplash state directly
  const [showSplash, setShowSplash] = useState(isHomePage);
  useEffect(() => {
    setShowSplash(isHomePage);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (successfulLogin || successfulLogout) {
      setSuccessfulLogin(false);
      setSuccessfulLogout(false);
      navigate('/');
    }
  }, [successfulLogin, successfulLogout]);


  const getBackgroundStyle = (path) => {
    if (showSplash && location.pathname !== '/favs') {
      return {
        backgroundImage: `linear-gradient(rgb(40, 60, 80, 0.7), rgb(5,12,24, 0.7)), url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 26%',

      };
    } else {
      return {
        backgroundImage: `repeating-linear-gradient(140deg, rgb(109, 97, 168), #282c34 25%, rgb(80, 108, 185))`
      };
    }
  };

  const backgroundStyle = getBackgroundStyle(location.pathname);
  return (
    <>
      <div style={backgroundStyle}>
        {showSplash && location.pathname === '/' && (
          <div className='splash'>
            <Splash />
          </div>
        )}

        <div className="App">
          <div className="App-search">
            <Routes>
              <Route path="/" element={<SearchData key={location.search} username={loggedInUser} />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/:name/:artist/:id" element={<SongPage username={loggedInUser} />} />
              {!isLoggedIn && <Route path="/login" element={<SignIn />} />}
              {isLoggedIn && <Route path="/favs" element={<Favorites username={loggedInUser} />} />}
              {isLoggedIn && <Route path="/account" element={<AccountSettings />} />}
            </Routes>
            {/* <TopTracks username={loggedInUser} /> */}
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ResponsiveAppBar />
        <MainContent />
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
