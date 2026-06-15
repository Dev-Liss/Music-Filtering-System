import React, { useState } from "react";
import { usePlaylists } from "../contexts/PlaylistContext";
import TrackCard from "./TrackCard";
import { ListMusic, Plus, ArrowLeft, Trash2, LayoutGrid, List } from "lucide-react";

export default function Playlists() {
  const { playlists, addPlaylist, deletePlaylist, removeTrackFromPlaylist } = usePlaylists();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId);

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      addPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
    }
  };

  if (selectedPlaylist) {
    return (
      <div className="flex h-full flex-col bg-background">
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="mb-8 flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedPlaylistId(null)} 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#d946ef] flex items-center justify-center shadow-lg shadow-[#8b5cf6]/20 text-white">
                <ListMusic className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground truncate max-w-[200px] sm:max-w-[300px]">{selectedPlaylist.name}</h1>
                <p className="text-sm text-muted-foreground">{selectedPlaylist.tracks.length} track(s)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-5">
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
            {selectedPlaylist.tracks.map((track) => (
              <div key={track.id} className="relative group/track">
                 <TrackCard track={track} viewMode={viewMode} currentPlaylist={selectedPlaylist.tracks} />
                 <button 
                   onClick={(e) => { e.stopPropagation(); removeTrackFromPlaylist(selectedPlaylist.id, track.id); }} 
                   className="absolute z-50 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover/track:opacity-100 transition-all hover:bg-red-600 shadow-lg -top-2 -right-2"
                   title="Remove from playlist"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            ))}
            {selectedPlaylist.tracks.length === 0 && (
               <div className="col-span-full flex flex-col items-center justify-center p-12 text-muted-foreground border border-dashed rounded-xl border-border/50">
                 <ListMusic className="w-12 h-12 mb-4 opacity-20" />
                 <p>This playlist is empty.</p>
                 <p className="text-xs mt-2">Add tracks from the Library Browser.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8 flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#d946ef] flex items-center justify-center shadow-lg shadow-[#8b5cf6]/20 text-white">
              <ListMusic className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Playlists</h1>
              <p className="text-sm text-muted-foreground">Manage your collections</p>
            </div>
          </div>
          
          <form onSubmit={handleCreatePlaylist} className="flex items-center gap-3">
             <input 
               type="text" 
               placeholder="New playlist name..." 
               value={newPlaylistName} 
               onChange={e => setNewPlaylistName(e.target.value)} 
               className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 w-48 sm:w-64 transition-all" 
             />
             <button 
               type="submit" 
               disabled={!newPlaylistName.trim()} 
               className="h-[38px] px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 transition-colors shadow-sm"
             >
               <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Create</span>
             </button>
          </form>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:max-w-6xl">
          {playlists.map(p => (
            <div key={p.id} className="relative group cursor-pointer" onClick={() => setSelectedPlaylistId(p.id)}>
              <div className="bg-card/50 hover:bg-card border border-border/50 rounded-xl p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-md flex items-center justify-between">
                 <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform flex-shrink-0">
                      <ListMusic className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">{p.name}</h3>
                      <p className="text-sm text-muted-foreground">{p.tracks.length} track(s)</p>
                    </div>
                 </div>
                 <button 
                   onClick={(e) => { e.stopPropagation(); deletePlaylist(p.id); }} 
                   className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100" 
                   title="Delete Playlist"
                 >
                   <Trash2 className="w-5 h-5" />
                 </button>
              </div>
            </div>
          ))}
          
          {playlists.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-muted-foreground border border-dashed rounded-xl border-border/50 mt-4">
              <ListMusic className="w-12 h-12 mb-4 opacity-20" />
              <p>You haven't created any playlists yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
