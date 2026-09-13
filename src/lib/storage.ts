import type { AuditResult, AuditHistoryEntry } from './types';

const STORAGE_KEY = 'sitepilot-audit-history';
const MAX_HISTORY = 50;

export function saveAudit(result: AuditResult): void {
  const history = getHistory();
  const entry: AuditHistoryEntry = {
    id: result.id,
    url: result.url,
    domain: result.domain,
    overallScore: result.scores.overall,
    timestamp: result.timestamp,
  };
  history.unshift(entry);
  const trimmed = history.slice(0, MAX_HISTORY);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage may be full or unavailable; silently ignore
  }
}

export function getHistory(): AuditHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function deleteHistoryEntry(id: string): void {
  const history = getHistory().filter((entry) => entry.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}
