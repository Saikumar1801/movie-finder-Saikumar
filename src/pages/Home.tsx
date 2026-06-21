import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { tmdb } from "../lib/tmdb";
import { Movie } from "../types";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import { Loader2, SearchX, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await tmdb.getGenres();
        setGenres(data.genres);
      } catch (err) {
        console.error("Failed to fetch genres", err);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        // Requirement R1: Exactly 12 results per page.
        const startItemIndex = (page - 1) * 12;
        const apiPage1 = Math.floor(startItemIndex / 20) + 1;
        const offsetInPage1 = startItemIndex % 20;

        let results: Movie[] = [];
        const fetchFn = query 
          ? (p: number) => tmdb.searchMovies(query, p)
          : selectedGenre 
            ? (p: number) => tmdb.discoverMovies(selectedGenre, p)
            : (p: number) => tmdb.getPopular(p);

        const response1 = await fetchFn(apiPage1);
        results = response1.results.slice(offsetInPage1);

        if (results.length < 12 && apiPage1 < response1.total_pages) {
          const apiPage2 = apiPage1 + 1;
          const response2 = await fetchFn(apiPage2);
          results = [...results, ...response2.results];
        }

        const finalResults = results.slice(0, 12);
        setMovies(finalResults);
        setTotalPages(Math.floor(response1.total_results / 12));
      } catch (err) {
        setError("Failed to load movies. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchMovies, query ? 500 : 0);
    return () => clearTimeout(debounceTimer);
  }, [query, page, selectedGenre]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: query, page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-2 block">
            Discovery
          </span>
          <h1 className="text-4xl font-black tracking-tighter text-foreground sm:text-5xl lg:text-6xl">
            {query ? `RESULTS FOR "${query}"` : "EXPLORE TITLES"}
          </h1>
        </div>
        
        {!query && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGenre(null)}
              className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedGenre === null 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {genres.slice(0, 6).map((genre) => (
              <button
                key={genre.id}
                onClick={() => {
                  setSelectedGenre(genre.id);
                  setSearchParams({ q: query, page: "1" });
                }}
                className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedGenre === genre.id 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        </div>
      ) : error ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
          <SearchX className="h-10 w-10 text-red-500" />
          <h2 className="text-2xl font-bold uppercase tracking-widest text-red-400">Error</h2>
          <p className="text-slate-500">{error}</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
          <SearchX className="h-12 w-12 text-slate-700" />
          <h2 className="text-xl font-bold text-slate-400">No movies found</h2>
        </div>
      ) : (
        <>
          <motion.div 
            layout
            className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
          >
            <AnimatePresence mode="popLayout">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </AnimatePresence>
          </motion.div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 transition-all hover:scale-110 active:scale-95"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
