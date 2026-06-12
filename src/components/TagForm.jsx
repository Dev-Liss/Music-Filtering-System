import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export const TAXONOMY = {
  genres: ["Cinematic", "Electronic", "Hip Hop", "Pop", "Rock", "Indie", "Acoustic", "Ambient", "Corporate"],
  moods: ["Uplifting", "Powerful", "Melancholy", "Suspenseful", "Energetic", "Relaxed", "Dark", "Playful", "Inspiring"],
  video_themes: ["Travel/Vlog", "Commercial/Ad", "Cinematic Film", "Tech/Gaming", "Documentary", "Fashion", "Sports/Fitness", "Wedding"],
  instruments: ["Strings", "Synth", "Drums/Percussion", "Electric Guitar", "Acoustic Guitar", "Piano", "Brass", "Bass"]
};

export default function TagForm({ track, onSave }) {
  const [selections, setSelections] = useState({
    genres: [],
    moods: [],
    video_themes: [],
    instruments: []
  });
  const [hasStems, setHasStems] = useState(false);

  const toggleSelection = (category, item) => {
    setSelections(prev => {
      const isSelected = prev[category].includes(item);
      if (isSelected) {
        return { ...prev, [category]: prev[category].filter(i => i !== item) };
      } else {
        return { ...prev, [category]: [...prev[category], item] };
      }
    });
  };

  const handleSave = () => {
    onSave({
      id: track.id,
      ...selections,
      has_stems: hasStems
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold truncate" title={track.file_name}>{track.file_name}</h3>
        <label className="flex items-center space-x-2 text-sm cursor-pointer">
          <input 
            type="checkbox" 
            checked={hasStems} 
            onChange={(e) => setHasStems(e.target.checked)}
            className="rounded border-input text-primary focus:ring-primary"
          />
          <span>STEMs Available</span>
        </label>
      </div>

      <div className="space-y-4">
        {Object.entries(TAXONOMY).map(([category, items]) => (
          <div key={category}>
            <h4 className="text-sm font-medium mb-2 capitalize">{category.replace('_', ' ')}</h4>
            <div className="flex flex-wrap gap-2">
              {items.map(item => {
                const isSelected = selections[category].includes(item);
                return (
                  <Badge 
                    key={item} 
                    variant={isSelected ? "default" : "secondary"}
                    className="cursor-pointer transition-colors"
                    onClick={() => toggleSelection(category, item)}
                  >
                    {item}
                  </Badge>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-border">
        <Button onClick={handleSave} className="w-full">Save Metadata & Mark Tagged</Button>
      </div>
    </div>
  );
}
