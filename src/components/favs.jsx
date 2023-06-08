import React, { useState, useEffect } from 'react';

function Favorites() {
    const [userFavorites, setUserFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = () => {
            fetch('http://localhost:4000/favs')
                .then(res => res.json())
                .then(res => {
                    const favArray = res.favorites;
                    setUserFavorites(favArray);
                })
                .catch(err => {
                    console.log(err);
                })

        };
        fetchFavorites();
    });

    return (
        <div>
            <h2>Your Favorites</h2>
            {userFavorites.map((favorite, index) => (
                <div key={index}>
                    <p>Song: {favorite.song}</p>
                    <p>Artist: {favorite.artist}</p>
                    <p>Album: {favorite.album}</p>
                    <img src={favorite.image} alt="Album Cover" />
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default Favorites;
