import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import MultiSelect from "./ui/MultiSelect";
import { Music } from "lucide-react";

export const TAXONOMY = {
  genres: [
    "Acoustic",
    "Ambient",
    "Blues",
    "Children",
    "Cinematic",
    "Classical",
    "Corporate",
    "Country",
    "Electronic",
    "Fantasy",
    "Folk",
    "Funk",
    "Hip Hop",
    "Holiday",
    "Indie",
    "Jazz",
    "Latin",
    "Lofi & Chill Beats",
    "Lounge",
    "Pop",
    "Reggae",
    "Retro",
    "Rock",
    "Singer-Songwriter",
    "Soul & RnB",
    "World",
    "Worship",
  ],
  moods: [
    "Uplifting",
    "Epic",
    "Powerful",
    "Exciting",
    "Happy",
    "Funny",
    "Carefree",
    "Hopeful",
    "Love",
    "Playful",
    "Groovy",
    "Sexy",
    "Peaceful",
    "Mysterious",
    "Serious",
    "Dramatic",
    "Angry",
    "Tense",
    "Sad",
    "Scary",
    "Dark",
  ],
  video_themes: [
    "Business",
    "Commercial",
    "Documentary",
    "Drone Shots",
    "Education",
    "Fashion",
    "Food",
    "Gaming",
    "Industry",
    "Intros & Logos",
    "Landscape",
    "Lifestyle",
    "Medical",
    "Nature",
    "Party",
    "Road Trip",
    "Science",
    "Slow Motion",
    "Sport & Fitness",
    "Technology",
    "Time-Lapse",
    "Trailer",
    "Travel",
    "Urban",
    "Vlog",
    "Weddings",
    "Shorts",
  ],
  instruments: [
    "Acoustic Drums",
    "Acoustic Guitar",
    "Backing Vocals",
    "Bass",
    "Bells",
    "Brass",
    "Claps & Snaps",
    "Electric Guitar",
    "Electronic Drums",
    "Ethnic",
    "Keys",
    "Mandolin & Ukulele",
    "Orchestra",
    "Pads",
    "Percussion",
    "Piano",
    "Special Wind Instruments",
    "Strings",
    "Synth",
    "Vocal",
    "Whistle",
    "Woodwinds",
  ],
};

export default function TagForm({ track, onSave, onIgnore }) {
  const [selections, setSelections] = useState({
    genres: [],
    moods: [],
    video_themes: [],
    instruments: [],
  });
  const [hasStems, setHasStems] = useState(false);
  const [stemFiles, setStemFiles] = useState([]);
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
      stems_paths: stemFiles,
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
        <div className="flex items-center space-x-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              if (window.api && window.api.selectStems) {
                const files = await window.api.selectStems();
                if (files && files.length > 0) {
                  setHasStems(true);
                  setStemFiles(files);
                } else {
                  setHasStems(false);
                  setStemFiles([]);
                }
              } else {
                setHasStems(!hasStems);
              }
            }}
            className={`rounded-full transition-colors ${hasStems ? 'border-[#00f59b]/50 bg-[#00f59b]/15 text-[#00f59b] hover:bg-[#00f59b]/25 hover:text-[#00f59b]' : ''}`}
          >
            {hasStems ? "Stems Selected" : "Stems Available"}
          </Button>
        </div>
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

      <div className="pt-4 border-t border-border flex space-x-4">
        {onIgnore && (
          <Button variant="outline" onClick={() => onIgnore(track.id)} className="w-1/3 border-[#ef4444]/50 text-[#ef4444] hover:bg-[#ef4444]/15 hover:text-[#ef4444]">
            Ignore
          </Button>
        )}
        <Button onClick={handleSave} className={onIgnore ? "w-2/3" : "w-full"}>
          Save Metadata
        </Button>
      </div>
    </div>
  );
}
