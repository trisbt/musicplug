import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import SearchData from './components/searchData';
import Signup from './components/signup';
import Favorites from './components/favs';
import './App.css';


function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLogoutButton, setShowLogoutButton] = useState(isLoggedIn);

  useEffect(() => {
    async function checkAuthentication() {
      try {
        const response = await fetch('http://localhost:4000/validate', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        console.log(data);
        if (data.isLoggedIn) {
          setIsLoggedIn(true);
          setLoggedInUser(data.username);
          setShowLogoutButton(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    }

    checkAuthentication();
  }, []);


  const handleCloseError = () => {
    setError('');
    setIsModalOpen(false);
  };
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.message === 'logged in') {
        setIsLoggedIn(true);
        setShowLogoutButton(true)
        setLoggedInUser(username);
        setUsername('');
        setPassword('');
      } else {
        setIsLoggedIn(false);
        setError(data.message)
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };



  return (
    <Router>
      <nav>
        <a className='LOGO' href="http://localhost:3000">Plug app</a>
        <Link className='favs-link' to="/favs">Your Favorites</Link>
        {!isLoggedIn && (
          <form onSubmit={handleLogin}>

            <input name="username" type="text" placeholder="username" value={username} onChange={handleUsernameChange} />
            <input name="password" type="password" placeholder="password" value={password} onChange={handlePasswordChange} />
            <input type="submit" value="login" />
          </form>
        )}

        {isLoggedIn && (
          <div className='user-splash'>
            Welcome {loggedInUser}
            {showLogoutButton && (
              <button onClick={handleLogout}>Logout</button>
            )}
          </div>
        )}
        {!isLoggedIn && (
          <Link className='signup' to="/signup">Sign Up</Link>
        )}
      </nav>
      {error && isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            {error}
            <button onClick={handleCloseError}>Close</button>
          </div>
        </div>
      )}
      <div className="App">
        <div className="App-search">

          <Routes>
            <Route path="/" element={<SearchData />} />
            <Route path="/signup" element={<Signup />} />
            {isLoggedIn && <Route path="/favs" element={<Favorites />} />}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;