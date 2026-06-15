import chokidar from 'chokidar';
import path from 'path';
import { getSetting, setSetting, addTrackIfNew } from './database.js';

let watcher = null;

export function getWatcherConfig() {
  const storedPath = getSetting('nas_path');
  return storedPath || 'D:\\TestLocation';
}

export function updateWatcherConfig(newPath) {
  setSetting('nas_path', newPath);
}

export function startWatcher() {
  if (watcher) {
    watcher.close();
  }

  const nasPath = getWatcherConfig();
  if (!nasPath) return;

  watcher = chokidar.watch(nasPath, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    depth: 5 // Optional: limit depth if NAS is huge
  });

  watcher.on('add', (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.mp3' || ext === '.wav') {
      const fileName = path.basename(filePath);
      addTrackIfNew(fileName, filePath);
    }
  });

  watcher.on('error', error => console.log(`Watcher error: ${error}`));
}
