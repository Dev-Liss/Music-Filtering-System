import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { TAXONOMY } from './TagForm';
import { Filter, Music, AudioLines } from 'lucide-react';

export default function LibraryBrowser() {
  const [tracks, setTracks] = useState([]);
  const [filters, setFilters] = useState({
    genres: [],
    moods: [],
    video_themes: [],
    instruments: []
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

  const toggleFilter = (category, item) => {
    setFilters(prev => {
      const isSelected = prev[category].includes(item);
      if (isSelected) {
        return { ...prev, [category]: prev[category].filter(i => i !== item) };
      } else {
        return { ...prev, [category]: [...prev[category], item] };
      }
    });
  };

  return (
    <div className="flex h-full">
      {/* Sidebar Filters */}
      <div className="w-64 border-r border-border bg-card/30 p-6 overflow-y-auto">
        <div className="flex items-center space-x-2 mb-6 text-foreground">
          <Filter className="w-5 h-5" />
          <h2 className="font-semibold text-lg">Filters</h2>
        </div>
        
        <div className="space-y-8">
          {Object.entries(TAXONOMY).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">
                {category.replace('_', ' ')}
              </h3>
              <div className="space-y-2">
                {items.map(item => {
                  const isSelected = filters[category].includes(item);
                  return (
                    <label key={item} className="flex items-center space-x-3 cursor-pointer group" onClick={() => toggleFilter(category, item)}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-input group-hover:border-primary/50'}`}>
                        {isSelected && <div className="w-2 h-2 bg-primary-foreground rounded-sm" />}
                      </div>
                      <span className={`text-sm ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Library Browser</h2>
          <p className="text-muted-foreground">{tracks.length} track(s) found.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map(track => (
            <Card key={track.id} className="hover:border-primary/50 transition-colors group cursor-pointer bg-card/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Music className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold truncate max-w-[150px]" title={track.file_name}>
                      {track.file_name}
                    </h3>
                  </div>
                  {track.has_stems && (
                    <Badge variant="secondary" className="flex items-center space-x-1 border-primary/20 bg-primary/5 text-primary">
                      <AudioLines className="w-3 h-3" />
                      <span>STEMS</span>
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-3">
                  {['genres', 'moods'].map(cat => (
                    track[cat].length > 0 && (
                      <div key={cat} className="flex flex-wrap gap-1">
                        {track[cat].map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs text-muted-foreground border-border/50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground flex justify-between">
                  <span className="truncate" title={track.file_path}>{track.file_path.split('\\').pop()?.split('/').pop()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {tracks.length === 0 && (
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
