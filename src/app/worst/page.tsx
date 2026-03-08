import Link from 'next/link';
import ScoreGauge from '@/components/ScoreGauge';
import ConcernBadge from '@/components/ConcernBadge';
import { getWorstSystems } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Worst Water Quality in America — WaterScore',
  description: 'See which water systems have the lowest water quality scores in the US. Based on EPA violation and contaminant data.',
};

export default function WorstPage() {
  const worst = getWorstSystems(50);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">⚠️ Worst Water Quality</h1>
      <p className="text-gray-600 mb-8">Water systems with the lowest scores based on EPA violations and contaminant data.</p>

      <div className="space-y-4">
        {worst.map((s, i) => (
          <Link
            key={s.system_id}
            href={`/system/${s.system_id}`}
            className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-red-300 transition-all"
          >
            <div className="text-lg font-bold text-gray-400 w-8">#{i + 1}</div>
            <ScoreGauge score={s.overall_score} grade={s.grade} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900">{s.system_name}</div>
              <div className="text-sm text-gray-500">
                {s.city}, {s.state} • {s.population_served.toLocaleString()} people
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {s.top_concerns.slice(0, 2).map((c, j) => (
                  <ConcernBadge key={j} concern={c} />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
