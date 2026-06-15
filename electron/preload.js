const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getPendingTracks: () => ipcRenderer.invoke('get-pending-tracks'),
  getTaggedTracks: (filters) => ipcRenderer.invoke('get-tagged-tracks', filters),
  updateTrackMetadata: (payload) => ipcRenderer.invoke('update-track-metadata', payload),
  ignoreTrack: (id) => ipcRenderer.invoke('ignore-track', id),
  deleteTrack: (id) => ipcRenderer.invoke('delete-track', id),
  getWatcherConfig: () => ipcRenderer.invoke('get-watcher-config'),
  updateWatcherConfig: (newPath) => ipcRenderer.invoke('update-watcher-config', newPath),
  getTrackCover: (filePath) => ipcRenderer.invoke('get-track-cover', filePath),
  getAudioBuffer: (filePath) => ipcRenderer.invoke('get-audio-buffer', filePath),
  getTrackStems: (trackPath) => ipcRenderer.invoke('get-track-stems', trackPath),
  saveToDownloads: (filePath) => ipcRenderer.invoke('save-to-downloads', filePath),
  selectStems: () => ipcRenderer.invoke('select-stems'),
});
