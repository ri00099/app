import { useCallback, useEffect, useState } from 'react';
import type { AuditResult, AuditHistoryEntry, View } from '@/lib/types';
import { performAudit } from '@/lib/auditService';
import { getHistory, clearHistory, deleteHistoryEntry } from '@/lib/storage';
import { runAudit } from '@/lib/auditEngine';
import Header from '@/components/Header';
import Dashboard from '@/pages/Dashboard';
import AuditResults from '@/pages/AuditResults';
import AuditHistory from '@/pages/AuditHistory';
import ScanningOverlay from '@/components/ScanningOverlay';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [currentResult, setCurrentResult] = useState<AuditResult | null>(null);
  const [history, setHistory] = useState<AuditHistoryEntry[]>([]);
  const [scanningUrl, setScanningUrl] = useState<string | null>(null);
  const [historyCache, setHistoryCache] = useState<Map<string, AuditResult>>(new Map());

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleRunAudit = useCallback((url: string) => {
    setScanningUrl(url);
  }, []);

  const handleScanComplete = useCallback(() => {
    if (!scanningUrl) return;
    const result = performAudit(scanningUrl);
    setCurrentResult(result);
    setHistoryCache((prev) => new Map(prev).set(result.id, result));
    setHistory(getHistory());
    setScanningUrl(null);
    setView('results');
  }, [scanningUrl]);

  const handleViewReport = useCallback(
    (id: string) => {
      let result = historyCache.get(id);
      if (!result) {
        const entry = history.find((h) => h.id === id);
        if (entry) {
          result = runAudit(entry.url);
          setHistoryCache((prev) => new Map(prev).set(id, result!));
        }
      }
      if (result) {
        setCurrentResult(result);
        setView('results');
      }
    },
    [history, historyCache],
  );

  const handleNavigate = useCallback((newView: View) => {
    setView(newView);
  }, []);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
    setHistoryCache(new Map());
  }, []);

  const handleDeleteEntry = useCallback((id: string) => {
    deleteHistoryEntry(id);
    setHistory(getHistory());
    setHistoryCache((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={view} onNavigate={handleNavigate} />

      <main>
        {view === 'dashboard' && <Dashboard onRunAudit={handleRunAudit} />}

        {view === 'results' && currentResult && (
          <AuditResults
            result={currentResult}
            onBack={() => setView('dashboard')}
            onNewAudit={() => setView('dashboard')}
          />
        )}

        {view === 'results' && !currentResult && (
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <p className="text-gray-500 mb-4">No audit result to display.</p>
            <button
              onClick={() => setView('dashboard')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Run an Audit
            </button>
          </div>
        )}

        {view === 'history' && (
          <AuditHistory
            history={history}
            onViewReport={handleViewReport}
            onBack={() => setView('dashboard')}
            onClear={handleClearHistory}
            onDelete={handleDeleteEntry}
          />
        )}
      </main>

      {scanningUrl && (
        <ScanningOverlay url={scanningUrl} onComplete={handleScanComplete} />
      )}
    </div>
  );
}
