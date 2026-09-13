interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

export default function ScoreGauge({ score, size = 200, label }: ScoreGaugeProps) {
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 80 ? '#16a34a' : score >= 50 ? '#eab308' : '#dc2626';
  const tier = score >= 80 ? 'Good' : score >= 50 ? 'Needs Work' : 'Poor';

  return (
    <div className="relative flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease',
          }}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ paddingTop: size * 0.02 }}
      >
        <span
          className="text-5xl font-bold leading-none tracking-tight"
          style={{ color }}
        >
          {score}
        </span>
        <span className="text-xs text-gray-400 mt-1 font-medium">/ 100</span>
        <span
          className="text-sm font-semibold mt-1.5"
          style={{ color }}
        >
          {tier}
        </span>
      </div>
      {label && (
        <span className="mt-3 text-sm font-medium text-gray-500">{label}</span>
      )}
    </div>
  );
}
