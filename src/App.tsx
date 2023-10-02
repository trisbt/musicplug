import {
  createBrowserRouter, Outlet,
  Route, RouterProvider, Routes, useLocation, useNavigate, useSearchParams,
} from 'react-router-dom';
import React, { lazy, useState, useEffect, FC, useRef } from 'react';
import { Grid } from '@mui/material';
import SearchData from './components/SearchData';
import ResponsiveAppBar from './components/Navbar';
import './App.css';
import Splash from './components/Splash';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import backgroundImg from './assets/Musicplugbg.jpg';
import Footer from './components/Footer';
import { SearchDataProps } from '@appTypes/dataTypes'
import TopTracks, { topTracksLoader } from './components/TopTracks';
const SongPage = lazy(() => import('./components/SongPage'));
const DisplayData = lazy(() => import('./components/DisplayData'));


const theme = createTheme({
  typography: {
    // fontFamily: '"Montserrat", sans-serif',
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

const router = createBrowserRouter([
  { path: "*", Component: Root, },
  // { path:'/signup', Component: SignUp }
]);

function Root() {
  //searchdata and displaydata props
  const [response, setResponse] = useState<DataItem[]>([]);
  const [audioInfo, setAudioInfo] = useState<AudioDataItem[]>([]);
  const [searchResult, setSearchResult] = useState<string>('');
  const location = useLocation();
  const isHomePage = location.pathname === '/' && !location.search;
  // Use this value to set the showSplash state directly
  const [showSplash, setShowSplash] = useState(isHomePage);
  const [offset, setOffset] = useState<number>(1);

  const handleLoadMore = () => {
    const nextOffset = offset + 25;
    setOffset(nextOffset);
  };
  
  useEffect(() => {
    setShowSplash(isHomePage);
  }, [location.pathname, location.search]);

  const getBackgroundStyle = (path) => {
    if (showSplash) {
      return {
        backgroundImage: `linear-gradient(to bottom, rgb(40, 60, 80, 0.5) 0%, #282c34 20%, rgb(80, 108, 185) 90%), url(${backgroundImg})`,
        backgroundSize: 'contain',
      };
    } else {
      return {
        backgroundImage: `repeating-linear-gradient(140deg, rgb(109, 97, 168), #282c34 25%, rgb(80, 108, 185))`
      };
    }
  };
  const backgroundStyle = getBackgroundStyle(location.pathname);
  return (
    <React.Suspense fallback={<div></div>}>
      <ThemeProvider theme={theme}>
        <ResponsiveAppBar
          setResponse={setResponse}
          response={response}
          setAudioInfo={setAudioInfo}
          audioInfo={audioInfo}
          setSearchResult={setSearchResult}
          searchResult={searchResult}
          setOffset={setOffset}
          offset={offset}

        />
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

                  <Route path="/" element={
                    <>
                      {location.search ? (
                        <DisplayData
                          data={response}
                          audioData={audioInfo}
                          theme={theme}
                          handleLoadMore={handleLoadMore}
                          searchResult={searchResult}
                        />
                      ) : (
                        <Grid mt={8} item xs={12} className="TopTracksClass">
                          <TopTracks/>
                        </Grid>
                      )}
                    </>
                  } />
                  <Route path="/:name/:artist/:id/" element={<SongPage/>} />

                </Routes>
              </Grid>
            </Grid>
          </div>
        </div>
        <Footer />
      </ThemeProvider>
    </React.Suspense>

  );
}

export default function App() {
  return <RouterProvider router={router} />;
}

