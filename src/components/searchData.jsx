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


const SearchData = ({ username }) => {
    const [response, setResponse] = useState('');
    const [inputField, setInputField] = useState('');
    const [offset, setOffset] = useState(1);

    const fetchData = (newOffset = 1) => {
        if (inputField.trim() !== '') {
            const searchQuery = encodeURIComponent(inputField);
            fetch(`http://localhost:4000/search?query=${searchQuery}&offset=${newOffset}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setResponse(data);
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
                <DisplayData data={response} username={username} theme={theme} onLoadMore={handleLoadMore}/>
            </div>
        </ThemeProvider>
    );
}


export default SearchData;
