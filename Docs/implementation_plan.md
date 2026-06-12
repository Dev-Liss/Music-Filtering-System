# Local Music Filtering System

This document outlines the architecture, technology stack, and implementation plan for the Local Music Filtering and Management System. The application will track audio files downloaded to a NAS and allow users to tag them with specific metadata categories locally using a dark-themed UI.

## Goal Description

To build a high-performance, locally run desktop application using Electron and React that monitors a network drive (NAS) for new audio files. It will prompt the user to manually tag these new files with specific creative metadata and provide a comprehensive library browser for filtering and searching.

## User Review Required

> [!WARNING]
> Please review the technology stack and architecture to ensure it aligns perfectly with your local system requirements.

* **Tech Stack**: Electron, React (via Vite), `chokidar` (file watcher), `better-sqlite3` (database), Vanilla CSS (for styling).
* **Database Location**: The SQLite database will be stored in the local user `AppData` folder to avoid NAS file locking issues, as specified.

## Open Questions

> [!IMPORTANT]
> 1. **NAS Path Configuration**: Should the NAS path be hardcoded initially, or do you want a settings page in the UI to configure the monitored directory path on the first run?
> 2. **File Types**: Should `chokidar` only watch for specific extensions (e.g., `.mp3`, `.wav`)?
> 3. **Styling**: I plan to use pure CSS (Vanilla CSS with CSS variables/modules) for the sleek, dark-themed modern UI to maximize control and adhere to best practices unless a specific component library is preferred. Does this work for you?

## Proposed Changes

### 1. Project Scaffolding
- Initialize the project using Vite with the React template.
- Install necessary dependencies: `electron`, `electron-builder`, `chokidar`, `better-sqlite3`, `concurrently` (for dev server).
- Setup Electron entry points: `electron/main.js` and `electron/preload.js`.

### 2. Main Process & Database (Backend)
- **Database (`electron/database.js`)**: Initialize `better-sqlite3` in the `AppData` directory. Create the `tracks` table with the exact schema provided.
- **File Watcher (`electron/watcher.js`)**: Implement `chokidar` to monitor the target NAS directory. On the `add` event, extract the file path and insert a new record into the database with `status = 'pending'` if it doesn't already exist.
- **IPC Handlers (`electron/ipcHandlers.js`)**: Expose functions to read pending tracks, tagged tracks (with filters), and update track metadata.

### 3. Preload Script
- Expose a secure `window.api` object using `contextBridge` with the following methods:
  - `getPendingTracks()`
  - `getTaggedTracks(filters)`
  - `updateTrackMetadata(payload)`

### 4. Renderer Process (Frontend)
- **Styling**: Setup a comprehensive dark-theme CSS system with vibrant accents, glassmorphism, and smooth micro-animations.
- **Components**:
  - `App.jsx`: Main routing/state manager to switch between Wizard and Browser views.
  - `Sidebar.jsx`: Navigation and filter controls.
  - `MetadataWizard.jsx`: View for the unorganized queue showing the number of pending tracks and a form for tagging them.
  - `LibraryBrowser.jsx`: The main grid view displaying tagged tracks, reacting dynamically to sidebar filters.
  - `TagForm.jsx`: Reusable component for the multi-select dropdowns/chips for Genres, Moods, Video Themes, and Instruments.

## Verification Plan

### Automated Tests
- Unit testing database interactions using a temporary in-memory SQLite database to verify the schema and insert/update queries.

### Manual Verification
- **File Detection**: Manually add a dummy `.mp3` file to a monitored test folder and verify it appears in the "Pending" queue in the UI.
- **Metadata Tagging**: Apply tags to a pending file and verify it moves to the Library Browser.
- **Filtering**: Apply various combinations of sidebar filters in the Library Browser and verify the list updates correctly based on the JSON array fields in the database.
- **Persistence**: Restart the application and ensure data is retained.
