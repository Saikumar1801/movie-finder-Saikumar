import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).getFullYear().toString();
}

export function formatRating(rating: number) {
  return rating.toFixed(1);
}
