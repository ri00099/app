import { History, Radar } from 'lucide-react';
import type { View } from '@/lib/types';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export default function Header({ currentView, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200 group-hover:shadow-lg group-hover:shadow-indigo-300 transition-shadow">
              <Radar className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <span className="block text-base font-bold text-gray-900 leading-none tracking-tight">
                SitePilot AI
              </span>
              <span className="hidden sm:block text-xs text-gray-500 mt-0.5">
                AI Website Audit Platform
              </span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('history')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === 'history'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-gray-600 hover:bg-gray-100 border border-transparent'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </button>
        </div>
      </div>
    </header>
  );
}
