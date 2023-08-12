import React, { useState } from 'react';
import DisplayData from './displayData';
import { Button } from '@mui/material';
import Input from '@mui/material/Input';
import { FormControl } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
// import { styled } from '@mui/system';

const theme = createTheme({
    palette: {
        primary: {
            light: '#99cbfd',
            main: '#4d97f8',
            dark: '#3746a2',
            contrastText: '#fff',
        },
        secondary: {
            light: '#fffbe8',
            main: '#eec94b',
            dark: '#9e7937',
            contrastText: '#000',
        },
    },
});

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.secondary.light,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
    // padding: theme.spacing(1.2),

}));
const StyledInput = styled(Input)(({ theme }) => ({
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    // borderRadius: theme.shape.borderRadius,

}));

//main search to spotify
//need to fix load more data; replacing the data before it and when it renders user is navigated to the bottom
const SearchData = ({ username }) => {
    const [response, setResponse] = useState([]);
    const [audioInfo, setAudioInfo] = useState([]);
    const [inputField, setInputField] = useState('');
    const [offset, setOffset] = useState(1);
    

    const fetchData = (newOffset = 1) => {
        const idCache = [];
        if (inputField.trim() !== '') {
            const searchQuery = encodeURIComponent(inputField);
            fetch(`http://localhost:4000/search?query=${searchQuery}&offset=${newOffset}`)
                .then(res => res.json())
                .then(data => {
                    // console.log(data)
                    data.tracks.items.forEach((item) => {
                        idCache.push(item.id);
                    })
                    const searchData = data.tracks.items;
                    // console.log(searchData)
                    setResponse(prev => [...prev, ...searchData]);
                    fetch(`http://localhost:4000/advancedSearch?query=${idCache.join(',')}`)
                        .then(res => res.json())
                        .then(data => {
                            const additionalData = data.audio_features
                            setAudioInfo(prev => [...prev, ...additionalData]);
                        })
                        .catch(error => {
                            console.error('Error in advanced search:', error);
                        });
                    setOffset(newOffset);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    };


    const handleFormSubmit = (event) => {
        event.preventDefault();
        fetchData();
    };

    const handleInputChange = (event) => {
        setInputField(event.target.value);
    };
    const handleLoadMore = () => {
        const nextOffset = offset + 50;
        fetchData(nextOffset);

    }



    return (
        <ThemeProvider theme={theme}>
            <div>
                <form className='searchform' onSubmit={handleFormSubmit}>
                    <FormControl>
                        <StyledInput
                            className='searchbox'
                            placeholder='find songs'
                            type='text'
                            value={inputField}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <ColorButton type='submit' variant='outlined'>
                        Search
                    </ColorButton>
                </form>
                <DisplayData data={response} audioData={audioInfo} username={username} theme={theme} onLoadMore={handleLoadMore} inputField={inputField} />
            </div>
        </ThemeProvider>
    );
}


export default SearchData;
