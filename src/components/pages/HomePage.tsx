import React, { useState, useEffect } from 'react';
import { getTopArtists, getTopTracks } from '../../services/lastfm';
import { Artist } from '../../types/Artist';
import { Track } from '../../types/Track';
import ArtistCard from '../ArtistCard';
import TrackList from '../TrackList';

const HomePage: React.FC = () => {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [artists, tracks] = await Promise.all([
          getTopArtists(),
          getTopTracks()
        ]);
        setTopArtists(artists);
        setTopTracks(tracks);
      } catch (err) {
        setError('Failed to fetch top artists and tracks');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="home-page">
      <section className="popular-artists">
        <h2>Popular Artists</h2>
        <div className="artist-list">
        {topArtists.map((artist) => (
          <ArtistCard key={artist.mbid || artist.name} artist={artist} />
        ))}
      </div>
      </section>
      
      <section className="popular-tracks">
        <h2>Popular Tracks</h2>
        <TrackList tracks={topTracks} />
      </section>
    </div>
  );
};

export default HomePage; 