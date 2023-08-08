import SearchId from './searchId';
import React, { useRef } from 'react';




const DisplayData = ({ data }) => {
    const audioRef = useRef(null);
    if (!data || !data.tracks || !data.tracks.items) {
        return null;
    }

    const results = data.tracks.items.map((item) => {
        // console.log(item)
        const { name, album, preview_url } = item;
        // const artist = [];
        const artists = item.artists.map(artist => {
            return artist.name + '/';
        })
        // console.log(artists);
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
                        <SearchId id={item.id} name={item.name} artists={item.artists} album={item.albums} />
                        {/* <SearchGenius name={item.name} /> */}
                        <hr />
                    </div>
                ))}

            </ul>
        </div>
    );
};


export default DisplayData;
