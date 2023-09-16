// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { Card, createTheme, Box } from '@mui/material';
// import DisplayData from './DisplayData';

// const theme = createTheme({
//   palette: {
//     primary: {
//       light: '#99cbfd',
//       main: '#4d97f8',
//       dark: '#3746a2',
//       contrastText: '#fff',
//     },
//     secondary: {
//       light: '#fffbe8',
//       main: '#eec94b',
//       dark: '#9e7937',
//       contrastText: '#000',
//     },
//   },
// });

// const TopTracks = ({username}) => {

//   const [topTracks, setTopTracks] = useState([]);
//   const [topAudioFeatures, setTopAudioFeatures] = useState([]);
//   const [topUserFav, setTopUserFav] = useState([])

//   useEffect(() => {
//     //gets top tracks from spotify global playlist
//     if (!TopTracks.cachedTracks || !TopTracks.cachedAudioFeatures) {
//       fetch('/api/toptracks')
//         .then(res => res.json())
//         .then(data => {
//           setTopTracks(data.trackData);
//           setTopAudioFeatures(data.audioData);

//           // Cache data in static variables
//           TopTracks.cachedTracks = data.trackData;
//           TopTracks.cachedAudioFeatures = data.audioData;
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     } else {
//       // Use cached data
//       setTopTracks(TopTracks.cachedTracks);
//       setTopAudioFeatures(TopTracks.cachedAudioFeatures);
//     }

//       //use favorite fetch
//     fetch('/api/favs', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ username }),
//       credentials: 'include',
//     })
//       .then(res => res.json())
//       .then(res => {
//         const favArray = res.favorites.map(el => el.id);
//         const obj = {};
//         for (const el of favArray) {
//           if (!obj[el]) {
//             obj[el] = true;
//           }
//         }
//         setTopUserFav(obj);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }, []);


//   return (
//     <div>
//       <Box sx ={{
//         width:'100vw',
//         height:'100vh'
//       }}>
//       <h2>Top Tracks Data:</h2>
//       <pre>{JSON.stringify(topTracks, null, 2)}</pre>
  
//       <h2>Top Audio Features Data:</h2>
//       <pre>{JSON.stringify(topAudioFeatures, null, 2)}</pre>
  
//       <h2>Top User Favorites:</h2>
//       <pre>{JSON.stringify(topUserFav, null, 2)}</pre>
  
//       {/* You can uncomment this once you're done testing */}
//       {/* <DisplayData data={topTracks} audioData={topAudioFeatures} userFav={topUserFav} username={username} theme={theme} onLoadMore={false} searchResult={'Top 10 Songs'}/> */}
//       </Box>
//     </div>
    
//   );
  
// }
// TopTracks.cachedTracks = null;
// TopTracks.cachedAudioFeatures = null;
// export default TopTracks;
export {};

