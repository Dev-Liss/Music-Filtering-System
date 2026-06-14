import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import MultiSelect from "./ui/MultiSelect";
import { Music } from "lucide-react";

export const TAXONOMY = {
  genres: [
    "Cinematic",
    "Electronic",
    "Hip Hop",
    "Pop",
    "Rock",
    "Indie",
    "Acoustic",
    "Ambient",
    "Corporate",
  ],
  moods: [
    "Uplifting",
    "Powerful",
    "Melancholy",
    "Suspenseful",
    "Energetic",
    "Relaxed",
    "Dark",
    "Playful",
    "Inspiring",
  ],
  video_themes: [
    "Travel/Vlog",
    "Commercial/Ad",
    "Cinematic Film",
    "Tech/Gaming",
    "Documentary",
    "Fashion",
    "Sports/Fitness",
    "Wedding",
  ],
  instruments: [
    "Strings",
    "Synth",
    "Drums/Percussion",
    "Electric Guitar",
    "Acoustic Guitar",
    "Piano",
    "Brass",
    "Bass",
  ],
};

export default function TagForm({ track, onSave }) {
  const [selections, setSelections] = useState({
    genres: [],
    moods: [],
    video_themes: [],
    instruments: [],
  });
  const [hasStems, setHasStems] = useState(false);
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

  const toggleSelection = (category, item) => {
    setSelections((prev) => {
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

  const handleSave = () => {
    onSave({
      id: track.id,
      ...selections,
      has_stems: hasStems,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center space-x-4 max-w-[75%]">
          <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-lg text-primary overflow-hidden flex items-center justify-center">
            {cover ? (
              <img
                src={cover}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <Music className="w-6 h-6" />
            )}
          </div>
          <h3
            className="text-lg font-semibold truncate pr-4"
            title={track.file_name}
          >
            {track.file_name}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setHasStems(!hasStems)}
          className={`shrink-0 inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 select-none ${
            hasStems
              ? "bg-[#00f59b]/15 text-[#00f59b] border-[#00f59b]/50"
              : "bg-secondary/50 text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
          }`}
        >
          STEMs Available
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {Object.entries(TAXONOMY).map(([category, items]) => (
          <MultiSelect
            key={category}
            label={category.replace("_", " ")}
            options={items}
            selected={selections[category]}
            onChange={(item) => toggleSelection(category, item)}
            placeholder={`Select ${category.replace("_", " ")}...`}
          />
        ))}
      </div>

      <div className="pt-4 border-t border-border">
        <Button onClick={handleSave} className="w-full">
          Save Metadata
        </Button>
      </div>
    </div>
  );
}
