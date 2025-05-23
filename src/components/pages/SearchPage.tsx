import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { searchArtists, searchAlbums, searchTracks } from '../../services/lastfm';
import { Artist } from '../../types/Artist';
import { Album } from '../../types/Album';
import { Track } from '../../types/Track';
import SearchBar from '../SearchBar';
import ArtistCard from '../ArtistCard';
import AlbumList from '../AlbumList';
import TrackList from '../TrackList';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search).get('q') || '';

  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setArtists([]);
        setAlbums([]);
        setTracks([]);
        return;
      }

      try {
        setIsLoading(true);
        const [artistResults, albumResults, trackResults] = await Promise.all([
          searchArtists(query),
          searchAlbums(query),
          searchTracks(query)
        ]);

        setArtists(artistResults);
        setAlbums(albumResults);
        setTracks(trackResults);
      } catch (err) {
        setError('Failed to fetch search results');
        console.error('Error fetching search results:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleSearch = (searchTerm: string) => {
    history.push(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="search-page">
      <SearchBar onSearch={handleSearch} />
      
      {query && (
        <div className="search-results">
          <h2>Search Results for "{query}"</h2>
          
          <section className="artists-section">
            <h3>Artists</h3>
            <div className="artist-list">
                {artists.map((artist) => (
                    <ArtistCard key={artist.mbid || artist.name} artist={artist} />
                 ))}
            </div>

          </section>

          <section className="albums-section">
            <h3>Albums</h3>
            <AlbumList albums={albums} />
          </section>

          <section className="tracks-section">
            <h3>Tracks</h3>
            <TrackList tracks={tracks} />
          </section>
        </div>
      )}
    </div>
  );
};

export default SearchPage; 