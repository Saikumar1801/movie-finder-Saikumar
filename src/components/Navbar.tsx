import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Moon, Sun, Film } from "lucide-react";
import { cn } from "../lib/utils";

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const newSearches = [
        searchQuery.trim(),
        ...recentSearches.filter((s) => s !== searchQuery.trim()),
      ].slice(0, 5);
      setRecentSearches(newSearches);
      localStorage.setItem("recent_searches", JSON.stringify(newSearches));
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleRecentClick = (query: string) => {
    setSearchQuery(query);
    navigate(`/?q=${encodeURIComponent(query)}`);
    setShowDropdown(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20">
            <div className="h-4 w-4 rotate-45 rounded-sm border-2 border-white"></div>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white">
            CINE<span className="text-indigo-500">SEARCH</span>
          </h1>
        </Link>

        <div className="relative mx-4 hidden max-w-md flex-1 md:block">
          <form onSubmit={handleSearch}>
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              placeholder="Search titles, actors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className="w-full rounded-full border border-white/10 bg-slate-900/50 py-2 pl-10 pr-4 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/40"
            />
          </form>

          {showDropdown && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl backdrop-blur-xl">
              <div className="p-2">
                <span className="mb-2 block px-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Recent Searches</span>
                {recentSearches.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentClick(query)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Search className="h-3 w-3 text-slate-500" />
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <Link to="/favorites" className="text-[11px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-white">
            Library
          </Link>
        </div>
      </div>
    </nav>
  );
}
