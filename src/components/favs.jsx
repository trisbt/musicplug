import React, { useState, useEffect } from 'react';

import EnhancedTable from './table';

function Favorites({ username }) {
    const [userFavorites, setUserFavorites] = useState([]);
    const [initialRenderDone, setInitialRenderDone] = useState(false); 

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
                    setInitialRenderDone(true);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        fetchFavorites();
    }, [username]);


    return (
        <EnhancedTable favorites={userFavorites} initialRenderDone = {initialRenderDone} />
    );
}

export default Favorites;



