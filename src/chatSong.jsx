import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_API);

const NowPlayingCard = ({ song, roomID }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  
  
  
  useEffect(() => {
    if (roomID) {
      socket.emit('joinRoom', roomID);
    }
  }, [roomID]);
  useEffect(() => {
    const audio = audioRef.current;
  
    if (audio) {
      audio.pause();
      audio.currentTime = 0; 
    }
  
    setIsPlaying(false); 
    setCurrentTime(0);
    setDuration(0);
  }, [song]); 
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      socket.emit('pause', { bool: false, roomID });
      setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      const now = Date.now();
      if (!audio.lastEmit || now - audio.lastEmit > 1000) {
        audio.lastEmit = now;
        socket.emit('syncTime', {
          roomID,
          currentTime: audio.currentTime,
          timestamp: now,
        });
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [roomID]);

  useEffect(() => {
    const handlePlay = (playing) => {
      console.log("Received play event:", playing);
      setIsPlaying(playing);

      const audio = audioRef.current;
      if (audio) {
        if (playing) {
          audio.play().catch((err) => {
            console.error('Audio play error:', err);
          });
        } else {
          audio.pause();
        }
      }
    };

    socket.on('play', handlePlay);
    return () => {
      socket.off('play', handlePlay);
    };
  }, []);


  const togglePlay = () => {
    if (!roomID) return;

    socket.emit('pause', {
      bool: !isPlaying,
      roomID,
    });
  };



  if (!song) return null;

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div 
    onClick={togglePlay}
    className="flex flex-col bg-white bg-opacity-80 rounded-lg shadow p-3 mb-4">
      <div className="flex items-center">
        <div
          className={`h-12 w-12 rounded-md bg-gradient-to-br ${song.color} mr-3 flex-shrink-0 ${
            isPlaying ? 'animate-pulse' : ''
          }`}
        ></div>
        <div className="flex-grow"
        >
          <h3 className="text-sm font-semibold truncate text-ellipsis text-gray-800">{song.title.replace(/\[.*?\]\s*\d+\s*-\s*/, '')          }</h3>
          <p className="text-xs text-gray-600">{song.artist}</p>
          <p className="text-xs text-gray-400 italic">{song.album}</p>
        </div>
        <div className="ml-3">
          <button
            className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow hover:shadow-md"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <audio src={song.url} ref={audioRef} preload="auto" />
        </div>
      </div>

      <div className="w-full mt-2 h-2 bg-gray-200 rounded-full">
  <div
    className="h-2 bg-indigo-500 rounded-full"
    style={{ width: `${progressPercent}%` }}
  ></div>
</div>

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

const formatTime = (time) => {
  if (isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export default NowPlayingCard;
