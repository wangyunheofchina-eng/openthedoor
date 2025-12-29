export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJson(key: string, value: any) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function safeId(prefix = 'book') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function parseTableText(text: string) {
  const lines = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const hasTab = lines.some(l => l.includes('\t'));
  const hasComma = lines.some(l => l.includes(','));
  const delim: 'tab' | 'comma' | 'space' = hasTab ? 'tab' : hasComma ? 'comma' : 'space';

  const splitLine = (l: string): string[] => {
    if (delim === 'tab') return l.split('\t').map(x => x.trim());
    if (delim === 'comma') return l.split(',').map(x => x.trim());
    return l.split(/\s{2,}|\s+/).map(x => x.trim());
  };

  const rows = lines.map(splitLine).filter(cols => cols[0] && cols[0].length > 0);

  const header = rows[0]?.map(x => x.toLowerCase());
  const looksHeader =
    header &&
    (header.includes('word') || header.includes('meaning') || header.includes('phonetic') || header.includes('translation'));

  const start = looksHeader ? 1 : 0;

  const words: { word: string; meaning: string; phonetic?: string }[] = [];
  for (let i = start; i < rows.length; i++) {
    const cols = rows[i];
    const word = (cols[0] ?? '').trim();
    const meaning = (cols[1] ?? '').trim();
    const phonetic = (cols[2] ?? '').trim();
    if (!word) continue;
    words.push({ word, meaning, phonetic: phonetic || undefined });
  }
  return words;
}
