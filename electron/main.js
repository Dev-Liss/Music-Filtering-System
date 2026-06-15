import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB, getPendingTracks, getTaggedTracks, updateTrackMetadata, ignoreTrack, deleteTrack } from './database.js';
import { startWatcher, getWatcherConfig, updateWatcherConfig } from './watcher.js';
import { parseFile } from 'music-metadata';
import fs from 'fs';

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
      webSecurity: false,
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
  ipcMain.handle('ignore-track', (event, id) => ignoreTrack(id));
  ipcMain.handle('delete-track', (event, id) => deleteTrack(id));
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

  ipcMain.handle('get-audio-buffer', async (event, filePath) => {
    try {
      const data = await fs.promises.readFile(filePath);
      return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength); // ensures clean ArrayBuffer
    } catch (error) {
      console.error('Error reading audio buffer:', error);
      return null;
    }
  });

  ipcMain.handle('get-track-stems', async (event, trackPath) => {
    try {
      // Assuming stems are stored in a folder with the track name + " Stems" or something similar
      // For now, look for a folder with the same name as the file (without extension)
      const parsedPath = path.parse(trackPath);
      const stemsFolder = path.join(parsedPath.dir, parsedPath.name + " Stems");
      
      if (fs.existsSync(stemsFolder)) {
        const files = await fs.promises.readdir(stemsFolder);
        return files.map(file => ({
          name: file,
          path: path.join(stemsFolder, file)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting stems:', error);
      return [];
    }
  });

  ipcMain.handle('save-to-downloads', async (event, filePath) => {
    try {
      const downloadsPath = app.getPath('downloads');
      const fileName = path.basename(filePath);
      const destPath = path.join(downloadsPath, fileName);
      
      await fs.promises.copyFile(filePath, destPath);
      return { success: true, destPath };
    } catch (error) {
      console.error('Error saving to downloads:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('select-stems', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Select Stem Files',
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Audio Files', extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    return result.filePaths;
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
