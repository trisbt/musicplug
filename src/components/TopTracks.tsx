import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createTheme, Box, Button, Card, CardContent, CardMedia, Grid, IconButton, styled, Typography, Theme } from '@mui/material';
import DisplayData from './DisplayData';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { grey } from '@mui/material/colors';
import { Artist, DataItem, AudioDataItem, ResultItem } from '@appTypes/dataTypes';

interface KeyMapping {
  [key: number]: [string, string];
}
type KeyConvertFunction = (num: number, mode: number) => string;

type CombinedDataType = DataItem & AudioDataItem;

interface DisplayDataProps {
  data: DataItem[];
  audioData: AudioDataItem[];
  username?: string | null;
  onLoadMore: () => void;
  userFav?: Record<string, boolean>;
  searchResult: string;
  customStyles?: React.CSSProperties;
  theme?: Theme;
}

//styled buttons
const SmallPlayButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: grey[900],
  '&:hover': {
    color: 'white',
    backgroundColor: '#00e676'
  },
  fontSize: '15px',
  width: '40px',
  height: '40px',
}));
const SmallFavButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: grey[900],
  '&:hover': {
    color: 'white',
    backgroundColor: '#00e676'
  },
  fontSize: '15px',
  width: '40px',
  height: '40px',
}));
const FavSolid = styled(GradeIcon)(({ theme }) => ({
  color: theme.palette.secondary.main,
  '&:hover': {
    color: theme.palette.secondary.dark,
    backgroundColor: 'none',
  },
}));
const FavOutlined = styled(GradeOutlinedIcon)(({ theme }) => ({
  color: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: 'none',
    color: theme.palette.secondary.dark,
  },
}));
const LoadButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.secondary.dark,
  '&:hover': {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText,
  },
  // padding: theme.spacing(1.2),
}));

//bpm and key helper conversions
const keyConvert: KeyConvertFunction = (num: number, mode: number): string => {
  const chart: KeyMapping = {
    '0': ['C', 'Am'],
    '1': ['Db', 'Bbm'],
    '2': ['D', 'Bm'],
    '3': ['Eb', 'Cm'],
    '4': ['E', 'C#m'],
    '5': ['F', 'Dm'],
    '6': ['Gb', 'Ebm'],
    '7': ['G', 'Em'],
    '8': ['Ab', 'Fm'],
    '9': ['A', 'F#m'],
    '10': ['Bb', 'Gm'],
    '11': ['B', 'G#m'],
  }

  if (mode === 1) {
    return chart[num][0];
  } else if (mode === 0) {
    return chart[num][1];
  } else {
    return "Unknown";
  }
}
function tempoRound(num: number): number {
  return Math.round(num * 2) / 2;
}

