// src/utils/index.js
import { format } from "date-fns";

// ✅ Format a date like "11 Sep 2025, 10:15 PM"
export function formatDate(date) {
  try {
    return format(new Date(date), "dd MMM yyyy, hh:mm a");
  } catch (e) {
    return "Invalid Date";
  }
}

// ✅ Capitalize first letter of a string
export function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

// ✅ Create a clean page URL (removes extra slashes)
export function createPageUrl(path) {
  return `/${path.replace(/^\//, "")}`;
}
