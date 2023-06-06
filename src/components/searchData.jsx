import React, { useState, useEffect } from 'react';
import DisplayData from './displayData';
const SearchData = () => {
    const [response, setResponse] = useState('');
    const [inputField, setInputField] = useState('');

    const fetchData = () => {
        fetch('http://localhost:4000/api/accessToken') // Use the correct port
            .then(res => res.json())
            .then(data => {
                const token = data.token;
                const searchQuery = `${encodeURIComponent(inputField)}`;
                fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=artist%2Ctrack`, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        // console.log(data);
                        setResponse(data); // Update the response state with the JSON data
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        fetchData();
    }, [inputField]);

    const handleInputChange = (event) => {
        setInputField(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default form submission behavior
            if (inputField.trim() !== '') {
                fetchData(); // Fetch data when the Enter key is pressed and inputField is not empty
            }
        }
    };

    return (
        <div>
            <input type="text" value={inputField} onChange={handleInputChange} onKeyPress={handleKeyPress} />
            <DisplayData data={response} />

        </div>
    );
};

export default SearchData;
