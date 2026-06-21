import { Movie } from "../types";

const FAVORITES_KEY = "cine_search_favorites";

export const storage = {
  getFavorites: (): Movie[] => {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  },

  isFavorited: (movieId: number): boolean => {
    const favorites = storage.getFavorites();
    return favorites.some((m) => m.id === movieId);
  },

  addFavorite: (movie: Movie) => {
    const favorites = storage.getFavorites();
    if (!favorites.some((m) => m.id === movie.id)) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites, movie]));
      window.dispatchEvent(new Event("favorites-updated"));
    }
  },

  removeFavorite: (movieId: number) => {
    const favorites = storage.getFavorites();
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites.filter((m) => m.id !== movieId))
    );
    window.dispatchEvent(new Event("favorites-updated"));
  },

  toggleFavorite: (movie: Movie) => {
    if (storage.isFavorited(movie.id)) {
      storage.removeFavorite(movie.id);
    } else {
      storage.addFavorite(movie);
    }
  },
};
