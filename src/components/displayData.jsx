import React, { useState, useEffect } from 'react';

const DisplayData = ({ data }) => {
    // console.log(data); // Add this console.log statement
    if (!data || !data.tracks || !data.tracks.items) {
        return null; // Render nothing if data or data.items is undefined
    }
    const results = [];
    const items = data.tracks.items;
    for (const sub of items) {
        console.log(sub)
        results.push(sub.name)
        results.push(sub.id)
    }

    return (
        <div>
            <h2>Search Results:</h2>
            <ul>

                {results.map((key) => (
                    <li key={key}>{key}: {data[key]}</li>
                ))}
            </ul>
        </div>
    );
};

export default DisplayData;
