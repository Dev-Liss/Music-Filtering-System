import React, { useState, useEffect, useMemo } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize2,
  Heart,
  Music,
  Volume2,
  VolumeX,
  Volume1,
} from "lucide-react";
import { usePlayer } from "../contexts/PlayerContext";
import { useFavorites } from "../contexts/FavoritesContext";

const MusicPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    currentTime,
    duration,
    seek,
    waveform,
    volume,
    setVolume,
    isMuted,
    toggleMute,
  } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [cover, setCover] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (currentTrack?.file_path && window.api?.getTrackCover) {
      window.api.getTrackCover(currentTrack.file_path).then((data) => {
        if (isMounted) setCover(data);
      });
    } else {
      setCover(null);
    }
    return () => {
      isMounted = false;
    };
  }, [currentTrack]);

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const m = Math.floor(timeInSeconds / 60);
    const s = Math.floor(timeInSeconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    seek(percentage * duration);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-28 pb-4 bg-[#0a0c10]/95 border-t border-white/5 flex items-center justify-between px-6 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl">
      {/* Left: Track Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[240px]">
        <div className="w-14 h-14 rounded-xl bg-primary/10 overflow-hidden shadow-lg shadow-black/40 flex-shrink-0 relative group cursor-pointer flex items-center justify-center text-primary">
          {cover ? (
            <img
              src={cover}
              alt="Track cover"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <Music className="w-6 h-6" />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-white font-bold text-sm truncate cursor-pointer hover:text-primary transition-colors">
            {currentTrack ? currentTrack.file_name : "No track selected"}
          </h4>
          <p className="text-muted-foreground text-xs truncate mt-0.5">
            {currentTrack ? "Local File" : ""}
          </p>
        </div>
        <button
          onClick={() => currentTrack && toggleFavorite(currentTrack)}
          className={`transition-colors ml-2 ${currentTrack && isFavorite(currentTrack.id) ? "text-red-400" : "text-muted-foreground hover:text-red-400"}`}
        >
          <Heart
            className={`w-4 h-4 ${currentTrack && isFavorite(currentTrack.id) ? "fill-current" : ""}`}
          />
        </button>
      </div>

      {/* Middle: Controls & Progress */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-2xl px-4 gap-2.5">
        {/* Progress Bar Waveform Mockup */}
        <div className="flex items-center w-full gap-3">
          <span className="text-[10px] text-muted-foreground font-medium w-8 text-right font-mono tracking-wider">
            {formatTime(currentTime)}
          </span>

          <div
            className="flex-1 relative h-6 flex items-center group cursor-pointer"
            onClick={handleSeek}
          >
            {/* Waveform */}
            <div className="absolute inset-0 flex items-center justify-between gap-[2px]">
              {waveform.map((height, i) => {
                const isActive = i < (progressPercent / 100) * 80;
                return (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-colors duration-300 pointer-events-none ${isActive ? "bg-primary" : "bg-white/10 group-hover:bg-white/20"}`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
            {/* Playhead */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10 transition-transform hover:scale-125 pointer-events-none"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <span className="text-[10px] text-muted-foreground font-medium w-8 font-mono tracking-wider">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={playPrevious}
            disabled={!currentTrack}
            className="text-white hover:text-primary transition-colors disabled:opacity-50 disabled:hover:text-white"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={togglePlay}
            disabled={!currentTrack}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-all shadow-lg shadow-white/20 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-[2px]" />
            )}
          </button>
          <button
            onClick={playNext}
            disabled={!currentTrack}
            className="text-white hover:text-primary transition-colors disabled:opacity-50 disabled:hover:text-white"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>

      {/* Right: Volume Controls */}
      <div className="flex items-center justify-end gap-4 w-1/4 min-w-[200px]">
        <div className="flex items-center gap-2 w-32 group">
          <button
            onClick={toggleMute}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <div
            className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer relative overflow-hidden"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              setVolume(Math.max(0, Math.min(1, x / rect.width)));
            }}
          >
            <div
              className="absolute top-0 left-0 h-full bg-white group-hover:bg-primary transition-colors"
              style={{ width: `${isMuted ? 0 : volume * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
