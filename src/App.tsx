import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate, useSearchParams, } from 'react-router-dom';
import React, { useState, useEffect, FC, useRef } from 'react';
import { Grid } from '@mui/material';
import SearchData from './components/SearchData';
import DisplayData from './components/DisplayData';
import { useAuth } from './components/Auth';
import ResponsiveAppBar from './components/Navbar';
import './App.css';
import Splash from './components/Splash';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import backgroundImg from './assets/Musicplugbg.jpg';
import Footer from './components/Footer';
import { AuthContextValue } from '@appTypes/authTypes';
import { SearchDataProps } from '@appTypes/dataTypes'
import TopTracks from './components/TopTracks';

import SignUp from './components/Signup';
import SignIn from './components/Login';
import SongPage from './components/SongPage';
import Favorites from './components/Favs';
import AccountSettings from './components/AccountSettings';


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

const MainContent: FC = ({ handleLoadMoreRef, setOffset, offset, setResponse, response, setAudioInfo, audioInfo, setUserFav, userFav, setLoading, loading, setSearchResult, searchResult }) => {
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
        backgroundImage: `linear-gradient(to bottom, rgb(40, 60, 80, 0.5) 0%, #282c34 20%, rgb(80, 108, 185) 90%), url(${backgroundImg})`,
        backgroundSize: 'contain',
        // backgroundPosition: 'center 2%',
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

        <div className="App">
          <Grid item
            className="App-search"
            justifyContent="center"
            alignItems="center"

            mt={2}
          >

            {/* Splash Grid item */}
            {showSplash && location.pathname === '/' && (
              <Grid item xs={12} style={{
                display: 'flex', justifyContent: 'center',
              }}>
                <Splash />
              </Grid>

            )}
            {/* SearchData Grid item */}
            <Grid mt={2} item xs={12} style={{
              display: 'flex',
              justifyContent: 'center',

            }}>
              <Routes>
                {/* <Route path="/" element={<SearchData key={location.search} username={loggedInUser} />} /> */}
                {location.search &&(
                <Route path="/" element={<DisplayData
                  data={response}
                  audioData={audioInfo}
                  userFav={userFav}
                  username={loggedInUser}
                  theme={theme}
                  setOffset={setOffset}
                  offset={offset}
                  handleLoadMoreRef={handleLoadMoreRef}
                  searchResult={searchResult}
                />
                } />
                )}
                
                <Route path="/signup" element={<SignUp />} />
                <Route path="/:name/:artist/:id/" element={<SongPage username={loggedInUser} />} />
                {!isLoggedIn && <Route path="/login" element={<SignIn />} />}
                {isLoggedIn && <Route path="/favs" element={<Favorites username={loggedInUser} />} />}
                {isLoggedIn && <Route path="/account" element={<AccountSettings />} />}
              </Routes>
            </Grid>

            {/* TopTracks Grid item */}
            {showSplash && (
              <Grid mt={4} item xs={12} className="TopTracksClass">
                <TopTracks username = {loggedInUser}/>
              </Grid>
            )}
          </Grid>
        </div>
      </div>
    </>
  );


}

function App() {
  //searchdata and displaydata props
  const [response, setResponse] = useState<DataItem[]>([]);
  const [audioInfo, setAudioInfo] = useState<AudioDataItem[]>([]);
  const [userFav, setUserFav] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(1);
  const handleLoadMoreRef = useRef(null);
  //to display text for user search
  const [searchResult, setSearchResult] = useState<string>('');
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ResponsiveAppBar
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
          handleLoadMoreRef={handleLoadMoreRef}

        />
        {/* <React.Suspense fallback={<div>Loading...</div>}> */}
          <MainContent
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
            handleLoadMoreRef={handleLoadMoreRef}
          />
        {/* </React.Suspense> */}
        <Footer />
      </Router>
    </ThemeProvider>
  );
}


export default App;
