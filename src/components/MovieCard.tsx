import { Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Movie } from "../types";
import { formatRating, formatDate, cn } from "../lib/utils";
import { motion } from "motion/react";
import React, { useState, useEffect } from "react";
import { storage } from "../lib/storage";

interface MovieCardProps {
  movie: Movie;
  isFavoritedInitially?: boolean;
  key?: React.Key;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsFavorited(storage.isFavorited(movie.id));

    const handleUpdate = () => {
      setIsFavorited(storage.isFavorited(movie.id));
    };

    window.addEventListener("favorites-updated", handleUpdate);
    return () => window.removeEventListener("favorites-updated", handleUpdate);
  }, [movie.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    storage.toggleFavorite(movie);
  };

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10"
    >
      <Link to={`/movie/${movie.id}`} className="relative aspect-[2/3] overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
        
        <div className="absolute right-2 top-2 z-10">
          <div className="flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-black text-yellow-500 backdrop-blur-md border border-white/10">
            ★ {formatRating(movie.vote_average)}
          </div>
        </div>

        <button
          onClick={toggleFavorite}
          className={cn(
            "absolute left-3 top-3 z-10 rounded-xl p-2.5 backdrop-blur-md transition-all active:scale-90 sm:opacity-0 sm:group-hover:opacity-100",
            isFavorited ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-black/40 text-white hover:bg-black/60 border border-white/10"
          )}
        >
          <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
        </button>
      </Link>

      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
          </p>
        </div>
        <h3 className="line-clamp-1 text-sm font-black leading-tight tracking-tight text-foreground group-hover:text-indigo-500 transition-colors">
          {movie.title}
        </h3>
      </div>
    </motion.div>
  );
}
