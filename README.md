# CineSearch (Movie Discovery App)

A sleek, modern movie discovery application built for the Full-Stack Developer Intern assignment. Featuring high-fidelity design, real-time search, and manual pagination.

## 🚀 Features

- **Movie Discovery**: Browse popular and trending titles in a responsive grid.
- **Search**: Real-time search by title with a cached "Recent Searches" history.
- **Genre Filtering**: Filter results by TMDB categories (Action, Sci-Fi, etc.).
- **Details View**: In-depth movie information including ratings, budget, revenue, and embedded official YouTube trailers.
- **Library**: Save movies to a personal library that persists using `localStorage`.
- **R1 Compliant Pagination**: Strict 12-item per page grid with manual navigation.
- **Sleek UI**: Slate-950 dark theme with glass-morphism effects and smooth transitions using Framer Motion.

## 🛠️ Tech Stack

- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS (v4)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Source**: [TMDB API](https://www.themoviedb.org/)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A TMDB API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Saikumar1801/movie-finder-Saikumar.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root and add your TMDB API token:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## 📝 Assignment Requirements (R1-R4)

- **R1**: Exactly 12 results per page using manual Next/Prev pagination.
- **R2**: Repository named `movie-finder-saikumar`.
- **R3**: `AI_LOG.md` included in the root with detailed prompting and manual fix logs.
- **R4**: Footer marker present: "Built for Jeevan — Saikumar".

---
Built by Saikumar
