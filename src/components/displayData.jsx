import SearchId from './searchId';
import React, { useRef } from 'react';


const DisplayData = ({ data, username }) => {
    const audioRef = useRef(null);
    if (!data || !data.tracks || !data.tracks.items) {
        return null;
    }
    const results = data.tracks.items.map((item) => {
        const { name, album, preview_url } = item;
        const artists = item.artists.map(artist => {
            return artist.name + '/';
        })
        const images = album.images[1].url;
        const id = item.id;
        const release_date = item.album.release_date;
        const albums = item.album.name;
        return { name, images, id, preview_url, release_date, artists, albums };
    });


    const playAudio = (previewUrl) => {
        audioRef.current.volume = .3;
        if (previewUrl) {
            if (audioRef.current.src === previewUrl && !audioRef.current.paused) {
                audioRef.current.pause(); 
            } else {
                audioRef.current.src = previewUrl; 
                audioRef.current.play(); 
            }
        }
    };

    const handleFavorite = async (item, username) => {
        const { id, name, artists, albums, images} = item;
        console.log(albums);
        try {
            const response = await fetch('http://localhost:4000/addFavs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, id, name, artists, albums, images }),
                credentials: 'include',
            });
            const data = await response.json();
            console.log('data', data)
            if (data.username) {
                console.log('Track added to favorites:', data.name);
            } else {
                console.error('Failed to add track to favorites:', data.error);
            }
        } catch (error) {
            console.error('Error adding track to favorites:', error);
        }
    };


    return (
        <div>
            <h4>Search Results:</h4>
            <ul>
                {results.map((item, index) => (
                    <div key={index}>
                        <span className='result-artist'>{item.artists}</span>
                        <div className='star-div'>
                            <span className="result-name">{item.name}</span>

                        </div>
                        <span className='result-album'>{item.albums}</span>

                        <img className="result-image" src={item.images} alt={item.name} />
                        <span className='release-date'>Released: {item.release_date}</span>

                        {item.preview_url && (
                            <button className='preview' onClick={() => playAudio(item.preview_url)}>Preview track</button>
                        )}

                        <audio ref={audioRef}></audio>
                        <button className='star-button'>
                            <i onClick={() => handleFavorite(item, username)} class="fa-solid fa-star"></i>
                        </button>
                        <SearchId id={item.id} name={item.name} artists={item.artists} album={item.albums} />
                        <hr />
                    </div>
                ))}

            </ul>
        </div>
    );
};


export default DisplayData;
