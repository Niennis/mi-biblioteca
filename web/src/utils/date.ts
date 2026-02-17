const LOCALE = "es-ES";

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
