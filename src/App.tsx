import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, FC } from 'react';
import SearchData from './components/SearchData';
import { useAuth } from './components/Auth';
import ResponsiveAppBar from './components/Navbar';
import './App.css';
import Splash from './components/Splash';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import backgroundImg from './assets/Musicplugbg.jpg';
import Footer from './components/Footer';
import { AuthContextValue } from '@appTypes/authTypes';
import { SearchDataProps } from '@appTypes/dataTypes'

const SignUp = React.lazy(() => import('./components/Signup'));
const SignIn = React.lazy(() => import('./components/Login'));
const SongPage = React.lazy(() => import('./components/SongPage'));
const Favorites = React.lazy(() => import('./components/Favs'));
const AccountSettings = React.lazy(() => import('./components/AccountSettings'));



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

const MainContent: FC = () => {
  const { isLoggedIn, loggedInUser } = useAuth() as AuthContextValue;
  const location = useLocation();
  const isHomePage = location.pathname === '/' && !location.search;

  // Use this value to set the showSplash state directly
  const [showSplash, setShowSplash] = useState(isHomePage);
  useEffect(() => {
    setShowSplash(isHomePage);
  }, [location.pathname, location.search]);

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
              <Route path="/:name/:artist/:id/" element={<SongPage username={loggedInUser} />} />
              {!isLoggedIn && <Route path="/login" element={<SignIn />} />}
              {isLoggedIn && <Route path="/favs" element={<Favorites username={loggedInUser} />} />}
              {isLoggedIn && <Route path="/account" element={<AccountSettings />} />}
            </Routes>
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
        <React.Suspense fallback={<div>Loading...</div>}>
          <MainContent />
        </React.Suspense>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}


export default App;
