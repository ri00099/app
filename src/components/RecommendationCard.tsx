import { AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import type { Recommendation } from '@/lib/types';
import { priorityBadgeClass } from '@/lib/scoreUtils';

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

export default function RecommendationCard({
  recommendation,
  index,
}: RecommendationCardProps) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all"
      style={{
        animation: `fadeUp 0.4s ease-out ${index * 80}ms both`,
      }}
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className={`px-2.5 py-1 rounded-md text-xs font-bold border ${priorityBadgeClass(
            recommendation.priority,
          )}`}
        >
          {recommendation.priority.toUpperCase()} PRIORITY
        </span>
        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
          {recommendation.category}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
              Problem
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {recommendation.problem}
            </p>
          </div>
        </div>

        <div className="flex gap-2.5">
          <Lightbulb className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
              Solution
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {recommendation.solution}
            </p>
          </div>
        </div>

        <div className="flex gap-2.5">
          <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
              Expected Impact
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {recommendation.expectedImpact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
