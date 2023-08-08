import React, { useState } from 'react';
import DisplayData from './displayData';
const SearchData = () => {
    const [response, setResponse] = useState('');
    const [inputField, setInputField] = useState('');

    const fetchData = () => {
        setResponse('')
        const searchQuery = encodeURIComponent(inputField);   
        fetch(`http://localhost:4000/search?query=${searchQuery}`)
            .then(res => res.json())
            .then(data => {
                console.log('data', data)
                setResponse(data); 
            })
            .catch(error => {
                console.error('Error:', error);
            });
        
    };

    const handleFormSubmit = (event) => {
        event.preventDefault(); 
        if (inputField.trim() !== '') {
            fetchData(); 
        }
    };

    const handleInputChange = (event) => {
        setInputField(event.target.value);
    };

    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <input placeholder='find songs' type="text" value={inputField} onChange={handleInputChange} />
                <button type="submit">Search</button>
            </form>
            <DisplayData data={response} />
        </div>
    );
};

export default SearchData;
