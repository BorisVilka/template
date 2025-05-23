import React from 'react';
import { Artist } from '../types/Artist';

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const imageUrl = artist.image[2]?.['#text'] || 'f.jpg';

  return (
    <div className="artist-card">
      <img src={imageUrl} alt={`Фото ${artist.name}`} />
      <div className="artist-info">
        <h4>{artist.name}</h4>
        <p>{artist.listeners} listeners</p>
      </div>
    </div>
  );
};

export default ArtistCard;