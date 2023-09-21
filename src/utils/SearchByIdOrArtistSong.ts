import React, { useState } from 'react';
import { Artist, DataItem, AudioDataItem, ResultItem, SongDetails } from '@appTypes/dataTypes';

interface KeyMapping {
  [key: number]: [string, string];
}
type KeyConvertFunction = (num: number, mode: number) => string;

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
const SearchByIdOrArtistSong = async ({ id, username }) => {
  try {
    const response = await fetch(`/api/getById?id=${id}`);
    const data = await response.json();
    const { trackData, audioData } = data;
    const basicData = {
      name: trackData.name,
      images: trackData.album.images[0].url,
      id: trackData.id,
      preview_url: trackData.preview_url,
      release_date: trackData.album.release_date,
      artists: trackData.artists,
      albums: trackData.album.name,
      explicit: trackData.explicit,
      popularity: trackData.popularity,
    };

    const audioFeatures = {
      key: keyConvert(audioData.key, audioData.mode),
      tempo: tempoRound(audioData.tempo),
      loudness: audioData.loudness,
      energy: audioData.energy,
      acousticness: audioData.acousticness,
      analysis_url: audioData.analysis_url,
      danceability: audioData.danceability,
      duration_ms: audioData.duration_ms,
      instrumentalness: audioData.instrumentalness,
      liveness: audioData.liveness,
      time_signature: audioData.time_signature,
      track_href: audioData.track_href,
      uri: audioData.uri,
      valence: audioData.valence,
    };
    const songDetails: ResultItem = { ...basicData, ...audioFeatures };
    let favData;
    if (username) {
      try {
        const favResponse = await fetch('/api/findfav', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, id }),
          credentials: 'include',
        });
        favData = await favResponse.json();
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }

    const pageSongDetails = {
      songDetails: songDetails,
      isFavorite: favData,
    }
    return pageSongDetails;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


export default SearchByIdOrArtistSong;
