import React, { useState, useMemo } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Maximize2, Heart } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Generate a static waveform array so it doesn't change on re-renders
  const waveformHeights = useMemo(() => {
    return Array.from({ length: 80 }).map(() => Math.floor(Math.random() * 80) + 20);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#0a0c10]/95 border-t border-white/5 flex items-center justify-between px-6 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl">
      {/* Left: Track Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[240px]">
        <div className="w-14 h-14 rounded-xl bg-primary/10 overflow-hidden shadow-lg shadow-black/40 flex-shrink-0 relative group cursor-pointer">
          <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=100&auto=format&fit=crop" alt="Track cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <Maximize2 className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-white font-bold text-sm truncate cursor-pointer hover:text-primary transition-colors">Summer Walk</h4>
          <p className="text-muted-foreground text-xs truncate mt-0.5">Olexy</p>
        </div>
        <button className="text-muted-foreground hover:text-red-400 transition-colors ml-2">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Middle: Controls & Progress */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-2xl px-4 gap-2.5">
        <div className="flex items-center gap-6">
          <button className="text-muted-foreground hover:text-white transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>
          <button className="text-white hover:text-primary transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-all shadow-lg shadow-white/20 active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-[2px]" />
            )}
          </button>
          <button className="text-white hover:text-primary transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button className="text-muted-foreground hover:text-white transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar Waveform Mockup */}
        <div className="flex items-center w-full gap-3">
          <span className="text-[10px] text-muted-foreground font-medium w-8 text-right font-mono tracking-wider">1:24</span>
          
          <div className="flex-1 relative h-6 flex items-center group cursor-pointer">
            {/* Waveform */}
            <div className="absolute inset-0 flex items-center justify-between gap-[2px]">
              {waveformHeights.map((height, i) => {
                const isActive = i < 26; // Approx 33%
                return (
                  <div 
                    key={i} 
                    className={`w-1 rounded-full transition-colors duration-300 ${isActive ? 'bg-primary' : 'bg-white/10 group-hover:bg-white/20'}`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
            {/* Playhead */}
            <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10 transition-transform hover:scale-125" style={{ left: '33%' }} />
          </div>

          <span className="text-[10px] text-muted-foreground font-medium w-8 font-mono tracking-wider">3:42</span>
        </div>
      </div>

      {/* Right: Volume & Extras */}
      <div className="flex items-center justify-end gap-4 w-1/4 min-w-[200px]">
        <button className="text-muted-foreground hover:text-white transition-colors">
          <Volume2 className="w-4 h-4" />
        </button>
        <div className="w-24 h-1.5 bg-white/10 rounded-full cursor-pointer group flex items-center relative">
          <div className="absolute left-0 h-full bg-white rounded-full w-2/3 group-hover:bg-primary transition-colors"></div>
          <div className="absolute w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow transition-opacity" style={{ left: 'calc(66% - 6px)' }}></div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
