import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { TAXONOMY } from "./TagForm";
import { Filter, Music, AudioLines, Search, LayoutGrid, List } from "lucide-react";
const TrackCard = ({ track, viewMode }) => {
  const [cover, setCover] = useState(null);

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

  if (viewMode === "list") {
    return (
      <Card className="hover:border-primary/50 transition-all duration-300 group cursor-pointer bg-card/50 hover:bg-card/80">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0 w-full">
            <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-lg text-primary overflow-hidden flex items-center justify-center shadow-inner">
              {cover ? (
                <img src={cover} alt="Cover" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
              ) : (
                <Music className="w-6 h-6" />
              )}
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
          
          <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0 w-full sm:w-auto justify-end">
            {["genres", "moods"].map((cat) => 
              track[cat].length > 0 && track[cat].slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs text-muted-foreground border-border/50 bg-background/50 backdrop-blur-sm whitespace-nowrap">
                  {tag}
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:border-primary/50 transition-colors group cursor-pointer bg-card/50">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex-shrink-0 bg-primary/10 rounded-lg text-primary overflow-hidden flex items-center justify-center">
              {cover ? (
                <img
                  src={cover}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="w-5 h-5" />
              )}
            </div>
            <h3
              className="font-semibold truncate max-w-[150px]"
              title={track.file_name}
            >
              {track.file_name}
            </h3>
          </div>
          {track.has_stems && (
            <Badge
              variant="secondary"
              className="flex items-center space-x-1 border-primary/20 bg-primary/5 text-primary"
            >
              <AudioLines className="w-3 h-3" />
              <span>STEMS</span>
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          {["genres", "moods"].map(
            (cat) =>
              track[cat].length > 0 && (
                <div key={cat} className="flex flex-wrap gap-1">
                  {track[cat].map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs text-muted-foreground border-border/50"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              ),
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground flex justify-between">
          <span className="truncate" title={track.file_path}>
            {track.file_path.split("\\").pop()?.split("/").pop()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default function LibraryBrowser() {
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
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
            <TrackCard key={track.id} track={track} viewMode={viewMode} />
          ))}
          {filteredTracks.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-muted-foreground border border-dashed rounded-xl border-border/50">
              <Filter className="w-12 h-12 mb-4 opacity-20" />
              <p>No tracks match the selected filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
