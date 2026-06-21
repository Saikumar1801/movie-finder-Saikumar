import React, { useState, useEffect } from "react";
import { Movie } from "../types";
import MovieCard from "../components/MovieCard";
import { Loader2, HeartCrack } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { storage } from "../lib/storage";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = () => {
      setFavorites(storage.getFavorites());
      setLoading(false);
    };

    loadFavorites();
    window.addEventListener("favorites-updated", loadFavorites);
    return () => window.removeEventListener("favorites-updated", loadFavorites);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-2 block">
          Your Collection
        </span>
        <h1 className="text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl">PERSONAL LIBRARY</h1>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          {favorites.length} {favorites.length === 1 ? "movie" : "movies"} saved
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed py-24 text-center">
          <p className="text-xl font-medium text-muted-foreground">No favorites yet.</p>
          <Link to="/" className="text-primary font-bold hover:underline">
            Explore and add some movies!
          </Link>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-8"
        >
          <AnimatePresence>
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} isFavoritedInitially={true} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
