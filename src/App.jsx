import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SearchData from './components/searchData';
import DisplayData from './components/displayData';
import Favorites from './components/favs';
import { useAuth } from './components/auth';
import ResponsiveAppBar from './components/navbar';
import './App.css';
import SignIn from './components/login';
import SignUp from './components/signup';

function App() {
  const {isValidated, isLoggedIn, loggedInUser, logout } = useAuth();
  
  return (
    <Router>
      <ResponsiveAppBar />
      <div className="App">
        <div className="App-search">
          <Routes>
            <Route path="/" element={<SearchData username={loggedInUser} />} />
            <Route path = "/signup" element = {<SignUp/>}/>
            {!isLoggedIn && <Route path="/login" element={<SignIn />} />}
            {isValidated && <Route path="/favs" element={<Favorites username={loggedInUser} />} />}
          </Routes>
        </div>
      </div>
      <DisplayData username={loggedInUser} />

      {/* Only navigate to the home page after login */}
      {isLoggedIn && window.location.pathname !== '/' && (
        <Navigate to="/" replace={true} /> // Navigates to the home page
      )}
      {logout && window.location.pathname !== '/' && (
        <Navigate to="/" replace={true} /> // Navigates to the home page
      )}
    </Router>
  );
}

export default App;
