import React from 'react';
import { Track } from '../types/Track';

interface TrackListProps {
  tracks: Track[];
}

const TrackList: React.FC<TrackListProps> = ({ tracks }) => {
  return (
    <div className="track-list">
      {tracks.map(track => (
        <div className="track-item" key={track.mbid || track.name}>
          <img src={track.image[2]?.['#text'] || track.image[1]?.['#text'] || track.image[0]?.['#text'] || 'f.jpg'}/>
          <div className="track-info">
            <h4>{track.name}</h4>
            <p>{track.artist}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackList;