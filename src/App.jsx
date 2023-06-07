import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import SearchData from './components/searchData';
import Signup from './components/signup';
import './App.css';

function App() {
  return (
    <Router>
      <nav>
        Plug
        <form method="POST" action="/login">
          <input name="username" type="text" placeholder="username" />
          <input name="password" type="password" placeholder="password" />
          <input type="submit" value="login" />
        </form>
        <Link to="/signup">Sign Up</Link>
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
