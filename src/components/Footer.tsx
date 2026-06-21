export default function Footer() {
  return (
    <footer className="h-16 border-t border-white/5 bg-slate-950 flex items-center justify-between px-8 text-[11px] text-slate-500 font-medium">
      <div className="flex items-center gap-8">
        <span>© {new Date().getFullYear()} CineSearch Media Inc.</span>
        <div className="hidden sm:flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Help Center</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-foreground">
          Built for Jeevan — Saikumar
        </span>
        <div className="flex items-center gap-2">
          <span>System Status: <span className="text-emerald-500">Online</span></span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>
    </footer>
  );
}
