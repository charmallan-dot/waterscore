import Link from 'next/link';
import WaterMap from '@/components/WaterMap';
import { getAllScores } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'US Water Quality Map — WaterScore',
  description: 'Interactive map of water quality across all 50 US states. See which states have the best and worst drinking water.',
};

function getGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function gradeColorClass(grade: string): string {
  switch (grade) {
    case 'A': return 'text-green-600';
    case 'B': return 'text-lime-600';
    case 'C': return 'text-yellow-600';
    case 'D': return 'text-orange-600';
    case 'F': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

export default function MapPage() {
  const allScores = getAllScores();

  // Aggregate by state
  const stateMap = new Map<string, { scores: number[]; pop: number; count: number; fCount: number }>();
  for (const s of allScores) {
    const existing = stateMap.get(s.state) || { scores: [], pop: 0, count: 0, fCount: 0 };
    existing.scores.push(s.overall_score);
    existing.pop += s.population_served || 0;
    existing.count++;
    if (s.grade === 'F') existing.fCount++;
    stateMap.set(s.state, existing);
  }

  const stateData = Array.from(stateMap.entries())
    .map(([state, data]) => ({
      state,
      avgScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
      grade: getGrade(Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)),
      systemCount: data.count,
      population: data.pop,
      fCount: data.fCount,
    }))
    .sort((a, b) => a.avgScore - b.avgScore);

  const worst5 = stateData.slice(0, 5);
  const best5 = [...stateData].sort((a, b) => b.avgScore - a.avgScore).slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">🗺️ US Water Quality Map</h1>
      <p className="text-gray-600 mb-6">
        Bubble size = population served. Color = average water quality grade. Click a state for details.
      </p>

      <WaterMap stateData={stateData} />

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        {['A', 'B', 'C', 'D', 'F'].map(g => (
          <div key={g} className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor:
                  g === 'A' ? '#22c55e' : g === 'B' ? '#84cc16' : g === 'C' ? '#eab308' : g === 'D' ? '#f97316' : '#ef4444',
              }}
            />
            <span className="text-gray-600">{g}</span>
          </div>
        ))}
      </div>

      {/* State Rankings */}
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <div>
          <h2 className="text-xl font-bold text-red-700 mb-4">⚠️ Worst States</h2>
          <div className="space-y-2">
            {worst5.map((s, i) => (
              <Link
                key={s.state}
                href={`/search?q=${s.state}`}
                className="flex items-center justify-between p-3 bg-white rounded-lg border hover:border-red-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-bold">#{i + 1}</span>
                  <div>
                    <span className="font-semibold">{s.state}</span>
                    <span className="text-sm text-gray-500 ml-2">{s.systemCount} systems</span>
                  </div>
                </div>
                <div className={`font-bold text-lg ${gradeColorClass(s.grade)}`}>
                  {s.grade} ({s.avgScore})
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-green-700 mb-4">✅ Best States</h2>
          <div className="space-y-2">
            {best5.map((s, i) => (
              <Link
                key={s.state}
                href={`/search?q=${s.state}`}
                className="flex items-center justify-between p-3 bg-white rounded-lg border hover:border-green-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-bold">#{i + 1}</span>
                  <div>
                    <span className="font-semibold">{s.state}</span>
                    <span className="text-sm text-gray-500 ml-2">{s.systemCount} systems</span>
                  </div>
                </div>
                <div className={`font-bold text-lg ${gradeColorClass(s.grade)}`}>
                  {s.grade} ({s.avgScore})
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Full State Table */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All States Ranked</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">#</th>
                <th className="text-left p-3">State</th>
                <th className="text-left p-3">Avg Score</th>
                <th className="text-left p-3">Grade</th>
                <th className="text-left p-3">Systems</th>
                <th className="text-left p-3">Population</th>
                <th className="text-left p-3">Failing</th>
              </tr>
            </thead>
            <tbody>
              {stateData.map((s, i) => (
                <tr key={s.state} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 text-gray-400">{i + 1}</td>
                  <td className="p-3">
                    <Link href={`/search?q=${s.state}`} className="font-semibold hover:text-water-600">
                      {s.state}
                    </Link>
                  </td>
                  <td className="p-3">{s.avgScore}</td>
                  <td className={`p-3 font-bold ${gradeColorClass(s.grade)}`}>{s.grade}</td>
                  <td className="p-3">{s.systemCount.toLocaleString()}</td>
                  <td className="p-3">{s.population.toLocaleString()}</td>
                  <td className="p-3">
                    {s.fCount > 0 ? (
                      <span className="text-red-600 font-semibold">{s.fCount}</span>
                    ) : (
                      <span className="text-green-600">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
