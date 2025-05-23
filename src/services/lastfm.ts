import { Album} from '../types/Album';
import { Artist} from '../types/Artist';
import { Track } from '../types/Track';

const API_KEY = "2467e45594a2085cd6fbcdb081b93c5f";

const createApiUrl = (method: string, params: Record<string, string>) => {
  const urlParams = new URLSearchParams({
    api_key: API_KEY,
    format: 'json',
    method: method,
    ...params,
  });
  return `http://ws.audioscrobbler.com/2.0/?${urlParams.toString()}`;
};

export const searchArtists = async (searchTerm: string): Promise<Artist[]> => {
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(searchTerm)}&api_key=${API_KEY}&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (
      data &&
      data.results &&
      data.results.artistmatches &&
      data.results.artistmatches.artist
    ) {
      return data.results.artistmatches.artist;
    }
    return [];
  } catch (error) {
    console.error('Error searching artists:', error);
    return [];
  }
};

export const searchAlbums = async (searchTerm: string): Promise<Album[]> => {
  const url = `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(searchTerm)}&api_key=${API_KEY}&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (
      data &&
      data.results &&
      data.results.albummatches &&
      data.results.albummatches.album
    ) {
      return data.results.albummatches.album;
    }
    return [];
  } catch (error) {
    console.error('Error searching albums:', error);
    return [];
  }
};

export const searchTracks = async (searchTerm: string): Promise<Track[]> => {
  const url = `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(searchTerm)}&api_key=${API_KEY}&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (
      data &&
      data.results &&
      data.results.trackmatches &&
      data.results.trackmatches.track
    ) {
      return data.results.trackmatches.track;
    }
    return [];
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
};

export const getTopTracks = async (): Promise<Track[]> => {
  const url = `http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${API_KEY}&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const tracks: Track[] = data.tracks.track.map((item: any) => ({
      name: item.name,
      artist: item.artist.name,
      url: item.url,
      listeners: item.listeners,
      image: item.image,
    }));

    return tracks;
  } catch (error) {
    console.error("Error fetching top tracks from Last.fm:", error);
    throw error;
  }
};

export const getTopArtists = async (): Promise<Artist[]> => {
  const url = `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const artists: Artist[] = data.artists.artist.map((item: any) => ({
      name: item.name,
      mbid: item.mbid,
      url: item.url,
      image: item.image,
    }));

    return artists;
  } catch (error) {
    console.error("Error fetching top artists from Last.fm:", error);
    throw error;
  }
};