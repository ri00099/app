import { useState } from 'react';
import { ArrowRight, Sparkles, Gauge, Search, Smartphone, Accessibility, Zap } from 'lucide-react';
import { isValidUrl, normalizeUrl } from '@/lib/urlUtils';

interface DashboardProps {
  onRunAudit: (url: string) => void;
}

export default function Dashboard({ onRunAudit }: DashboardProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a website URL.');
      return;
    }
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }
    setError('');
    onRunAudit(normalizeUrl(url));
  };

  const features = [
    { icon: Gauge, label: 'Performance', color: 'text-blue-500' },
    { icon: Search, label: 'SEO', color: 'text-green-500' },
    { icon: Smartphone, label: 'Mobile', color: 'text-purple-500' },
    { icon: Accessibility, label: 'Accessibility', color: 'text-orange-500' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs font-medium text-indigo-600">
            AI-Powered Website Auditing
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-4">
          Understand what's holding your{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            website back.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
          AI-powered website auditing with actionable recommendations for
          performance, SEO, mobile experience and usability.
        </p>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <div
            className={`flex items-stretch gap-2 p-1.5 bg-white rounded-2xl border-2 shadow-lg shadow-gray-200/50 transition-all ${
              error
                ? 'border-red-300'
                : 'border-gray-200 focus-within:border-indigo-400 focus-within:shadow-indigo-200/50'
            }`}
          >
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError('');
              }}
              placeholder="https://example.com"
              className="flex-1 px-4 py-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-transparent outline-none min-w-0"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-indigo-200 active:scale-[0.97] whitespace-nowrap"
            >
              <span className="hidden sm:inline">Run AI Audit</span>
              <span className="sm:hidden">Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-500 mt-2 text-left pl-4">{error}</p>
          )}
        </form>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-10">
          {features.map((feature) => (
            <div
              key={feature.label}
              className="flex items-center gap-2 text-sm text-gray-500"
            >
              <feature.icon className={`w-4 h-4 ${feature.color}`} />
              <span className="font-medium">{feature.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { stat: '6', label: 'Audit Categories' },
            { stat: '8+', label: 'AI Recommendations' },
            { stat: '100', label: 'Point Scoring' },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-xl border border-gray-100 px-4 py-3"
            >
              <div className="text-2xl font-bold text-gray-900">{item.stat}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
