import React, { useState, useEffect } from "react";
import { Movie } from "../types";
import MovieCard from "../components/MovieCard";
import { Loader2, HeartCrack, ArrowLeft } from "lucide-react";
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
      <div className="mb-8">
        <Link 
          to="/" 
          className="mb-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-colors hover:text-indigo-500 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          Back to Explore
        </Link>
      </div>
      <div className="mb-12 text-center">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-2 block">
          Your Collection
        </span>
        <h1 className="text-4xl font-black tracking-tighter text-foreground sm:text-5xl lg:text-6xl">PERSONAL LIBRARY</h1>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {favorites.length} {favorites.length === 1 ? "movie" : "movies"} saved
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 rounded-3xl border-2 border-dashed border-border py-24 text-center">
          <div className="rounded-full bg-muted p-6">
            <HeartCrack className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2 px-4">
            <h2 className="text-xl font-bold text-foreground capitalize">Your library is empty</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              You haven't saved any movies yet. Go back to the explore page to find your next favorite titles.
            </p>
          </div>
          <Link 
            to="/" 
            className="rounded-xl bg-indigo-600 px-8 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
          >
            Explore Movies
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
