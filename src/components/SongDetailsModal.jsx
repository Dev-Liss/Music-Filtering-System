import React, { useState, useEffect } from 'react';
import { X, Download, Music, AudioLines, Trash2 } from 'lucide-react';
import { Badge } from './ui/badge';

export default function SongDetailsModal({ track, onClose, onDelete }) {
  const [cover, setCover] = useState(null);
  const [stems, setStems] = useState([]);
  const [isSaving, setIsSaving] = useState(null);
  const [savedItems, setSavedItems] = useState({});
  
  const handleDelete = async () => {
    if (window.api && window.api.deleteTrack) {
      if (window.confirm('Are you sure you want to delete this track?')) {
        await window.api.deleteTrack(track.id);
        if (onDelete) onDelete(track.id);
      }
    }
  };
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchDetails = async () => {
      if (window.api) {
        if (window.api.getTrackCover) {
          const coverData = await window.api.getTrackCover(track.file_path);
          if (isMounted && coverData) setCover(coverData);
        }
        
        if (window.api.getTrackStems && track.has_stems) {
          const stemFiles = await window.api.getTrackStems(track.file_path);
          if (isMounted) setStems(stemFiles);
        }
      }
    };
    
    fetchDetails();
    
    return () => { isMounted = false; };
  }, [track]);

  const handleDownload = async (filePath, id) => {
    if (!window.api || !window.api.saveToDownloads) return;
    
    setIsSaving(id);
    try {
      const result = await window.api.saveToDownloads(filePath);
      if (result && result.success) {
        setSavedItems(prev => ({ ...prev, [id]: true }));
        // Could show a toast notification here
        console.log('Saved successfully to:', result.destPath);
      } else {
        console.error('Failed to save:', result.error);
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" />
      
      <div 
        className="relative bg-[#1A1A24] border border-white/10 shadow-2xl rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-all backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left column: Cover Art */}
        <div className="md:w-2/5 bg-black/20 relative flex items-center justify-center min-h-[250px] md:min-h-full p-8 overflow-hidden group">
          {cover ? (
            <>
               <div className="absolute inset-0 blur-3xl opacity-30 bg-cover bg-center scale-150" style={{ backgroundImage: `url(${cover})` }} />
               <img src={cover} alt="Cover" className="w-full aspect-square object-cover rounded-xl shadow-2xl relative z-10 border border-white/5" />
            </>
          ) : (
             <div className="w-full aspect-square flex items-center justify-center rounded-xl bg-white/5 border border-white/10 relative z-10">
               <Music className="w-24 h-24 text-white/10" />
             </div>
          )}
        </div>

        {/* Right column: Details and Actions */}
        <div className="md:w-3/5 p-8 flex flex-col h-full overflow-y-auto custom-scrollbar">
          <div className="mb-6 flex items-start justify-between gap-4 pr-10">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2 leading-tight">
                {track.file_name}
              </h2>
              <p className="text-sm text-muted-foreground break-all">
                {track.file_path}
              </p>
            </div>
            <button
              onClick={handleDelete}
              className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-[#ef4444] bg-[#ef4444]/10 hover:bg-[#ef4444]/20 hover:text-[#fca5a5] transition-colors border border-[#ef4444]/20"
              title="Delete track"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>

          <div className="space-y-6 flex-1">
            {/* Metadata Badges */}
            <div className="space-y-4">
              {['genres', 'moods', 'video_themes', 'instruments'].map(category => {
                if (!track[category] || track[category].length === 0) return null;
                
                return (
                  <div key={category}>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      {category.replace('_', ' ')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {track[category].map(item => (
                        <Badge key={item} variant="outline" className="bg-white/5 border-white/10 text-foreground">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save To Section */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Download className="w-4 h-4 text-primary" /> Save to Downloads
              </h3>
              
              <div className="space-y-3">
                {/* Main Track Download */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Music className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Main Track</p>
                      <p className="text-xs text-muted-foreground">Original File</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(track.file_path, 'main')}
                    disabled={isSaving === 'main'}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 ${
                      savedItems['main'] 
                        ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' 
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20'
                    }`}
                  >
                    {isSaving === 'main' ? 'Saving...' : savedItems['main'] ? 'Saved' : 'Save'}
                  </button>
                </div>

                {/* Stems */}
                {track.has_stems && stems.map((stem, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <AudioLines className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                         <p className="text-sm font-medium text-foreground truncate" title={stem.name}>
                           {stem.name}
                         </p>
                         <p className="text-xs text-muted-foreground">Stem</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(stem.path, `stem-${idx}`)}
                      disabled={isSaving === `stem-${idx}`}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                        savedItems[`stem-${idx}`]
                          ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                          : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                      }`}
                    >
                      {isSaving === `stem-${idx}` ? 'Saving...' : savedItems[`stem-${idx}`] ? 'Saved' : 'Save'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
