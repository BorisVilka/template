import React from 'react';
import { Album } from '../types/Album';

interface AlbumListProps {
  albums: Album[];
}

const AlbumList: React.FC<AlbumListProps> = ({ albums }) => {
  return (
    <div className="album-list">
      {albums.map(album => (
        <div className="album-item" key={album.mbid || album.name}>
          <img src={album.image[2]?.['#text'] || 'f.jpg'} alt={`Обложка ${album.name}`} />
          <div className="album-info">
            <h4>{album.name}</h4>
            <p>{album.artist}</p>
            <p>{album.listeners} listeners</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlbumList;