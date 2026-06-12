import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';

let db;

export function initDB() {
  const dbPath = path.join(app.getPath('userData'), 'music-filtering-system.db');
  db = new Database(dbPath, { verbose: console.log });

  // Initialize Schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS tracks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_name TEXT UNIQUE NOT NULL,
      file_path TEXT NOT NULL,
      genres TEXT DEFAULT '[]',
      moods TEXT DEFAULT '[]',
      video_themes TEXT DEFAULT '[]',
      instruments TEXT DEFAULT '[]',
      has_stems INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending',
      date_added DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
}

export function getPendingTracks() {
  const stmt = db.prepare("SELECT * FROM tracks WHERE status = 'pending'");
  return stmt.all();
}

export function getTaggedTracks(filters) {
  let query = "SELECT * FROM tracks WHERE status = 'tagged'";
  const params = {};

  // Filters logic: Since arrays are JSON strings, we can use LIKE or json functions
  // For simplicity and better-sqlite3 without json1 extension guaranteed, we will use LIKE '%"tag"%'
  if (filters) {
    if (filters.genres && filters.genres.length > 0) {
      filters.genres.forEach((genre, index) => {
        query += ` AND genres LIKE @genre${index}`;
        params[`genre${index}`] = `%"${genre}"%`;
      });
    }
    if (filters.moods && filters.moods.length > 0) {
      filters.moods.forEach((mood, index) => {
        query += ` AND moods LIKE @mood${index}`;
        params[`mood${index}`] = `%"${mood}"%`;
      });
    }
    if (filters.video_themes && filters.video_themes.length > 0) {
      filters.video_themes.forEach((theme, index) => {
        query += ` AND video_themes LIKE @theme${index}`;
        params[`theme${index}`] = `%"${theme}"%`;
      });
    }
    if (filters.instruments && filters.instruments.length > 0) {
      filters.instruments.forEach((instrument, index) => {
        query += ` AND instruments LIKE @instrument${index}`;
        params[`instrument${index}`] = `%"${instrument}"%`;
      });
    }
  }

  const stmt = db.prepare(query);
  return stmt.all(params).map(track => ({
    ...track,
    genres: JSON.parse(track.genres),
    moods: JSON.parse(track.moods),
    video_themes: JSON.parse(track.video_themes),
    instruments: JSON.parse(track.instruments),
    has_stems: track.has_stems === 1
  }));
}

export function updateTrackMetadata(payload) {
  const { id, genres, moods, video_themes, instruments, has_stems } = payload;
  const stmt = db.prepare(`
    UPDATE tracks 
    SET 
      genres = @genres,
      moods = @moods,
      video_themes = @video_themes,
      instruments = @instruments,
      has_stems = @has_stems,
      status = 'tagged'
    WHERE id = @id
  `);

  stmt.run({
    id,
    genres: JSON.stringify(genres),
    moods: JSON.stringify(moods),
    video_themes: JSON.stringify(video_themes),
    instruments: JSON.stringify(instruments),
    has_stems: has_stems ? 1 : 0
  });
}

export function getSetting(key) {
  const stmt = db.prepare('SELECT value FROM settings WHERE key = ?');
  const row = stmt.get(key);
  return row ? row.value : null;
}

export function setSetting(key, value) {
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  stmt.run(key, value);
}

export function addTrackIfNew(fileName, filePath) {
  const checkStmt = db.prepare('SELECT id FROM tracks WHERE file_name = ?');
  const existing = checkStmt.get(fileName);
  
  if (!existing) {
    const insertStmt = db.prepare('INSERT INTO tracks (file_name, file_path) VALUES (?, ?)');
    insertStmt.run(fileName, filePath);
    // You could optionally send an event to the frontend here using webContents.send
  }
}
