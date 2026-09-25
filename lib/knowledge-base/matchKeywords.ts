/** Normalize common punctuation without changing the original captured text. */
export function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[¿¡]/g, "").replace(/[’‘]/g, "'").replace(/[-–—]/g, " ").replace(/\s+/g, " ").trim();
}

export function matchesKeyword(text: string, keyword: string): boolean {
  const escaped = normalizeText(keyword).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(normalizeText(text));
}
