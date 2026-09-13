import * as Icons from 'lucide-react';
import type { ScoreCategory } from '@/lib/types';
import { scoreColor } from '@/lib/scoreUtils';

interface CategoryCardProps {
  category: ScoreCategory;
  label: string;
  score: number;
  iconName: string;
  delay?: number;
}

export default function CategoryCard({
  label,
  score,
  iconName,
  delay = 0,
}: CategoryCardProps) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[iconName] || Icons.Activity;
  const color = scoreColor(score);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all hover:border-gray-300"
      style={{
        animation: `fadeUp 0.5s ease-out ${delay}ms both`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + '15' }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span
          className="text-2xl font-bold tracking-tight"
          style={{ color }}
        >
          {score}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${score}%`,
            backgroundColor: color,
            transition: 'width 1s ease-out',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}
