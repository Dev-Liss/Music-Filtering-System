import React, { useState } from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import TrackCard from "./TrackCard";
import SongDetailsModal from "./SongDetailsModal";
import { Heart, Search, LayoutGrid, List } from "lucide-react";

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedTrack, setSelectedTrack] = useState(null);

  const filteredTracks = favorites.filter((track) =>
    track.file_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8 flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ef4444] to-[#ef4444]/60 flex items-center justify-center shadow-lg shadow-[#ef4444]/20 text-white">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Favorites</h1>
              <p className="text-sm text-muted-foreground">Your liked tracks</p>
            </div>
          </div>
          <div className="flex items-center flex-1 min-w-[300px] justify-end">
            <div className="relative max-w-sm w-full group">
              <div className="relative flex items-center bg-white/10 border border-white/10 rounded-full px-4 py-2 transition-all focus-within:bg-white/15 focus-within:border-primary/50">
                <Search className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search favorites..."
                  className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/70 text-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              {filteredTracks.length} track(s)
            </p>
            
            <button
              onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
              className="relative flex items-center justify-center bg-[#292A3A] border border-white/5 overflow-hidden rounded-xl h-[42px] px-4 text-[#B5B8DB] hover:text-[#E2E4F6] hover:bg-[#34354A] transition-all duration-300 active:scale-95 shadow-sm"
              aria-label="Toggle view"
            >
              <div className="flex items-center gap-2.5 relative z-10 w-[72px] justify-center">
                <div className="relative w-[18px] h-[18px] flex-shrink-0">
                   <LayoutGrid strokeWidth={2.5} className={`absolute inset-0 w-[18px] h-[18px] transition-all duration-500 origin-center ${viewMode === 'grid' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
                   <List strokeWidth={2.5} className={`absolute inset-0 w-[18px] h-[18px] transition-all duration-500 origin-center ${viewMode === 'list' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`} />
                </div>
                <div className="relative w-8 h-[20px] overflow-hidden flex-shrink-0">
                   <span className={`absolute left-0 top-0 w-full transition-all duration-500 font-semibold text-sm text-left tracking-wide ${viewMode === 'grid' ? 'translate-y-0 opacity-100' : 'translate-y-[150%] opacity-0'}`}>Grid</span>
                   <span className={`absolute left-0 top-0 w-full transition-all duration-500 font-semibold text-sm text-left tracking-wide ${viewMode === 'list' ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0'}`}>List</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className={`grid gap-6 transition-all duration-500 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredTracks.map((track) => (
            <TrackCard key={track.id} track={track} viewMode={viewMode} currentPlaylist={filteredTracks} onClick={setSelectedTrack} />
          ))}
          {favorites.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-muted-foreground border border-dashed rounded-xl border-border/50">
              <Heart className="w-12 h-12 mb-4 opacity-20" />
              <p>You haven't added any favorite tracks yet.</p>
            </div>
          ) : filteredTracks.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-muted-foreground border border-dashed rounded-xl border-border/50">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p>No favorites match your search.</p>
            </div>
          ) : null}
        </div>
      </div>
      
      {selectedTrack && (
        <SongDetailsModal 
          track={selectedTrack} 
          onClose={() => setSelectedTrack(null)} 
          onDelete={(id) => {
            removeFavorite(id);
            setSelectedTrack(null);
          }}
        />
      )}
    </div>
  );
}
