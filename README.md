# 🎵 Music Filtering System

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://semver.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python Version](https://img.shields.io/badge/python-3.9%2B-brightgreen.svg)](https://www.python.org/)

> A modular system for analyzing, filtering, and organizing music tracks based on metadata, audio feature extraction (BPM, key, spectral features), and user preferences.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#-usage)
  - [Basic Command Line Example](#basic-command-line-example)
  - [Python API Example](#python-api-example)
- [Project Structure](#-project-structure)
- [Versioning](#-versioning)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎧 Overview

With vast libraries of digital audio available today, finding specific music that fits exact parameters—like workout tempo ranges, ambient frequency profiles, or sub-genres—can be challenging.

This repository provides an automated pipeline that ingests audio tracks or metadata datasets, extracts relevant acoustic features, and applies customized filtering algorithms to deliver refined playlists and track recommendations.

---

## ✨ Key Features

- **Multi-Criteria Metadata Filtering:** Filter tracks by artist, genre, release year, energy level, and acousticness.
- **Audio Feature Extraction:** Automatic analysis of audio properties including:
  - Tempo / BPM detection
  - Spectral Centroid & Rolloff (timbre characteristics)
  - Mel-Frequency Cepstral Coefficients (MFCCs)
- **Customizable Filter Pipelines:** Chain multiple filter constraints (e.g., *Tempo: 120–130 BPM AND Genre: Synthwave*).
- **Similarity & Recommendation:** Content-based similarity scoring using Euclidean and Cosine distance vectors.
- **Clean Output Export:** Export filtered results directly to JSON, CSV, or playable custom playlists.

---

## 🛠 Tech Stack

| Category | Tools & Libraries |
|---------|----------------|
| **Core Language** | Python 3.9+ |
| **Audio Processing** | Librosa, SoundFile, SciPy |
| **Data Manipulation** | Pandas, NumPy |
| **Machine Learning / Distance Metrics** | Scikit-Learn |
| **CLI / Interface** | Rich, Click / Argparse |

---

## 🏗 Project Architecture

```text
+------------------+
|   Audio Input    | (MP3 / WAV / Metadata CSV)
+--------+---------+
         |
         v
+------------------+
| Feature Extractor| (BPM, MFCCs, Spectral Features)
+--------+---------+
         |
         v
+------------------+
| Filter Pipeline  | (Custom Rules & Thresholds)
+--------+---------+
         |
         v
+------------------+
|  Filtered Output | (Playlist / Exported Dataset)
+------------------+
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- **Python 3.9+**
- **pip** package manager
- **FFmpeg** (Required for audio format decoding)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Dev-Liss/Music-Filtering-System.git
cd Music-Filtering-System
```

2. **Create and activate a virtual environment:**

```bash
# On macOS/Linux
python3 -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate
```

3. **Install dependencies:**

```bash
pip install -r requirements.txt
```

---

## 💻 Usage

### Basic Command Line Example

Run the filtering pipeline on a dataset or folder of audio files:

```bash
# Filter by tempo and genre
python main.py --genre "Electronic" --min-bpm 120 --max-bpm 128 --export output_playlist.json
```

### Python API Example

```python
from src.filter_engine import MusicFilter
from src.feature_extractor import AudioAnalyzer

# Initialize analyzer and filter engine
analyzer = AudioAnalyzer()
filter_engine = MusicFilter()

# Extract features from an audio file
features = analyzer.extract_features("data/sample_track.wav")

# Apply custom filtering rules
filtered_tracks = filter_engine.apply_rules(
    target_bpm=(120, 130),
    min_energy=0.75
)

print(f"Matched Tracks: {len(filtered_tracks)}")
```

---

## 📁 Project Structure

```text
Music-Filtering-System/
├── data/                      # Sample audio tracks or datasets
├── src/                       # Source code
│   ├── audio_loader.py        # File loading & audio stream handling
│   ├── feature_extractor.py   # DSP & Librosa feature extraction
│   ├── filter_engine.py       # Core filtering logic & algorithms
│   └── utils.py               # Helper utilities and formatters
├── tests/                     # Unit tests
├── main.py                    # Entry point
├── requirements.txt           # Python dependencies
├── .gitignore                 # Ignored files
├── LICENSE                    # MIT License
└── README.md                  # Project documentation
```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for details.
