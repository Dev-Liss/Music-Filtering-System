import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(new Audio());
  
  const currentTrack = currentIndex >= 0 && currentIndex < playlist.length ? playlist[currentIndex] : null;

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => playNext();
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, playlist]);

  useEffect(() => {
    if (currentTrack) {
      // Create a valid file URL
      const fileUrl = `file:///${currentTrack.file_path.replace(/\\/g, '/')}`;
      audioRef.current.src = fileUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      }
    } else {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  }, [currentTrack]);

  useEffect(() => {
    if (isPlaying && currentTrack) {
      audioRef.current.play().catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const playTrack = (track, newPlaylist = null) => {
    const listToUse = newPlaylist || playlist;
    // Sort the list by id
    const sortedList = [...listToUse].sort((a, b) => a.id - b.id);
    setPlaylist(sortedList);
    
    const index = sortedList.findIndex(t => t.id === track.id);
    if (index !== -1) {
      setCurrentIndex(index);
    } else {
      // If track is not in playlist, add it at the beginning
      setPlaylist([track, ...sortedList]);
      setCurrentIndex(0);
    }
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    if (playlist.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (playlist.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      playlist,
      isPlaying,
      currentTime,
      duration,
      playTrack,
      togglePlay,
      playNext,
      playPrevious,
      seek
    }}>
      {children}
    </PlayerContext.Provider>
  );
};
