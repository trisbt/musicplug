import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import SearchData from './components/searchData';
import Signup from './components/signup';
import './App.css';


function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [placeholder, setPlaceholder] = useState('username');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');

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

      });

      if (response.ok) {
        // Login successful
        // Perform any necessary actions after successful login
        setIsLoggedIn(true);
        setLoggedInUser(username);
        setUsername('');
        setPassword('');
        // setLoginError('');
      } else {
        // Login failed
        setIsLoggedIn(false);
        setPlaceholder('Username/Password not found')
      }
    } catch (error) {
      // Handle any network or server errors
      console.error('Error:', error);
    }
  };
  // console.log(placeholder)

  return (
    <Router>
      <nav>
        <a className='LOGO' href="http://localhost:3000">Plug</a>
        <div className='favs'>Favs</div>
        <form onSubmit={handleLogin}>
          <input name="username" type="text" placeholder={placeholder} value={username} onChange={handleUsernameChange} />
          <input name="password" type="password" placeholder="password" value={password} onChange={handlePasswordChange} />
          <input type="submit" value="login" />
        </form>
        {isLoggedIn && (
          <div className='user-splash'>
            Welcome {loggedInUser}
          </div>
        )}
        <Link className='signup' to="/signup">Sign Up</Link>
      </nav>

      <div className="App">
        <div className="App-search">

          <Routes>
            <Route path="/" element={<SearchData />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;