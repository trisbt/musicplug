import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function NavSearchBar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    return (
        <TextField
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={isExpanded ? "find songs..." : ""}
        variant="outlined"
        fullWidth
        size="small" 
        style={{
          transition: 'all 0.3s',
          paddingRight:'1em'
        }}
        InputProps={{
          style: {
            width: isExpanded ? '100%' : '40px',
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: isExpanded ? 'white' : '#fafafa',
            borderRadius: isExpanded ? '0' : '60px',
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => {
                  setIsExpanded((prev) => !prev);
                  if (!isExpanded) {
                    setTimeout(() => document.querySelector('.expanding-search-input').focus(), 310);
                  }
                }}
                sx={{
                    '&:hover': {
                        backgroundColor: 'transparent',
                    },
                    padding:'0',
                    display: 'flex', // Ensures the button is a flex container
                    alignItems: 'center', // Centers children vertically
                    justifyContent: 'center', // Centers children horizontally
                   
                }}
              >
                <SearchIcon sx ={{
                    paddingRight:'6px',
                }}/>
              </IconButton>
            </InputAdornment>
          ),
        }}
        className="expanding-search-input"
      />
    );
}

export default NavSearchBar;
