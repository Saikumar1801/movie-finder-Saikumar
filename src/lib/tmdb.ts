import { Movie, MovieDetails } from "../types";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "03bbfffc14a99e15a3d923be8bae653e"; // Hardcoded as per user request API DETAILS

const fetchTMDB = async (endpoint: string, params: Record<string, string | number> = {}) => {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    ...Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ),
  });

  const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);
  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.statusText}`);
  }
  return response.json();
};

export const tmdb = {
  getPopular: (page: number = 1) => fetchTMDB("/movie/popular", { page }),
  searchMovies: (query: string, page: number = 1) =>
    fetchTMDB("/search/movie", { query, page }),
  getMovieDetails: (id: number): Promise<MovieDetails> =>
    fetchTMDB(`/movie/${id}`, { append_to_response: "credits,videos" }),
  getGenres: () => fetchTMDB("/genre/movie/list"),
  discoverMovies: (genreId: number, page: number = 1) =>
    fetchTMDB("/discover/movie", { with_genres: genreId, page }),
};
