import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PlayerProvider } from './contexts/PlayerContext.jsx'
import { FavoritesProvider } from './contexts/FavoritesContext.jsx'
import { PlaylistProvider } from './contexts/PlaylistContext.jsx'

if (!window.api) {
  console.log("Injecting mock window.api for browser environments");
  
  // Seed localStorage with mock tracks if not present
  if (!localStorage.getItem('mock_tracks')) {
    const defaultTracks = [
      {
        id: 1,
        file_name: "Work from Home (feat. Ty Dolla $ign) - Fifth Harmony_ Ty Dolla $ign.mp3",
        file_path: "D:\\TestLocation\\Work from Home (feat. Ty Dolla $ign) - Fifth Harmony_ Ty Dolla $ign.mp3",
        genres: [],
        moods: [],
        video_themes: [],
        instruments: [],
        has_stems: false,
        status: 'pending'
      },
      {
        id: 2,
        file_name: "Numba Gawin - Mahiru Senarathne_ Jayss.mp3",
        file_path: "D:\\TestLocation\\Numba Gawin - Mahiru Senarathne_ Jayss.mp3",
        genres: [],
        moods: [],
        video_themes: [],
        instruments: [],
        has_stems: false,
        status: 'pending'
      }
    ];
    localStorage.setItem('mock_tracks', JSON.stringify(defaultTracks));
  }
  
  if (!localStorage.getItem('mock_watcher_path')) {
    localStorage.setItem('mock_watcher_path', 'D:\\TestLocation');
  }

  window.api = {
    getPendingTracks: async () => {
      const tracks = JSON.parse(localStorage.getItem('mock_tracks') || '[]');
      return tracks.filter(t => t.status === 'pending');
    },
    getTaggedTracks: async (filters) => {
      const tracks = JSON.parse(localStorage.getItem('mock_tracks') || '[]');
      let filtered = tracks.filter(t => t.status === 'tagged');
      if (filters) {
        if (filters.genres && filters.genres.length > 0) {
          filtered = filtered.filter(t => filters.genres.every(g => t.genres.includes(g)));
        }
        if (filters.moods && filters.moods.length > 0) {
          filtered = filtered.filter(t => filters.moods.every(m => t.moods.includes(m)));
        }
        if (filters.video_themes && filters.video_themes.length > 0) {
          filtered = filtered.filter(t => filters.video_themes.every(v => t.video_themes.includes(v)));
        }
        if (filters.instruments && filters.instruments.length > 0) {
          filtered = filtered.filter(t => filters.instruments.every(i => t.instruments.includes(i)));
        }
      }
      return filtered;
    },
    updateTrackMetadata: async (payload) => {
      const tracks = JSON.parse(localStorage.getItem('mock_tracks') || '[]');
      const updated = tracks.map(t => {
        if (t.id === payload.id) {
          return {
            ...t,
            genres: payload.genres || [],
            moods: payload.moods || [],
            video_themes: payload.video_themes || [],
            instruments: payload.instruments || [],
            has_stems: payload.has_stems || false,
            status: 'tagged'
          };
        }
        return t;
      });
      localStorage.setItem('mock_tracks', JSON.stringify(updated));
      return true;
    },
    getWatcherConfig: async () => {
      return localStorage.getItem('mock_watcher_path') || 'D:\\TestLocation';
    },
    updateWatcherConfig: async (newPath) => {
      localStorage.setItem('mock_watcher_path', newPath);
      return true;
    },
    getAudioBuffer: async (filePath) => {
      return null;
    }
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PlaylistProvider>
      <FavoritesProvider>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </FavoritesProvider>
    </PlaylistProvider>
  </StrictMode>,
)
