import { ArrowLeft, FileText, Globe, Download, Sparkles } from 'lucide-react';
import type { AuditResult } from '@/lib/types';
import { scoreColor, categoryLabel, categoryIcon, formatDate } from '@/lib/scoreUtils';
import { getFaviconUrl } from '@/lib/urlUtils';
import ScoreGauge from '@/components/ScoreGauge';
import ScoreBar from '@/components/ScoreBar';
import CategoryCard from '@/components/CategoryCard';
import RecommendationCard from '@/components/RecommendationCard';

interface AuditResultsProps {
  result: AuditResult;
  onBack: () => void;
  onNewAudit: () => void;
}

export default function AuditResults({ result, onBack, onNewAudit }: AuditResultsProps) {
  const {
    scores,
    summary,
    recommendations,
    details,
    domain,
    url,
    timestamp,
  } = result;

  const categoryCards = [
    { category: 'performance' as const, score: scores.performance },
    { category: 'seo' as const, score: scores.seo },
    { category: 'mobile' as const, score: scores.mobile },
    { category: 'accessibility' as const, score: scores.accessibility },
    { category: 'usability' as const, score: scores.usability },
    { category: 'technical' as const, score: scores.technical },
  ];

  const highPriorityCount = recommendations.filter((r) => r.priority === 'High').length;

  const handleDownload = () => {
    const reportText = generateReportText(result);
    const blob = new Blob([reportText], { type: 'text/plain' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `sitepilot-audit-${domain}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={onNewAudit}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            New Audit
          </button>
        </div>
      </div>

      {/* Site info */}
      <div className="flex items-center gap-3 mb-6">
        <img
          src={getFaviconUrl(domain)}
          alt=""
          className="w-10 h-10 rounded-lg bg-gray-100"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{domain}</h1>
          <p className="text-xs text-gray-400 truncate">{url}</p>
        </div>
        <span className="ml-auto text-xs text-gray-400 whitespace-nowrap">
          {formatDate(timestamp)}
        </span>
      </div>

      {/* Overall Score + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col items-center justify-center">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">Overall Score</h2>
          <ScoreGauge score={scores.overall} size={180} />
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-indigo-500" />
            </div>
            <h2 className="text-sm font-semibold text-gray-800">AI Executive Summary</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>

          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100">
            <div>
              <div className="text-2xl font-bold text-gray-900">{recommendations.length}</div>
              <div className="text-xs text-gray-400 mt-0.5">Recommendations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">{highPriorityCount}</div>
              <div className="text-xs text-gray-400 mt-0.5">High Priority</div>
            </div>
            <div>
              <div
                className="text-2xl font-bold"
                style={{ color: scoreColor(scores.overall) }}
              >
                {scores.overall >= 80 ? 'Healthy' : scores.overall >= 50 ? 'Fair' : 'At Risk'}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Scores */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {categoryCards.map((cat, i) => (
          <CategoryCard
            key={cat.category}
            category={cat.category}
            label={categoryLabel(cat.category)}
            score={cat.score}
            iconName={categoryIcon(cat.category)}
            delay={i * 80}
          />
        ))}
      </div>

      {/* Audit Details */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">Audit Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
          {details.map((detail, i) => (
            <ScoreBar
              key={detail.category}
              label={detail.label}
              score={detail.score}
              description={detail.description}
              delay={i * 100}
            />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-bold text-gray-900">
            AI Recommendations
          </h2>
          <span className="text-sm text-gray-400">({recommendations.length})</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, i) => (
            <RecommendationCard key={rec.id} recommendation={rec} index={i} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-4 pb-2">
        <Globe className="w-3.5 h-3.5" />
        <span>Generated by SitePilot AI heuristic engine</span>
      </div>
    </div>
  );
}

function generateReportText(result: AuditResult): string {
  const lines: string[] = [];
  lines.push('=== SitePilot AI Audit Report ===');
  lines.push(`Website: ${result.url}`);
  lines.push(`Date: ${formatDate(result.timestamp)}`);
  lines.push('');
  lines.push('--- Scores ---');
  lines.push(`Overall: ${result.scores.overall}/100`);
  lines.push(`Performance: ${result.scores.performance}/100`);
  lines.push(`SEO: ${result.scores.seo}/100`);
  lines.push(`Mobile: ${result.scores.mobile}/100`);
  lines.push(`Accessibility: ${result.scores.accessibility}/100`);
  lines.push(`Usability: ${result.scores.usability}/100`);
  lines.push(`Technical: ${result.scores.technical}/100`);
  lines.push('');
  lines.push('--- AI Executive Summary ---');
  lines.push(result.summary);
  lines.push('');
  lines.push('--- Recommendations ---');
  result.recommendations.forEach((rec, i) => {
    lines.push(`${i + 1}. [${rec.priority.toUpperCase()}] ${rec.category}`);
    lines.push(`   Problem: ${rec.problem}`);
    lines.push(`   Solution: ${rec.solution}`);
    lines.push(`   Expected Impact: ${rec.expectedImpact}`);
    lines.push('');
  });
  return lines.join('\n');
}
