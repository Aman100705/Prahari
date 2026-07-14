import { clsx, type ClassValue } from "clsx";

/** Merge conditional class names. Kept intentionally tiny — no tailwind-merge dep. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
