const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getPendingTracks: () => ipcRenderer.invoke('get-pending-tracks'),
  getTaggedTracks: (filters) => ipcRenderer.invoke('get-tagged-tracks', filters),
  updateTrackMetadata: (payload) => ipcRenderer.invoke('update-track-metadata', payload),
  getWatcherConfig: () => ipcRenderer.invoke('get-watcher-config'),
  updateWatcherConfig: (newPath) => ipcRenderer.invoke('update-watcher-config', newPath),
  getTrackCover: (filePath) => ipcRenderer.invoke('get-track-cover', filePath),
});