const TopTracks = ({ username }) => {
  const [combinedTracks, setCombinedTracks] = useState([
    {
        "name": "Paint The Town Red",
        "images": "https://i.scdn.co/image/ab67616d0000b2737acee948ecac8380c1b6ce30",
        "id": "2IGMVunIBsBLtEQyoI1Mu7",
        "preview_url": "https://p.scdn.co/mp3-preview/1d4dc1cd67ba78afec8cfb3e5258a9ab9b707dd8?cid=f0bb764e36ca4e2395b1c38f84c9764c",
        "release_date": "2023-08-04",
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/5cj0lLjcoR7YOSnhnX0Po5"
                },
                "href": "https://api.spotify.com/v1/artists/5cj0lLjcoR7YOSnhnX0Po5",
                "id": "5cj0lLjcoR7YOSnhnX0Po5",
                "name": "Doja Cat",
                "type": "artist",
                "uri": "spotify:artist:5cj0lLjcoR7YOSnhnX0Po5"
            }
        ],
        "albums": "Paint The Town Red",
        "explicit": true,
        "popularity": 100,
        "key": "F",
        "tempo": 100,
        "loudness": -8.603,
        "energy": 0.538,
        "acousticness": 0.269,
        "analysis_url": "https://api.spotify.com/v1/audio-analysis/2IGMVunIBsBLtEQyoI1Mu7",
        "danceability": 0.868,
        "duration_ms": 231750,
        "instrumentalness": 0.00000334,
        "liveness": 0.0901,
        "time_signature": 4,
        "track_href": "https://api.spotify.com/v1/tracks/2IGMVunIBsBLtEQyoI1Mu7",
        "uri": "spotify:track:2IGMVunIBsBLtEQyoI1Mu7",
        "valence": 0.732
    },
    {
        "name": "Seven (feat. Latto) (Explicit Ver.)",
        "images": "https://i.scdn.co/image/ab67616d0000b273bf5cce5a0e1ed03a626bdd74",
        "id": "7x9aauaA9cu6tyfpHnqDLo",
        "preview_url": "https://p.scdn.co/mp3-preview/2f2b3f4eaf405ac3ba9792456cec93ae88942cfc?cid=f0bb764e36ca4e2395b1c38f84c9764c",
        "release_date": "2023-07-14",
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/6HaGTQPmzraVmaVxvz6EUc"
                },
                "href": "https://api.spotify.com/v1/artists/6HaGTQPmzraVmaVxvz6EUc",
                "id": "6HaGTQPmzraVmaVxvz6EUc",
                "name": "Jung Kook",
                "type": "artist",
                "uri": "spotify:artist:6HaGTQPmzraVmaVxvz6EUc"
            },
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/3MdXrJWsbVzdn6fe5JYkSQ"
                },
                "href": "https://api.spotify.com/v1/artists/3MdXrJWsbVzdn6fe5JYkSQ",
                "id": "3MdXrJWsbVzdn6fe5JYkSQ",
                "name": "Latto",
                "type": "artist",
                "uri": "spotify:artist:3MdXrJWsbVzdn6fe5JYkSQ"
            }
        ],
        "albums": "Seven (feat. Latto)",
        "explicit": true,
        "popularity": 97,
        "key": "B",
        "tempo": 125,
        "loudness": -4.107,
        "energy": 0.832,
        "acousticness": 0.311,
        "analysis_url": "https://api.spotify.com/v1/audio-analysis/7x9aauaA9cu6tyfpHnqDLo",
        "danceability": 0.802,
        "duration_ms": 185427,
        "instrumentalness": 0,
        "liveness": 0.0815,
        "time_signature": 4,
        "track_href": "https://api.spotify.com/v1/tracks/7x9aauaA9cu6tyfpHnqDLo",
        "uri": "spotify:track:7x9aauaA9cu6tyfpHnqDLo",
        "valence": 0.89
    },
    {
        "name": "Cruel Summer",
        "images": "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647",
        "id": "1BxfuPKGuaTgP7aM0Bbdwr",
        "preview_url": null,
        "release_date": "2019-08-23",
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02"
                },
                "href": "https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02",
                "id": "06HL4z0CvFAxyc27GXpf02",
                "name": "Taylor Swift",
                "type": "artist",
                "uri": "spotify:artist:06HL4z0CvFAxyc27GXpf02"
            }
        ],
        "albums": "Lover",
        "explicit": false,
        "popularity": 98,
        "key": "A",
        "tempo": 170,
        "loudness": -5.707,
        "energy": 0.702,
        "acousticness": 0.117,
        "analysis_url": "https://api.spotify.com/v1/audio-analysis/1BxfuPKGuaTgP7aM0Bbdwr",
        "danceability": 0.552,
        "duration_ms": 178427,
        "instrumentalness": 0.0000206,
        "liveness": 0.105,
        "time_signature": 4,
        "track_href": "https://api.spotify.com/v1/tracks/1BxfuPKGuaTgP7aM0Bbdwr",
        "uri": "spotify:track:1BxfuPKGuaTgP7aM0Bbdwr",
        "valence": 0.564
    },
    {
        "name": "vampire",
        "images": "https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d",
        "id": "1kuGVB7EU95pJObxwvfwKS",
        "preview_url": null,
        "release_date": "2023-09-08",
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/1McMsnEElThX1knmY4oliG"
                },
                "href": "https://api.spotify.com/v1/artists/1McMsnEElThX1knmY4oliG",
                "id": "1McMsnEElThX1knmY4oliG",
                "name": "Olivia Rodrigo",
                "type": "artist",
                "uri": "spotify:artist:1McMsnEElThX1knmY4oliG"
            }
        ],
        "albums": "GUTS",
        "explicit": true,
        "popularity": 93,
        "key": "F",
        "tempo": 138,
        "loudness": -5.745,
        "energy": 0.532,
        "acousticness": 0.177,
        "analysis_url": "https://api.spotify.com/v1/audio-analysis/1kuGVB7EU95pJObxwvfwKS",
        "danceability": 0.511,
        "duration_ms": 219724,
        "instrumentalness": 0,
        "liveness": 0.291,
        "time_signature": 4,
        "track_href": "https://api.spotify.com/v1/tracks/1kuGVB7EU95pJObxwvfwKS",
        "uri": "spotify:track:1kuGVB7EU95pJObxwvfwKS",
        "valence": 0.35
    },
    {
        "name": "QLONA",
        "images": "https://i.scdn.co/image/ab67616d0000b273d026bf9d7780f6a1267b4d03",
        "id": "5RqSsdzTNPX1uzkmlHCFvK",
        "preview_url": null,
        "release_date": "2023-08-10",
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/790FomKkXshlbRYZFtlgla"
                },
                "href": "https://api.spotify.com/v1/artists/790FomKkXshlbRYZFtlgla",
                "id": "790FomKkXshlbRYZFtlgla",
                "name": "KAROL G",
                "type": "artist",
                "uri": "spotify:artist:790FomKkXshlbRYZFtlgla"
            },
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/12GqGscKJx3aE4t07u7eVZ"
                },
                "href": "https://api.spotify.com/v1/artists/12GqGscKJx3aE4t07u7eVZ",
                "id": "12GqGscKJx3aE4t07u7eVZ",
                "name": "Peso Pluma",
                "type": "artist",
                "uri": "spotify:artist:12GqGscKJx3aE4t07u7eVZ"
            }
        ],
        "albums": "MAÑANA SERÁ BONITO (BICHOTA SEASON)",
        "explicit": true,
        "popularity": 92,
        "key": "Em",
        "tempo": 170,
        "loudness": -7.455,
        "energy": 0.738,
        "acousticness": 0.52,
        "analysis_url": "https://api.spotify.com/v1/audio-analysis/5RqSsdzTNPX1uzkmlHCFvK",
        "danceability": 0.841,
        "duration_ms": 172798,
        "instrumentalness": 0,
        "liveness": 0.0892,
        "time_signature": 4,
        "track_href": "https://api.spotify.com/v1/tracks/5RqSsdzTNPX1uzkmlHCFvK",
        "uri": "spotify:track:5RqSsdzTNPX1uzkmlHCFvK",
        "valence": 0.484
    },
    {
        "name": "Slime You Out (feat. SZA)",
        "images": "https://i.scdn.co/image/ab67616d0000b2733b2df9103b8b1bad69ec4aa9",
        "id": "3RaCGXCiiMufRPoexXxGkV",
        "preview_url": null,
        "release_date": "2023-09-15",
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4"
                },
                "href": "https://api.spotify.com/v1/artists/3TVXtAsR1Inumwj472S9r4",
                "id": "3TVXtAsR1Inumwj472S9r4",
                "name": "Drake",
                "type": "artist",
                "uri": "spotify:artist:3TVXtAsR1Inumwj472S9r4"
            },
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/7tYKF4w9nC0nq9CsPZTHyP"
                },
                "href": "https://api.spotify.com/v1/artists/7tYKF4w9nC0nq9CsPZTHyP",
                "id": "7tYKF4w9nC0nq9CsPZTHyP",
                "name": "SZA",
                "type": "artist",
                "uri": "spotify:artist:7tYKF4w9nC0nq9CsPZTHyP"
            }
        ],
        "albums": "Slime You Out",
        "explicit": true,
        "popularity": 89,
        "key": "Dm",
        "tempo": 89,
        "loudness": -9.243,
        "energy": 0.408,
        "acousticness": 0.508,
        "analysis_url": "https://api.spotify.com/v1/audio-analysis/3RaCGXCiiMufRPoexXxGkV",
        "danceability": 0.483,
        "duration_ms": 310491,
        "instrumentalness": 0,
        "liveness": 0.259,
        "time_signature": 3,
        "track_href": "https://api.spotify.com/v1/tracks/3RaCGXCiiMufRPoexXxGkV",
        "uri": "spotify:track:3RaCGXCiiMufRPoexXxGkV",
        "valence": 0.105
    },
    {
        "name": "LALA",
        "images": "https://i.scdn.co/image/ab67616d0000b2730656d5ce813ca3cc4b677e05",
        "id": "7ABLbnD53cQK00mhcaOUVG",
        "preview_url": "https://p.scdn.co/mp3-preview/42772b16b4e575d1b15b0ec7f94e335539390d2d?cid=f0bb764e36ca4e2395b1c38f84c9764c",
        "release_date": "2023-03-23",
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/7iK8PXO48WeuP03g8YR51W"
                },
                "href": "https://api.spotify.com/v1/artists/7iK8PXO48WeuP03g8YR51W",
                "id": "7iK8PXO48WeuP03g8YR51W",
                "name": "Myke Towers",
                "type": "artist",
                "uri": "spotify:artist:7iK8PXO48WeuP03g8YR51W"
            }
        ],
        "albums": "LA VIDA ES UNA",
        "explicit": true,
        "popularity": 97,
        "key": "Db",
        "tempo": 92,
        "loudness": -4.045,
        "energy": 0.737,
        "acousticness": 0.0739,
        "analysis_url": "https://api.spotify.com/v1/audio-analysis/7ABLbnD53cQK00mhcaOUVG",
        "danceability": 0.708,
        "duration_ms": 197920,
        "instrumentalness": 0.00162,
        "liveness": 0.0955,
        "time_signature": 4,
        "track_href": "https://api.spotify.com/v1/tracks/7ABLbnD53cQK00mhcaOUVG",
        "uri": "spotify:track:7ABLbnD53cQK00mhcaOUVG",
        "valence": 0.607
    },
    {
        "name": "Strangers",
        "images": "https://i.scdn.co/image/ab67616d0000b2734756c2e9ae436437cd75e9f3",
        "id": "5mjYQaktjmjcMKcUIcqz4s",
        "preview_url": "https://p.scdn.co/mp3-preview/f8e667575db490b61ccc4d0948a6be922cfe1c5e?cid=f0bb764e36ca4e2395b1c38f84c9764c",
        "release_date": "2023-09-01",
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/7uMDnSZyUYNBPLhPMNuaM2"
                },
                "href": "https://api.spotify.com/v1/artists/7uMDnSZyUYNBPLhPMNuaM2",
                "id": "7uMDnSZyUYNBPLhPMNuaM2",
                "name": "Kenya Grace",
                "type": "artist",
                "uri": "spotify:artist:7uMDnSZyUYNBPLhPMNuaM2"
            }
        ],
        "albums": "Strangers",
        "explicit": false,
        "popularity": 93,
        "key": "G#m",
        "tempo": 170,
        "loudness": -8.307,
        "energy": 0.523,
        "acousticness": 0.701,
        "analysis_url": "https://api.spotify.com/v1/audio-analysis/5mjYQaktjmjcMKcUIcqz4s",
        "danceability": 0.628,
        "duration_ms": 172965,
        "instrumentalness": 0.00274,
        "liveness": 0.219,
        "time_signature": 4,
        "track_href": "https://api.spotify.com/v1/tracks/5mjYQaktjmjcMKcUIcqz4s",
        "uri": "spotify:track:5mjYQaktjmjcMKcUIcqz4s",
        "valence": 0.416
    },
    {
        "name": "bad idea right?",
        "images": "https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d",
        "id": "3IX0yuEVvDbnqUwMBB3ouC",
        "preview_url": null,
        "release_date": "2023-09-08",
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/1McMsnEElThX1knmY4oliG"
                },
                "href": "https://api.spotify.com/v1/artists/1McMsnEElThX1knmY4oliG",
                "id": "1McMsnEElThX1knmY4oliG",
                "name": "Olivia Rodrigo",
                "type": "artist",
                "uri": "spotify:artist:1McMsnEElThX1knmY4oliG"
            }
        ],
        "albums": "GUTS",
        "explicit": true,
        "popularity": 92,
        "key": "A",
        "tempo": 130,
        "loudness": -3.446,
        "energy": 0.879,
        "acousticness": 0.00193,
        "analysis_url": "https://api.spotify.com/v1/audio-analysis/3IX0yuEVvDbnqUwMBB3ouC",
        "danceability": 0.627,
        "duration_ms": 184784,
        "instrumentalness": 0.00000687,
        "liveness": 0.0647,
        "time_signature": 4,
        "track_href": "https://api.spotify.com/v1/tracks/3IX0yuEVvDbnqUwMBB3ouC",
        "uri": "spotify:track:3IX0yuEVvDbnqUwMBB3ouC",
        "valence": 0.748
    },
    {
        "name": "Dance The Night - From Barbie The Album",
        "images": "https://i.scdn.co/image/ab67616d0000b2737dd3ba455ee3390cb55b0192",
        "id": "1vYXt7VSjH9JIM5oRRo7vA",
        "preview_url": "https://p.scdn.co/mp3-preview/acaea048f50a3b30ca24b348c84a6047373baabb?cid=f0bb764e36ca4e2395b1c38f84c9764c",
        "release_date": "2023-05-25",
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we"
                },
                "href": "https://api.spotify.com/v1/artists/6M2wZ9GZgrQXHCFfjv46we",
                "id": "6M2wZ9GZgrQXHCFfjv46we",
                "name": "Dua Lipa",
                "type": "artist",
                "uri": "spotify:artist:6M2wZ9GZgrQXHCFfjv46we"
            }
        ],
        "albums": "Dance The Night (From Barbie The Album)",
        "explicit": false,
        "popularity": 95,
        "key": "G#m",
        "tempo": 110,
        "loudness": -4.93,
        "energy": 0.845,
        "acousticness": 0.0207,
        "analysis_url": "https://api.spotify.com/v1/audio-analysis/1vYXt7VSjH9JIM5oRRo7vA",
        "danceability": 0.671,
        "duration_ms": 176579,
        "instrumentalness": 0,
        "liveness": 0.329,
        "time_signature": 4,
        "track_href": "https://api.spotify.com/v1/tracks/1vYXt7VSjH9JIM5oRRo7vA",
        "uri": "spotify:track:1vYXt7VSjH9JIM5oRRo7vA",
        "valence": 0.775
    }
]);
  const [topUserFav, setTopUserFav] = useState([]);
  const [currentlyPlayingUrl, setCurrentlyPlayingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

//old fetch for top tracks
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const [topTracksResponse, favsResponse] = await Promise.all([
  //         fetch('/api/toptracks'),
  //         username ? fetch('/api/favs', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ username }),
  //           credentials: 'include',
  //         }) : Promise.resolve(null)
  //       ]);

  //       const rawCombinedData = await topTracksResponse.json();

  //       const processedData = rawCombinedData.map(item => {
  //         const { name, preview_url, explicit, popularity, artists, id } = item;
  //         const images = item.album.images[0].url;
  //         const release_date = item.album.release_date;
  //         const albums = item.album.name;
  //         const key = keyConvert(item.key, item.mode);
  //         const tempo = tempoRound(item.tempo);
  //         const { loudness, energy, acousticness, analysis_url, danceability, duration_ms, instrumentalness, liveness, time_signature, track_href, uri, valence } = item;

  //         return {
  //           name, images, id, preview_url, release_date, artists, albums, explicit, popularity,
  //           key, tempo, loudness, energy, acousticness, analysis_url, danceability, duration_ms, instrumentalness, liveness, time_signature, track_href, uri, valence
  //         };
  //       });
  //       // console.log(processedData);
  //       setCombinedTracks(processedData);

  //       if (username) {
  //         const favData = await favsResponse?.json();
  //         const favArray = favData.favorites.map(el => el.id);
  //         const obj = {};
  //         for (const el of favArray) {
  //           if (!obj[el]) {
  //             obj[el] = true;
  //           }
  //         }
  //         setTopUserFav(obj);
  //       }

  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }

  //   fetchData();
  // }, []);

  useEffect(() => {
    async function fetchFavs() {
        if (!username) return;  
        try {
            const response = await fetch('/api/favs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
                credentials: 'include',
            });
            const favData = await response.json();
            const favArray = favData.map(el => el.id);
            const obj = {};
            for (const el of favArray) {
                if (!obj[el]) {
                    obj[el] = true;
                }
            }
            setTopUserFav(obj);

        } catch (err) {
            console.log(err);
        }
    }
    fetchFavs();
}, [username]);  

  const playAudio = (event: React.MouseEvent, previewUrl: string | null) => {
    event.stopPropagation();
    event.preventDefault();
    if (audioRef.current && previewUrl) {
      audioRef.current.volume = .3;

      if (audioRef.current.src === previewUrl && !audioRef.current.paused) {
        audioRef.current.pause();
        setCurrentlyPlayingUrl(null);
      } else {
        if (!audioRef.current.paused) {
          // Stop currently playing audio if there is any
          audioRef.current.pause();
        }
        audioRef.current.src = previewUrl;
        audioRef.current.play();
        setCurrentlyPlayingUrl(previewUrl);
      }
    }
  };

  interface HandleFavoriteItem {
    id: string;
    name: string;
    artists: string[];
    albums: string;
    images: string;
    key: string;
    tempo: number;
    loudness: number;
  }

  const handleFavorite = async (event: React.MouseEvent, item, username: string) => {
    event.stopPropagation();
    event.preventDefault();
    const { id, name, artists, albums, images, key, tempo, loudness } = item;
    try {
      const response = await fetch('/api/addFavs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, id, name, artists, albums, images, key, tempo, loudness, }),
        credentials: 'include',
      });
      const data = await response.json();
      //add like
      if (data.isFavorite === 'added') {
        setTopUserFav((prevMap) => ({
          ...prevMap,
          [id]: true,
        }));
        // remove like
      } else {
        setTopUserFav((prevMap) => ({
          ...prevMap,
          [id]: false,
        }));
      }
    } catch (error) {
      console.error('Error adding track to favorites:', error);
    }
  };

  return (
    <div>

      <Box>
        <Grid container item xs={12} justifyContent='center' alignItems='center' >
          {combinedTracks.length > 0 && (
            <>
              {/* text row */}
              <Grid item xs={11} md={8}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    margin: '10px 10px 0',
                    boxShadow: 3,
                    justifyContent: 'center',
                    backgroundColor: 'rgb(0, 71, 212, .6)',

                  }}
                >
                  <Typography variant='h4' sx={{
                    display: 'flex',

                    alignItems: 'center',
                    color: '#e8eaf6',
                    fontWeight: 'bold',
                    background: '#e8eaf6',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '1px',
                    borderRadius: '2px',
                    textTransform: 'uppercase',
                    '@media (max-width: 600px)': {
                      fontSize: '24px'
                    },
                  }}>
                    Daily Top Tracks
                  </Typography>
                </Card>
              </Grid>

              {/* main search */}
              {combinedTracks.map((item: ResultItem, index: number) => (

                <Grid item xs={11} md={8} key={index}>
                  {/* each card */}
                  <Link
                    to={{
                      pathname: `/${encodeURIComponent(item.name)}/${encodeURIComponent(item.artists[0].name)}/${item.id}`,
                    }}
                    state={{
                      songDetails: {
                        id: item.id,
                        name: item.name,
                        artists: item.artists,
                        albums: item.albums,
                        images: item.images,
                        release_date: item.release_date,
                        preview_url: item.preview_url,
                        key: item.key,
                        tempo: item.tempo,
                        loudness: item.loudness,
                        energy: item.energy,
                        acousticness: item.acousticness,
                        analysis_url: item.analysis_url,
                        danceability: item.danceability,
                        duration_ms: item.duration_ms,
                        instrumentalness: item.instrumentalness,
                        liveness: item.liveness,
                        time_signature: item.time_signature,
                        track_href: item.track_href,
                        uri: item.uri,
                        valence: item.valence,
                        explicit: item.explicit,
                        popularity: item.popularity,
                      },
                      username: username,
                      isFavorite: topUserFav[item.id] || false,
                    }}
                    key={index}
                  >

                    {/* <div key={index} > */}
                    <Card
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        margin: '10px 10px 0',
                        boxShadow: 3,
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        }
                      }}
                    >
                      <CardContent sx={{
                        paddingBottom: '15px',
                        '&:last-child': {
                          paddingBottom: '15px',
                        }
                      }}>
                        <Grid container >
                          {/* image */}
                          <Grid item xs={3} sm={2} >
                            <CardMedia
                              component="img"
                              sx={{
                                // width: '80%',
                                "@media (max-width: 600px)": {
                                  // width: '100%',
                                  // height:'60%'
                                }
                              }}
                              image={item.images}
                              alt={item.name}
                            />
                          </Grid>
                          {/* song info */}
                          <Grid item xs={9} sm={5} sx={{
                            paddingLeft: '.5em',
                          }}>
                            <Typography component="div" color="text.primary" variant="h5" sx={{
                              "@media (max-width: 600px)": {
                                fontSize: '1rem'
                              },
                            }}>
                              {item.name}
                            </Typography>
                            <Typography variant="h6" color="text.secondary" component="div" sx={{
                              "@media (max-width: 600px)": {
                                fontSize: '1rem'
                              },
                            }}>
                              {item.artists.map((artist, index) => (
                                <span key={index}>
                                  {artist.name}
                                  {index < item.artists.length - 1 && (
                                    <span style={{ color: '#B3C7ED', fontStyle: 'italic', marginLeft: '5px', marginRight: '5px' }}>|</span>
                                  )}
                                </span>
                              ))}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div" sx={{
                              "@media (max-width: 600px)": {
                                fontSize: '.7em',
                              }
                            }}>
                              {item.albums}
                            </Typography>
                          </Grid>

                          <Grid container item xs={12} sm={5} alignItems='center' rowSpacing={1} sx={{
                            "@media (max-width: 600px)": {
                              paddingTop: '.8rem',
                            }
                          }}>
                            <Grid item xs={3} sm={6}  >
                              {/* <Card sx={{ width: '90%' }}> */}
                              <Typography variant="subtitle1" color="text.secondary" component="div"
                                sx={{
                                  display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '0.5rem',
                                  "@media (max-width: 600px)": {
                                    fontSize: '.8em',
                                  }
                                }}
                              >
                                Key
                                <Typography className='song-sub-info' variant="h4" color="text.primary" component="div" sx={{
                                  "@media (max-width: 600px)": {
                                    fontSize: '1.5rem',
                                  }
                                }}>
                                  {item.key}
                                </Typography>
                              </Typography>
                              {/* </Card> */}
                            </Grid>

                            <Grid item xs={3.5} sm={6} sx={{
                              "@media (max-width: 600px)": {
                                marginRight: '.5em',
                              }
                            }}>
                              {/* <Card sx={{ width: '90%' }}> */}
                              <Typography variant="subtitle1" color="text.secondary" component="div"
                                sx={{
                                  display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '0.5rem',
                                  "@media (max-width: 600px)": {
                                    fontSize: '.8em',
                                  }
                                }}
                              >
                                BPM
                                <Typography className='song-sub-info' variant="h4" color="text.primary" component="div" sx={{
                                  "@media (max-width: 600px)": {
                                    fontSize: '1.5rem',
                                  }
                                }}>
                                  {item.tempo}
                                </Typography>
                              </Typography>
                              {/* </Card> */}
                            </Grid>

                            {/* fav button */}
                            <Grid item xs={2.5} sm={6} sx={{
                              display: 'flex',
                              justifyContent: 'center'
                            }}>
                              {username && (
                                <SmallFavButton
                                  size='small'
                                  className='small-fav-icon-button'
                                  onClick={(event) => handleFavorite(event, item, username)}
                                  sx={{
                                    boxShadow: 3,
                                  }}
                                >
                                  {topUserFav[item.id] ? <FavSolid /> : <FavOutlined />}
                                </SmallFavButton>
                              )}
                            </Grid>

                            {/* preview button */}
                            <Grid item xs={2.5} sm={6} sx={{
                              display: 'flex',
                              justifyContent: 'center'
                            }} >
                              {item.preview_url && (
                                <SmallPlayButton className='preview-button' sx={{
                                  boxShadow: 3,
                                  borderRadius: '50px',
                                  // display: { xs: 'flex', sm: 'none', md: 'none' },
                                }}
                                  onClick={(event) => playAudio(event, item.preview_url || null)}
                                >
                                  {currentlyPlayingUrl === item.preview_url ? (
                                    <>
                                      <StopIcon aria-label="stop"
                                        sx={{
                                          height: 36,
                                          width: 36,
                                        }}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <PlayArrowIcon aria-label="play/pause"
                                        sx={{
                                          height: 35,
                                          width: 35,
                                        }}
                                      />
                                    </>
                                  )}
                                </SmallPlayButton>
                              )}
                              <audio ref={audioRef}></audio>
                            </Grid>

                            {/* </Grid> */}
                          </Grid>
                        </Grid>
                      </CardContent>

                    </Card>


                  </Link>
                </Grid>
              ))}
            </>
          )
          }
        </Grid >
      </Box>
    </div >
  );

}
export default TopTracks;




