export interface SpotifyTrack {
  id: string;
  name: string;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  duration_ms: number;
  popularity: number;
  uri: string;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
  total_tracks: number;
  uri: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
  images?: SpotifyImage[];
}

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface TimelineItem {
  track: SpotifyTrack;
  playCount: number;
  timestamp: Date;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  images: SpotifyImage[];
  uri: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: SpotifyImage[];
  owner: SpotifyUser;
  tracks: {
    total: number;
    items: SpotifyTrack[];
  };
  uri: string;
}

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';
