// import logo from './logo.svg';
import React from 'react';
import './App.css';
import SearchData from './components/searchData';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Plug
        {/* <div className="searchBar"> */}
        <SearchData />
        {/* </div> */}
      </header>

    </div>
  );
}

export default App;
