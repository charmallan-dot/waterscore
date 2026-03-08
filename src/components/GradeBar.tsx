interface GradeBarProps {
  distribution: Record<string, number>;
}

const barColors: Record<string, string> = {
  A: 'bg-green-500',
  B: 'bg-lime-500',
  C: 'bg-yellow-500',
  D: 'bg-orange-500',
  F: 'bg-red-500',
};

export default function GradeBar({ distribution }: GradeBarProps) {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  return (
    <div>
      <div className="flex rounded-full overflow-hidden h-6">
        {['A', 'B', 'C', 'D', 'F'].map(grade => {
          const pct = (distribution[grade] / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={grade}
              className={`${barColors[grade]} flex items-center justify-center text-white text-xs font-bold`}
              style={{ width: `${pct}%` }}
              title={`${grade}: ${distribution[grade]} systems (${pct.toFixed(1)}%)`}
            >
              {pct > 5 ? grade : ''}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        {['A', 'B', 'C', 'D', 'F'].map(grade => (
          <span key={grade}>{grade}: {distribution[grade]}</span>
        ))}
      </div>
    </div>
  );
}
