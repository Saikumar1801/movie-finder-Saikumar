import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-16 flex items-center justify-center gap-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 rounded-xl border border-white/5 bg-slate-900 px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400 transition-all hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronLeft className="h-3 w-3" />
        Prev
      </button>
      
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white text-sm font-black shadow-lg shadow-indigo-500/20">
          {currentPage}
        </span>
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">OF {Math.min(totalPages, 500)}</span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= Math.min(totalPages, 500)}
        className="flex items-center gap-2 rounded-xl border border-white/5 bg-indigo-600/10 px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-indigo-400 transition-all hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
      >
        Next
        <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
}
