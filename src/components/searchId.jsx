import React, { useState } from 'react';


const keyConvert = (num) => {
    const chart = {
        '0': 'C',
        '1': 'C#, Db',
        '2': 'D',
        '3': 'D#, Eb',
        '4': 'E',
        '5': 'F',
        '6': 'F#, Gb',
        '7': 'G',
        '8': 'G#, Ab',
        '9': 'A',
        '10': 'A#, Bb',
        '11': 'B',
    }
    if (num in chart) {
        // console.log(num);
        return chart[num];
    }
}

const SearchId = ({ id }) => {
    const [response, setResponse] = useState([]);

    const fetchData = () => {
        fetch('http://localhost:4000/api/accessToken') // Use the correct port
            .then(res => res.json())
            .then(data => {
                const token = data.token;
                fetch(`https://api.spotify.com/v1/audio-features/${id}`, { // Remove the extra quotes around the id
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        const keySig = keyConvert(data.key);
                        const tempo = data.tempo;
                        const loudness = data.loudness;
                        const energy = data.energy;
                        // console.log(data.key);
                        setResponse([`key: ${keySig}, tempo: ${tempo}, loudness: ${loudness}, energy: ${energy}`]); // Update the response state with the JSON data
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <button className='search-id' onClick={fetchData}>Get Audio Analysis</button>
            {response}
        </div>
    );
};

export default SearchId;
