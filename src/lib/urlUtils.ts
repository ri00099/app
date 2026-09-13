export function normalizeUrl(input: string): string {
  let url = input.trim();
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

export function isValidUrl(input: string): boolean {
  const normalized = normalizeUrl(input);
  if (!normalized) return false;
  try {
    const parsed = new URL(normalized);
    return parsed.hostname.includes('.') && parsed.hostname.length > 3;
  } catch {
    return false;
  }
}

export function extractDomain(input: string): string {
  try {
    const normalized = normalizeUrl(input);
    const parsed = new URL(normalized);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return input;
  }
}

export function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}
