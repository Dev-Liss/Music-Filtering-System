import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Music, AudioLines, Play, Pause, Heart, Plus, X } from "lucide-react";
import { usePlayer } from "../contexts/PlayerContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { usePlaylists } from "../contexts/PlaylistContext";

const TrackCard = ({ track, viewMode, currentPlaylist, onClick }) => {
  const [cover, setCover] = useState(null);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { playlists, addTrackToPlaylist } = usePlaylists();
  
  const isCurrentTrack = currentTrack?.id === track.id;
  const isLiked = isFavorite(track.id);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack(track, currentPlaylist);
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    toggleFavorite(track);
  };

  const handlePlusClick = (e) => {
    e.stopPropagation();
    setShowPlaylists(!showPlaylists);
  };

  const handleAddToPlaylist = (playlistId, e) => {
    e.stopPropagation();
    addTrackToPlaylist(playlistId, track);
    setShowPlaylists(false);
  };

  const PlayIcon = isCurrentTrack && isPlaying ? Pause : Play;

  useEffect(() => {
    let isMounted = true;
    const fetchCover = async () => {
      if (window.api && window.api.getTrackCover) {
        const coverData = await window.api.getTrackCover(track.file_path);
        if (isMounted && coverData) {
          setCover(coverData);
        }
      }
    };
    fetchCover();
    return () => {
      isMounted = false;
    };
  }, [track.file_path]);

  // Click outside listener to close dropdown
  useEffect(() => {
    if (!showPlaylists) return;
    const handleClickOutside = () => setShowPlaylists(false);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showPlaylists]);

  if (viewMode === "list") {
    return (
      <Card onClick={() => onClick && onClick(track)} className="border border-white/10 hover:border-primary/50 transition-all duration-300 group cursor-pointer bg-card/50 hover:bg-card/80 relative overflow-visible">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0 w-full">
            <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-lg text-primary overflow-hidden flex items-center justify-center shadow-inner relative">
              {cover ? (
                <img src={cover} alt="Cover" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
              ) : (
                <Music className="w-6 h-6" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center sm:hidden">
                <PlayIcon className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold truncate text-base text-foreground group-hover:text-primary transition-colors" title={track.file_name}>
                  {track.file_name}
                </h3>
                {track.has_stems && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px] uppercase font-bold tracking-wider border-primary/20 bg-primary/5 text-primary flex-shrink-0">
                    <AudioLines className="w-3 h-3 mr-1" /> STEMS
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground truncate mt-1" title={track.file_path}>
                {track.file_path.split("\\").pop()?.split("/").pop()}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0 w-full sm:w-auto justify-start sm:mr-4">
            {["genres", "moods"].map((cat) => 
              track[cat].length > 0 && track[cat].slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs text-muted-foreground border-border/50 bg-background/50 backdrop-blur-sm whitespace-nowrap">
                  {tag}
                </Badge>
              ))
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 flex-shrink-0 relative">
            <button
              onClick={handlePlusClick}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-all flex-shrink-0 shadow-sm border bg-primary/5 text-muted-foreground hover:bg-primary/10 border-transparent hover:border-primary/20 hover:text-foreground"
              title="Add to Playlist"
            >
              <Plus className="w-4 h-4" />
            </button>
            
            {showPlaylists && (
              <div 
                className="absolute right-[88px] top-full mt-2 w-48 bg-card/95 backdrop-blur-md text-card-foreground rounded-lg shadow-xl border border-border z-50 py-1 overflow-hidden" 
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 border-b border-border/50 mb-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Add to Playlist</span>
                </div>
                <div className="max-h-48 overflow-y-auto custom-scrollbar">
                  {playlists.length === 0 ? (
                    <div className="px-3 py-3 text-xs text-muted-foreground text-center">No playlists found.</div>
                  ) : (
                    playlists.map(p => {
                      const isAdded = p.tracks.some(t => t.id === track.id);
                      return (
                        <button 
                          key={p.id}
                          onClick={(e) => handleAddToPlaylist(p.id, e)}
                          className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors ${
                            isAdded ? 'opacity-50 cursor-default' : 'hover:bg-primary/20 hover:text-primary'
                          }`}
                          disabled={isAdded}
                        >
                          <span className="truncate">{p.name}</span>
                          {isAdded && <span className="text-[10px] uppercase bg-primary/20 text-primary px-1.5 py-0.5 rounded ml-2">Added</span>}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleLikeClick}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all flex-shrink-0 shadow-sm border ${
                isLiked 
                  ? "bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/50 hover:bg-[#ef4444]/25" 
                  : "bg-primary/5 text-muted-foreground hover:bg-primary/10 border-transparent hover:border-primary/20 hover:text-foreground"
              }`}
              title="Favorite"
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
            <button 
              onClick={handlePlayClick}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-foreground hover:bg-primary hover:text-primary-foreground transition-all flex-shrink-0 group-hover:scale-110 shadow-sm border border-primary/20"
            >
              <PlayIcon className="w-4 h-4 fill-current translate-x-[1px]" />
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card onClick={() => onClick && onClick(track)} className="border border-white/10 hover:border-primary/50 transition-colors group cursor-pointer bg-card/50 relative overflow-visible">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 flex-shrink-0 bg-primary/10 rounded-lg text-primary overflow-hidden flex items-center justify-center relative">
              {cover ? (
                <img
                  src={cover}
                  alt="Cover"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                />
              ) : (
                <Music className="w-5 h-5" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center lg:hidden">
                <PlayIcon className="w-4 h-4 text-white fill-white" />
              </div>
            </div>
            <h3
              className="font-semibold truncate flex-1 group-hover:text-primary transition-colors"
              title={track.file_name}
            >
              {track.file_name}
            </h3>
          </div>
          {track.has_stems && (
            <Badge
              variant="secondary"
              className="flex items-center space-x-1 border-primary/20 bg-primary/5 text-primary shrink-0 ml-2"
            >
              <AudioLines className="w-3 h-3" />
              <span className="text-[10px] uppercase font-bold tracking-wider">STEMS</span>
            </Badge>
          )}
        </div>

        <div className="space-y-3 flex-1">
          {["genres", "moods"].map(
            (cat) =>
              track[cat].length > 0 && (
                <div key={cat} className="flex flex-wrap gap-1">
                  {track[cat].map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[11px] text-muted-foreground border-border/50 bg-background/50 backdrop-blur-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              ),
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between relative">
          <span className="truncate text-xs text-muted-foreground max-w-[70%]" title={track.file_path}>
            {track.file_path.split("\\").pop()?.split("/").pop()}
          </span>
          
          <div className="absolute right-0 bottom-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
            <div className="relative">
              <button
                onClick={handlePlusClick}
                className="w-10 h-10 flex items-center justify-center rounded-full shadow-md transition-colors bg-background/80 text-foreground hover:bg-background border border-border"
                title="Add to Playlist"
              >
                <Plus className="w-4 h-4" />
              </button>
              
              {showPlaylists && (
                <div 
                  className="absolute bottom-full right-0 mb-2 w-48 bg-card/95 backdrop-blur-md text-card-foreground rounded-lg shadow-xl border border-border z-50 py-1 overflow-hidden" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-2 border-b border-border/50 mb-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Add to Playlist</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto custom-scrollbar">
                    {playlists.length === 0 ? (
                      <div className="px-3 py-3 text-xs text-muted-foreground text-center">No playlists found.</div>
                    ) : (
                      playlists.map(p => {
                        const isAdded = p.tracks.some(t => t.id === track.id);
                        return (
                          <button 
                            key={p.id}
                            onClick={(e) => handleAddToPlaylist(p.id, e)}
                            className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors ${
                              isAdded ? 'opacity-50 cursor-default' : 'hover:bg-primary/20 hover:text-primary'
                            }`}
                            disabled={isAdded}
                          >
                            <span className="truncate">{p.name}</span>
                            {isAdded && <span className="text-[10px] uppercase bg-primary/20 text-primary px-1.5 py-0.5 rounded ml-2">Added</span>}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleLikeClick}
              className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md transition-colors ${
                isLiked 
                  ? "bg-[#ef4444] text-white hover:bg-[#ef4444]/90" 
                  : "bg-background/80 text-foreground hover:bg-background border border-border"
              }`}
              title="Favorite"
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
            <button 
              onClick={handlePlayClick}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex-shrink-0 shadow-md"
            >
               <PlayIcon className="w-4 h-4 fill-current translate-x-[1px]" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackCard;
