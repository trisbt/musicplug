import React, { useState } from 'react';
import DisplayData from './displayData';
const SearchData = () => {
    const [response, setResponse] = useState('');
    // const [gresponse, gsetResponse] = useState('');
    const [inputField, setInputField] = useState('');
    // const [accessToken, setAccessToken] = useState(null);

    const fetchData = () => {
        fetch('http://localhost:4000/api/accessToken') // Use the correct port
            .then(res => res.json())
            .then(data => {
                const token = data.token;
                const searchQuery = `${encodeURIComponent(inputField)}`;
                fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=artist%2Ctrack&limit=50`, {
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


    // let g_client_token = 'oLJ3HV2evNygH4j--uTKP0dcHb9wJ2kQ-dkI4ho3_ISU4_ifJDydJWtEBGsiUt6B';
    // fetch('http://localhost:4000/oauth') // Use the correct endpoint
    //     .then(res => res.json())
    //     .then(data => {
    //         const token = data.access_token;
    //         setAccessToken(token); // Save the token
    //     })
    //     .catch(error => {
    //         console.error('Access Token Error:', error);
    //     });
    // let token = 'ncQZ1MHQc6GxEbKRhTtqUzmOETeXmHTnPDXUENr56TWyrxoZ31iW8qigeiAYE6As';
    // const geniusFetch = () => {
    //     // const response = {
    //     //     meta: {
    //     //         status: 200
    //     //     },
    //     //     response: {
    //     //         web_page: {
    //     //             api_path: "/web_pages/10347",
    //     //             domain: "docs.genius.com",
    //     //             id: 10347,
    //     //             normalized_url: "//docs.genius.com",
    //     //             share_url: "http://genius.it/docs.genius.com",
    //     //             title: "Genius API",
    //     //             url: "https://genius.com/docs.genius.com",
    //     //             annotation_count: 26
    //     //         }
    //     //     }
    //     // };
    //     // const url = response.response.web_page.url;
    //     // console.log(url)
    //     const searchQuery = encodeURIComponent(inputField);

    //     fetch(`http://api.genius.com/search?q=${searchQuery}&access_token=${token}`, {
    //         // headers: {
    //         //     'Authorization': `Bearer ${ accessToken }` // Use the access token for authorization
    //         // }
    //     })
    //         // fetch(`${url}&access_token=${token}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log(data);
    //             // gsetResponse(data);
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         })


    // };

    // useEffect(() => {
    //     fetchData();
    // }, [inputField]);

    const handleFormSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        if (inputField.trim() !== '') {
            fetchData(); // Fetch data when the form is submitted and inputField is not empty
            // geniusFetch();
        }
    };

    const handleInputChange = (event) => {
        setInputField(event.target.value);
        // fetchData();
    };

    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <input type="text" value={inputField} onChange={handleInputChange} />
                <button type="submit">Search</button>
            </form>
            <DisplayData data={response} />
            {/* {gresponse} */}
        </div>
    );
};

export default SearchData;
