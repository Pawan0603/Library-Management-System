import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format as dateFnsFormat } from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return "N/A";
  return dateFnsFormat(new Date(date), "MMM dd, yyyy");
}
