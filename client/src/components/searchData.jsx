import React, { useState, useEffect } from 'react';

const SearchData = () => {
    const [response, setResponse] = useState('');

    useEffect(() => {
        // Make a GET request to the server endpoint
        fetch('/')
            .then((res) => res.text())
            .then((data) => setResponse(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    return (
        <div>
            <pre>{response}</pre>
        </div>
    );
};

export default SearchData;
