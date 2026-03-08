/**
 * Visual water quality score gauge — the hero component
 */

interface ScoreGaugeProps {
  score: number;
  grade: string;
  size?: 'sm' | 'md' | 'lg';
}

const gradeColors: Record<string, string> = {
  A: 'border-green-600 text-green-600',
  B: 'border-lime-600 text-lime-600',
  C: 'border-yellow-600 text-yellow-600',
  D: 'border-orange-600 text-orange-600',
  F: 'border-red-600 text-red-600',
};

const gradeBg: Record<string, string> = {
  A: 'bg-green-50',
  B: 'bg-lime-50',
  C: 'bg-yellow-50',
  D: 'bg-orange-50',
  F: 'bg-red-50',
};

const sizeClasses = {
  sm: 'w-20 h-20 border-4 text-2xl',
  md: 'w-32 h-32 border-8 text-4xl',
  lg: 'w-44 h-44 border-8 text-6xl',
};

export default function ScoreGauge({ score, grade, size = 'md' }: ScoreGaugeProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative inline-flex items-center justify-center rounded-full ${sizeClasses[size]} ${gradeColors[grade]} ${gradeBg[grade]}`}>
        <span className="font-bold">{grade}</span>
      </div>
      <div className="text-center">
        <span className={`text-2xl font-bold ${gradeColors[grade].split(' ')[1]}`}>{score}</span>
        <span className="text-gray-400 text-sm">/100</span>
      </div>
    </div>
  );
}
