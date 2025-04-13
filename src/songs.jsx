import React, { useEffect, useState } from 'react'
import { Clock, Heart, Play, Pause } from 'lucide-react';

export default function Songs({ song, setSong,roomId, setmodalopen ,current_song_id}) {
  const [hoveredSong, setHoveredSong] = useState(null);

  return (
    
        
          <div
            key={song.id}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onMouseEnter={() => setHoveredSong(song.id)}
            onMouseLeave={() => setHoveredSong(null)}
            tabIndex={0}
            onClick={() => {
              setSong(song);
              setmodalopen(true);
            }}
          >
            <div className="relative">
              <div className={`h-48 w-full bg-gradient-to-br ${song.color}`}></div>
              <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity duration-300 ${hoveredSong === song.id ? 'opacity-100' : 'opacity-0'}`}>
                <button className="h-12 w-12 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110">
                    {current_song_id&&current_song_id===song.id?<Pause  className="h-4 w-4 ml-0.5" fill="currentColor" />:<Play className="h-4 w-4 ml-0.5" fill="currentColor" />
                    }
                </button>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-bold truncate text-gray-800">{song.title}</h3>
              <p className="text-gray-600 text-sm truncate">{song.artist}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center text-gray-500 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {song.duration}
                </div>
                <button className="text-gray-400 hover:text-purple-500 transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        
    
  );
}
