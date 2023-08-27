import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import SearchData from './components/SearchData';
// import DisplayData from './components/DisplayData';
import Favorites from './components/Favs';
import { useAuth } from './components/Auth';
import ResponsiveAppBar from './components/Navbar';
import './App.css';
import SignIn from './components/Login';
import SignUp from './components/Signup';
import Splash from './components/Splash';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import backgroundImg from './assets/Musicplugbg.jpg';



const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", sans-serif',
  },
});

function MainContent() {
  const { isLoggedIn, loggedInUser, successfulLogin, setSuccessfulLogin, successfulLogout, setSuccessfulLogout } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

useEffect(() => {
    if (successfulLogin) {
      setSuccessfulLogin(false);
      return <Navigate to="/" replace={true} />;
    }
    if (successfulLogout) {
      setSuccessfulLogout(false);
      return <Navigate to="/" replace={true} />;
    }
  }, [successfulLogin, successfulLogout, setSuccessfulLogin, setSuccessfulLogout])
  


  const getBackgroundStyle = (path) => {
    if (showSplash && location.pathname !== '/favs') {
      return {
        backgroundImage: `repeating-linear-gradient(140deg, rgb(109, 97, 168, 0.4), #282c34 25%, rgb(80, 108, 185, 0.4)), url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
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
              <Route path="/" element={<SearchData username={loggedInUser} showSplash={showSplash} setShowSplash={setShowSplash} />} />
              <Route path="/signup" element={<SignUp />} />
              {!isLoggedIn && <Route path="/login" element={<SignIn />} />}
              {isLoggedIn && <Route path="/favs" element={<Favorites username={loggedInUser} />} />}
            </Routes>
          </div>

          {/* <DisplayData username={loggedInUser} /> */}
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
      </Router>
    </ThemeProvider>
  );
}

export default App;
