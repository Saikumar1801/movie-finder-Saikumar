import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tmdb } from "../lib/tmdb";
import { MovieDetails } from "../types";
import { formatDate, formatRating, cn } from "../lib/utils";
import { Loader2, Star, Clock, Calendar, ChevronLeft, Heart, Play } from "lucide-react";
import { motion } from "motion/react";
import { storage } from "../lib/storage";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const details = await tmdb.getMovieDetails(parseInt(id));
        setMovie(details);
        setIsFavorited(storage.isFavorited(parseInt(id)));
      } catch (err) {
        setError("Failed to fetch movie details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const toggleFavorite = () => {
    if (!movie) return;
    storage.toggleFavorite(movie);
    setIsFavorited(!isFavorited);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-2xl font-bold">Error Loading Movie</h2>
        <p className="text-muted-foreground">{error || "Movie not found"}</p>
        <button onClick={() => navigate("/")} className="rounded-full bg-primary px-6 py-2 text-primary-foreground">
          Go Back Home
        </button>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return (
    <div className="min-h-screen pb-12">
      <div className="relative h-[40vh] sm:h-[60vh] w-full overflow-hidden">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-accent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 rounded-full bg-background/50 p-2 text-foreground backdrop-blur-md transition-colors hover:bg-background/80"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>

      <div className="container mx-auto -mt-32 px-4 sm:-mt-48">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mx-auto w-64 flex-shrink-0 md:mx-0"
          >
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"}
              alt={movie.title}
              className="rounded-2xl border shadow-2xl transition-transform hover:scale-105"
            />
          </motion.div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <h1 className="mb-2 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                {movie.title}
              </h1>
              
              {movie.tagline && (
                <p className="mb-6 text-xl italic text-muted-foreground">"{movie.tagline}"</p>
              )}

              <div className="mb-8 flex flex-wrap items-center justify-center gap-6 md:justify-start">
                <div className="flex items-center gap-1.5 text-yellow-500">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="text-lg font-bold">{formatRating(movie.vote_average)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">{movie.runtime} min</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">{formatDate(movie.release_date)}</span>
                </div>
              </div>

              <div className="mb-8 flex flex-wrap justify-center gap-4 md:justify-start">
                <button
                  onClick={toggleFavorite}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-10 py-4 text-[13px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl",
                    isFavorited 
                      ? "bg-red-500 text-white shadow-red-500/20 hover:bg-red-600" 
                      : "bg-indigo-600 text-white shadow-indigo-500/20 hover:bg-indigo-700"
                  )}
                >
                  <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
                  {isFavorited ? "Saved to Library" : "Add to Library"}
                </button>
                <button className="flex items-center gap-2 rounded-xl bg-slate-800/40 px-10 py-4 text-[13px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/5 hover:bg-slate-800 transition-all">
                  <Play className="h-4 w-4 fill-current text-indigo-400" />
                  Watch Now
                </button>
              </div>

                <div className="space-y-6 max-w-3xl">
                <div>
                  <h2 className="mb-3 text-2xl font-bold">Overview</h2>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {movie.overview}
                  </p>
                </div>

                {movie.videos?.results.find(v => v.type === "Trailer" && v.site === "YouTube") && (
                  <div className="mt-8 border-t border-white/5 pt-8">
                    <h2 className="mb-6 text-2xl font-bold text-white tracking-tight uppercase tracking-[0.1em] text-sm text-indigo-500">Official Trailer</h2>
                    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/5 bg-slate-900 shadow-2xl">
                      <iframe
                        src={`https://www.youtube.com/embed/${movie.videos.results.find(v => v.type === "Trailer" && v.site === "YouTube")?.key}`}
                        title="Movie Trailer"
                        className="h-full w-full"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1 text-[10px]">Budget</h3>
                    <p className="text-lg font-mono text-white">${movie.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1 text-[10px]">Revenue</h3>
                    <p className="text-lg font-mono text-white">${movie.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
