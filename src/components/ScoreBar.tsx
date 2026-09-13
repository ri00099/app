interface ScoreBarProps {
  label: string;
  score: number;
  maxScore?: number;
  description?: string;
  delay?: number;
}

export default function ScoreBar({
  label,
  score,
  maxScore = 100,
  description,
  delay = 0,
}: ScoreBarProps) {
  const percentage = (score / maxScore) * 100;
  const barColor =
    score >= 80
      ? 'bg-green-500'
      : score >= 50
        ? 'bg-yellow-500'
        : 'bg-red-500';
  const textColor =
    score >= 80
      ? 'text-green-600'
      : score >= 50
        ? 'text-yellow-600'
        : 'text-red-600';

  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <span className="text-sm font-semibold text-gray-800">{label}</span>
          {description && (
            <p className="text-xs text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
        <span className={`text-sm font-bold ${textColor}`}>
          {score}
          <span className="text-gray-300 font-normal">/{maxScore}</span>
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full`}
          style={{
            width: `${percentage}%`,
            transition: 'width 1s ease-out',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}
