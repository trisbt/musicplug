import React from "react";

export interface Artist {
    name: string;
}
export interface DataItem {
    name: string;
    album: {
        images: { url: string }[];
        release_date: string;
        name: string;
    };
    artists: Artist[];
    preview_url: string;
    explicit: boolean;
    popularity: number;
    id: string;
}
export interface AudioDataItem {
    key: number;
    mode: number;
    tempo: number;
    loudness: number;
    energy: number;
    acousticness: number;
    analysis_url: string;
    danceability: number;
    duration_ms: number;
    instrumentalness: number;
    liveness: number;
    time_signature: number;
    track_href: string;
    uri: string;
    valence: number;
}


export interface ResultItem {
  name: string;
  images: string;
  id: string;
  preview_url?: string;
  release_date: string;
  artists: { name: string }[];
  albums: string;
  explicit?: boolean;
  popularity: number;
  key?: string;
  tempo?: number;
  loudness?: number;
  energy?: number;
  acousticness?: number;
  analysis_url?: string;
  danceability?: number;
  duration_ms?: number;
  instrumentalness?: number;
  liveness?: number;
  time_signature?: number;
  track_href?: string;
  uri?: string;
  valence?: number;
}

export interface SongDetails {
    id: string;
    name: string;
    artists: Artist[];
    albums: any[];  
    images: string;  
    release_date: string;
    preview_url: string;
    key: number;
    tempo: number;
    loudness: number;
    energy: number;
    acousticness: number;
    analysis_url: string;
    danceability: number;
    duration_ms: number;
    instrumentalness: number;
    liveness: number;
    time_signature: number;
    track_href: string;
    uri: string;
    valence: number;
    explicit: boolean;
    popularity: number;
  }

  
  export interface LocationState {
    songDetails?: SongDetails;
    username?: string;
    isFavorite?: boolean;
  }

  export interface SearchDataProps {
    key?: string;
    username?: string;
    customStyles?: React.CSSProperties;
    pStyles?: React.CSSProperties;    
    showLoadingCircle?: boolean;      
}


export interface SongPageProps {
  username?: string; 
}
