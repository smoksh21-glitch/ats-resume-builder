'use client';

export default function ScoreGauge({ score, size = 200 }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const remaining = circumference - progress;

  const getColor = (score) => {
    if (score >= 75) return '#22C55E';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const getLabel = (score) => {
    if (score >= 75) return 'Great';
    if (score >= 50) return 'Needs Work';
    return 'Poor';
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={remaining}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color: getColor(score) }}>
          {score}
        </span>
        <span className="text-sm text-gray-500 font-medium">{getLabel(score)}</span>
      </div>
    </div>
  );
}
