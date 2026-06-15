import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveform, setWaveform] = useState(Array.from({ length: 80 }).map(() => 20));
  
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
    let isMounted = true;
    if (currentTrack) {
      // Create a valid file URL
      const fileUrl = `file:///${currentTrack.file_path.replace(/\\/g, '/')}`;
      audioRef.current.src = fileUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      }

      // Extract waveform
      const extractWaveform = async () => {
        try {
          if (!window.api || !window.api.getAudioBuffer) return;
          const arrayBuffer = await window.api.getAudioBuffer(currentTrack.file_path);
          if (!arrayBuffer) return;
          
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          const rawData = audioBuffer.getChannelData(0);
          const samples = 80;
          const blockSize = Math.floor(rawData.length / samples);
          const filteredData = [];
          for (let i = 0; i < samples; i++) {
            let blockStart = blockSize * i;
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
              sum = sum + Math.abs(rawData[blockStart + j]);
            }
            filteredData.push(sum / blockSize);
          }
          
          const maxVal = Math.max(...filteredData);
          const multiplier = maxVal ? Math.pow(maxVal, -1) : 1;
          const normalizedData = filteredData.map(n => Math.max(10, n * multiplier * 100));
          
          if (isMounted) {
            setWaveform(normalizedData);
          }
        } catch (err) {
          console.error("Waveform extraction failed", err);
          if (isMounted) {
            setWaveform(Array.from({ length: 80 }).map(() => 20));
          }
        }
      };
      
      extractWaveform();
    } else {
      audioRef.current.pause();
      audioRef.current.src = "";
      if (isMounted) {
        setWaveform(Array.from({ length: 80 }).map(() => 20));
      }
    }

    return () => { isMounted = false; };
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
      seek,
      waveform
    }}>
      {children}
    </PlayerContext.Provider>
  );
};
