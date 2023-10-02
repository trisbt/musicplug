import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DisplayData from './DisplayData';
import { Button } from '@mui/material';
import Input from '@mui/material/Input';
import { FormControl } from '@mui/material';
import { createTheme, ThemeProvider, styled, Theme } from '@mui/material/styles';
import { Artist, DataItem, AudioDataItem, SearchDataProps } from '@appTypes/dataTypes';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import { Hidden } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const theme: Theme = createTheme({
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
  minWidth: '45px',
  padding: 0
}));
const SmallColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.light,
  border: 'none',
  margin: 0,
  padding: 0,
  minWidth: '20px'
}));

const CloseButton = styled(CloseIcon)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: 'transparent',
  position: 'absolute',
  borderColor: 'none',
  right: '5px',
  top: '5px'
}));

const StyledInput = styled(Input)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

//main search to spotify
const SearchData = ({
  setOffset,
  offset,
  setResponse,
  response,
  setAudioInfo,
  audioInfo,
  setUserFav,
  userFav,
  // setLoading,
  // loading,
  setSearchResult,
  searchResult,
  username,
  // showLoadingCircle = false
}) => {
  const navigate = useNavigate();
  const [inputField, setInputField] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showInput, setShowInput] = useState(false);
  const [searchParams] = useSearchParams();
  const initialSearchQuery = searchParams.get('q') || '';
  const query = searchParams.get('q') || '';

  const hasFetchedForQueryRef = useRef(false);  

  useEffect(() => {
    if (query && !hasFetchedForQueryRef.current) {  
      setInputField(query);
      fetchData(1, query);
      hasFetchedForQueryRef.current = true;  
    }
  }, [query]);

  useEffect(() => {
    if (offset > 1) {
      fetchData(offset);
    }
  }, [offset]);

  const fetchData = (newOffset = 1, query = inputField) => {
    console.log("Fetch Data called with offset:", newOffset, "and query:", query);
    const idCache: string[] = [];
    if (query.trim() !== '') {
      const searchQuery = encodeURIComponent(query);
      fetch(`/api/search?query=${searchQuery}&offset=${newOffset}`)
        .then(res => res.json())
        .then(data => {
          data.tracks.items.forEach((item) => {
            idCache.push(item.id);
          })
          const searchData = data.tracks.items;
          navigate(`/?q=${searchQuery}`)
          setResponse(prev => [...prev, ...searchData]);
          setSearchResult(query || inputField);
          fetch(`/api/advancedSearch?query=${idCache.join(',')}`)
            .then(res => res.json())
            .then(data => {
              const additionalData = data.audio_features
              setAudioInfo(prev => [...prev, ...additionalData]);
            })
            .catch(error => {
              console.error('Error in advanced search:', error);
            });

          // Only fetch favorites if username exists
          if (username) {
            fetch('/api/favs', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username }),
              credentials: 'include',
            })
              .then(res => res.json())
              .then(res => {
                const favArray = res.map(el => el.id);
                const obj = {};
                for (const el of favArray) {
                  if (!obj[el]) {
                    obj[el] = true;
                  }
                }
                setUserFav(obj);
              })
              .catch(err => {
                console.log(err);
              });
          }
          //need a fetch to favorites to check if already fav and pass prop to display    
          setOffset(newOffset);
        })
        .catch(error => {

          console.error('Error:', error);
        });
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchValue = searchInputRef.current?.value || '';
    setInputField(searchValue);
    setResponse([]);
    setAudioInfo([]);
    fetchData(1, searchValue);
    setShowInput(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className='searchform-container'>
        <Hidden smDown>
          <form className='searchform' onSubmit={handleFormSubmit} style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <FormControl sx={{

              width: '280px'
            }}>
              <StyledInput
                className='searchbox'

                placeholder='Search for songs, artists, albums...'
                type='text'
                inputRef={searchInputRef}
              />
            </FormControl>
            <ColorButton type='submit' variant='outlined'>
              <SearchIcon sx={{ fontSize: '28px' }} />
              {/* Search */}
            </ColorButton>
          </form>
        </Hidden>

        <Hidden smUp>
          {!showInput ? (
            <SmallColorButton onClick={() => setShowInput(true)} variant='outlined'>
              <SearchIcon sx={{ fontSize: '28px' }} />


            </SmallColorButton>
          ) : (
            <form className='sm-searchform' onSubmit={handleFormSubmit}
              style={{
                display: 'flex',
                position: 'absolute',
                margin: 0,
                padding: 0,
                top: 5,
                left: -6,
                // border: '2px solid black',
                width: '95vw',
                zIndex: 2,
                background: 'white',
                boxSizing: 'border-box', 
              }}
            >
              <FormControl style={{ width: '100%' }}>
                <StyledInput
                  className='searchbox'
                  placeholder='Search for songs, artists, albums...'
                  type='text'
                  inputRef={searchInputRef}
                  autoFocus
                />
              </FormControl>
              <SmallColorButton onClick={() => setShowInput(false)} variant='outlined' style={{ marginLeft: '10px' }}>
                <CloseIcon sx={{
                  border: 'none',
                  color: 'black',
                }} />
              </SmallColorButton>
            </form>
          )}
        </Hidden>
      </div>
    </ThemeProvider>
  );

}



export default SearchData;
