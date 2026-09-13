import { useState } from 'react';
import { History as HistoryIcon, Trash2, Eye, ArrowLeft, Globe } from 'lucide-react';
import type { AuditHistoryEntry } from '@/lib/types';
import { scoreColor, formatDate, formatRelativeTime } from '@/lib/scoreUtils';
import { getFaviconUrl } from '@/lib/urlUtils';
import EmptyState from '@/components/EmptyState';

interface AuditHistoryProps {
  history: AuditHistoryEntry[];
  onViewReport: (id: string) => void;
  onBack: () => void;
  onClear: () => void;
  onDelete: (id: string) => void;
}

export default function AuditHistory({
  history,
  onViewReport,
  onBack,
  onClear,
  onDelete,
}: AuditHistoryProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-bold text-gray-900">Audit History</h1>
          <span className="text-sm text-gray-400">({history.length})</span>
        </div>

        {history.length > 0 && (
          <div>
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Are you sure?</span>
                <button
                  onClick={() => {
                    onClear();
                    setConfirmClear(false);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Yes, clear all
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <EmptyState
            icon={<HistoryIcon className="w-8 h-8 text-gray-400" />}
            title="No audits yet"
            description="Your audit history will appear here once you run your first website audit."
            action={
              <button
                onClick={onBack}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-indigo-200"
              >
                Run Your First Audit
              </button>
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((entry, i) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
              style={{
                animation: `fadeUp 0.3s ease-out ${i * 50}ms both`,
              }}
            >
              <div className="relative flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor: scoreColor(entry.overallScore) + '15',
                    color: scoreColor(entry.overallScore),
                  }}
                >
                  {entry.overallScore}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <img
                    src={getFaviconUrl(entry.domain)}
                    alt=""
                    className="w-4 h-4 rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {entry.domain}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate">{entry.url}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDate(entry.timestamp)} · {formatRelativeTime(entry.timestamp)}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => onDelete(entry.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewReport(entry.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">View Report</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6">
          <Globe className="w-3.5 h-3.5" />
          <span>Stored locally in your browser</span>
        </div>
      )}
    </div>
  );
}
