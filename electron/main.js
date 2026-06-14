import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB, getPendingTracks, getTaggedTracks, updateTrackMetadata } from './database.js';
import { startWatcher, getWatcherConfig, updateWatcherConfig } from './watcher.js';
import { parseFile } from 'music-metadata';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Check if we are running in dev or prod
  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, Vite builds to dist/
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  // Initialize Database
  initDB();

  // Setup IPC Handlers
  ipcMain.handle('get-pending-tracks', () => getPendingTracks());
  ipcMain.handle('get-tagged-tracks', (event, filters) => getTaggedTracks(filters));
  ipcMain.handle('update-track-metadata', (event, payload) => updateTrackMetadata(payload));
  ipcMain.handle('get-watcher-config', () => getWatcherConfig());
  ipcMain.handle('update-watcher-config', (event, newPath) => {
    updateWatcherConfig(newPath);
    startWatcher(); // Restart watcher with new path
    return true;
  });
  ipcMain.handle('get-track-cover', async (event, filePath) => {
    try {
      const metadata = await parseFile(filePath);
      if (metadata.common.picture && metadata.common.picture.length > 0) {
        const picture = metadata.common.picture[0];
        // Convert picture.data (Uint8Array) to Buffer before calling toString('base64')
        const base64Data = Buffer.from(picture.data).toString('base64');
        return `data:${picture.format};base64,${base64Data}`;
      }
      return null;
    } catch (error) {
      console.error('Error reading track cover:', error);
      return null;
    }
  });

  // Start watching the configured folder (if set)
  startWatcher();

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
