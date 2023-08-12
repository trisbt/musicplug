import React, { useState, useEffect } from 'react';
import EnhancedTable from './table';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';

function Favorites({ username }) {
    const [userFavorites, setUserFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = () => {
            fetch('http://localhost:4000/favs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
                credentials: 'include',
            })
                .then(res => res.json())
                .then(res => {
                    const favArray = res.favorites;
                    setUserFavorites(favArray);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        fetchFavorites();
    }, []);
    console.log('fav', userFavorites)

    return (
        <EnhancedTable favorites={userFavorites} />
        // <div>
        //     <h2>Your Favorites</h2>
        //     <TableContainer component={Paper}>
        //         <Table>
        //             <TableHead>
        //                 <TableRow>
        //                     <TableCell>Song</TableCell>
        //                     <TableCell>Artist</TableCell>
        //                     <TableCell>Album</TableCell>
        //                     <TableCell>Key</TableCell>
        //                     <TableCell>Tempo</TableCell>
        //                     <TableCell>Loudness</TableCell>
        //                     <TableCell>Album Cover</TableCell>
        //                 </TableRow>
        //             </TableHead>
        //             <TableBody>
        //                 {userFavorites.map((favorite, index) => (
        //                     <TableRow key={index}>
        //                         <TableCell>{favorite.song}</TableCell>
        //                         <TableCell>{favorite.artist}</TableCell>
        //                         <TableCell>{favorite.album}</TableCell>
        //                         <TableCell>{favorite.key}</TableCell>
        //                         <TableCell>{favorite.tempo}</TableCell>
        //                         <TableCell>{favorite.loudness}</TableCell>
        //                         <TableCell>
        //                         <img src={favorite.image} alt="Album Cover" />
        //                         </TableCell>
        //                     </TableRow>
        //                 ))}
        //             </TableBody>
        //         </Table>
        //     </TableContainer>
        //     <hr />
        // </div>
    );
}

export default Favorites;



