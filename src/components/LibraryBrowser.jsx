import React, { useState, useEffect } from "react";
import { Filter, Search, LayoutGrid, List } from "lucide-react";
import { TAXONOMY } from "./TagForm";
import TrackCard from "./TrackCard";
import SongDetailsModal from "./SongDetailsModal";

export default function LibraryBrowser() {
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [filters, setFilters] = useState({
    genres: [],
    moods: [],
    video_themes: [],
    instruments: [],
  });

  const fetchTracks = async () => {
    if (window.api) {
      const data = await window.api.getTaggedTracks(filters);
      setTracks(data || []);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, [filters]);

  const clearAllFilters = () => {
    setFilters({
      genres: [],
      moods: [],
      video_themes: [],
      instruments: [],
    });
  };

  const clearFilterCategory = (category) => {
    setFilters((prev) => ({ ...prev, [category]: [] }));
  };

  const toggleFilter = (category, item) => {
    setFilters((prev) => {
      const isSelected = prev[category].includes(item);
      if (isSelected) {
        return {
          ...prev,
          [category]: prev[category].filter((i) => i !== item),
        };
      } else {
        return { ...prev, [category]: [...prev[category], item] };
      }
    });
  };

  const filteredTracks = tracks.filter((track) =>
    track.file_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-full">
      {/* Sidebar Filters */}
      <div className="w-64 border-r border-border bg-card/30 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6 text-foreground">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <h2 className="font-semibold text-lg">Filters</h2>
          </div>
          {Object.values(filters).some((arr) => arr.length > 0) && (
            <button
              onClick={clearAllFilters}
              className="shrink-0 inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 select-none bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/50 hover:bg-[#ef4444]/25"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-8">
          {Object.entries(TAXONOMY).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {category.replace("_", " ")}
                </h3>
                {filters[category].length > 0 && (
                  <button
                    onClick={() => clearFilterCategory(category)}
                    className="shrink-0 inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 select-none bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/50 hover:bg-[#ef4444]/25"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {items.map((item) => {
                  const isSelected = filters[category].includes(item);
                  return (
                    <label
                      key={item}
                      className="flex items-center space-x-3 cursor-pointer group"
                      onClick={() => toggleFilter(category, item)}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? "bg-primary border-primary" : "border-input group-hover:border-primary/50"}`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-primary-foreground rounded-sm" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${isSelected ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"}`}
                      >
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 p-8 overflow-y-auto bg-background">
        <div className="mb-8 flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center flex-1 min-w-[300px]">
            <div className="relative max-w-sm w-full group">
              {/* Inner search input container */}
              <div className="relative flex items-center bg-white/10 border border-white/10 rounded-full px-4 py-2 transition-all focus-within:bg-white/15 focus-within:border-primary/50">
                <Search className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search tracks..."
                  className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/70 text-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              {filteredTracks.length} track(s) found.
            </p>
            
            {/* View Toggle Button */}
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
          {filteredTracks.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-muted-foreground border border-dashed rounded-xl border-border/50">
              <Filter className="w-12 h-12 mb-4 opacity-20" />
              <p>No tracks match the selected filters.</p>
            </div>
          )}
        </div>
      </div>
      
      {selectedTrack && (
        <SongDetailsModal 
          track={selectedTrack} 
          onClose={() => setSelectedTrack(null)} 
          onDelete={() => {
            setSelectedTrack(null);
            fetchTracks();
          }}
        />
      )}
    </div>
  );
}
