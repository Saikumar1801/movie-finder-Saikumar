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
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0 transition-transform hover:scale-105 active:scale-95">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20">
            <div className="h-4 w-4 rotate-45 rounded-sm border-2 border-white"></div>
          </div>
          <h1 className="text-lg sm:text-xl font-black tracking-tighter text-foreground">
            CINE<span className="text-indigo-500">SEARCH</span>
          </h1>
        </Link>

        <div className="relative flex-1 max-w-md mx-2 sm:mx-4">
          <form onSubmit={handleSearch}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className="w-full rounded-full border border-border bg-muted/50 py-1.5 pl-9 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-indigo-500/40"
            />
          </form>

          {showDropdown && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl backdrop-blur-xl">
              <div className="p-2">
                <span className="mb-2 block px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent</span>
                {recentSearches.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentClick(query)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Search className="h-3 w-3 text-muted-foreground" />
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => setIsDark(!isDark)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <Link to="/favorites" className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
            Library
          </Link>
        </div>
      </div>
    </nav>
  );
}
