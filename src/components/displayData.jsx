import SearchId from './searchId';
import React, { useRef } from 'react';

const DisplayData = ({ data }) => {
    const audioRef = useRef(null);
    if (!data || !data.tracks || !data.tracks.items) {
        return null;
    }

    const results = data.tracks.items.map((item) => {

        const { name, album, preview_url } = item;
        const images = album.images[1].url;
        const id = item.id;
        const release_date = item.album.release_date;
        return { name, images, id, preview_url, release_date };
    });

    const playAudio = (previewUrl) => {
        if (previewUrl) {
            if (audioRef.current.src === previewUrl && !audioRef.current.paused) {
                audioRef.current.pause(); // Pause the audio if it's already playing
            } else {
                audioRef.current.src = previewUrl; // Set the audio source
                audioRef.current.play(); // Play the audio
            }
        }
    };


    return (
        <div>
            <h4>Search Results:</h4>
            <ul>
                {results.map((item, index) => (
                    <div key={index}>
                        <span className="result-name">{item.name}</span>
                        <img className="result-image" src={item.images} alt={item.name} />
                        <span className='release-date'>Released: {item.release_date}</span>
                        {item.preview_url && (
                            <button onClick={() => playAudio(item.preview_url)}>Preview track</button>
                        )}
                        <audio ref={audioRef}></audio>
                        <SearchId id={item.id} />
                        <hr />
                    </div>
                ))}

            </ul>
        </div>
    );
};


export default DisplayData;
