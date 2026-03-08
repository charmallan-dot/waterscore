import { notFound } from 'next/navigation';
import Link from 'next/link';
import ScoreGauge from '@/components/ScoreGauge';
import ConcernBadge from '@/components/ConcernBadge';
import { getScoreBySystemId, getViolationsForSystem, getContaminantsForSystem } from '@/lib/data';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const score = getScoreBySystemId(id);
  if (!score) return { title: 'System Not Found — WaterScore' };
  return {
    title: `Water Quality: ${score.system_name}, ${score.state} — Grade ${score.grade} | WaterScore`,
    description: `${score.system_name} in ${score.city}, ${score.state} scored ${score.overall_score}/100 (${score.grade}). ${score.top_concerns[0] || 'Check contaminants, violations, and lead risk.'}`,
  };
}

export default async function SystemPage({ params }: PageProps) {
  const { id } = await params;
  const score = getScoreBySystemId(id);
  if (!score) notFound();

  const violations = getViolationsForSystem(id);
  const contaminants = getContaminantsForSystem(id);

  const recentViolations = violations
    .sort((a, b) => new Date(b.begin_date).getTime() - new Date(a.begin_date).getTime())
    .slice(0, 10);

  const exceedances = contaminants.filter(c => c.exceeds_mcl === true);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-water-600">Home</Link>
        <span className="mx-2">›</span>
        <Link href={`/search?q=${score.state}`} className="hover:text-water-600">{score.state}</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{score.system_name}</span>
      </nav>

      {/* Hero */}
      <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
        <ScoreGauge score={score.overall_score} grade={score.grade} size="lg" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{score.system_name}</h1>
          <p className="text-lg text-gray-600 mt-1">{score.city}, {score.state}</p>
          <p className="text-sm text-gray-400 mt-1">
            Serves {score.population_served.toLocaleString()} people • 
            Last updated {new Date(score.updated_at).toLocaleDateString()}
          </p>

          {/* Concerns */}
          {score.top_concerns.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {score.top_concerns.map((c, i) => (
                <ConcernBadge key={i} concern={c} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Score Breakdown */}
      <section className="bg-gray-50 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Score Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Violations', score: score.violation_score, weight: '40%' },
            { label: 'Contaminants', score: score.contaminant_score, weight: '30%' },
            { label: 'Source', score: score.source_score, weight: '10%' },
            { label: 'Infrastructure', score: score.infrastructure_score, weight: '10%' },
            { label: 'System Size', score: score.size_score, weight: '10%' },
          ].map(({ label, score: s, weight }) => (
            <div key={label} className="text-center p-3 bg-white rounded-lg">
              <div className={`text-2xl font-bold ${s >= 80 ? 'text-green-600' : s >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {s}
              </div>
              <div className="text-sm font-medium text-gray-700">{label}</div>
              <div className="text-xs text-gray-400">{weight} weight</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contaminant Exceedances */}
      {exceedances.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-red-700 mb-4">
            ⚠️ Contaminants Exceeding EPA Limits ({exceedances.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-red-50">
                <tr>
                  <th className="text-left p-3 font-semibold">Contaminant</th>
                  <th className="text-left p-3 font-semibold">Measured</th>
                  <th className="text-left p-3 font-semibold">EPA Limit</th>
                  <th className="text-left p-3 font-semibold">Health Effects</th>
                </tr>
              </thead>
              <tbody>
                {exceedances.map((c, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="p-3 font-medium">{c.contaminant_name}</td>
                    <td className="p-3 text-red-600 font-bold">{c.measured_value} {c.unit}</td>
                    <td className="p-3">{c.mcl} {c.unit}</td>
                    <td className="p-3 text-gray-600 text-xs">{c.health_effects}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Recent Violations */}
      {recentViolations.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Violations ({violations.length} total)
          </h2>
          <div className="space-y-2">
            {recentViolations.map((v, i) => (
              <div key={i} className={`p-3 rounded-lg border ${v.is_resolved ? 'border-gray-200 bg-white' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${v.is_health_based ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                      {v.is_health_based ? 'Health-Based' : 'Non-Health'}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">{v.violation_type}</span>
                  </div>
                  <span className={`text-xs ${v.is_resolved ? 'text-green-600' : 'text-red-600 font-bold'}`}>
                    {v.is_resolved ? '✅ Resolved' : '🔴 Open'}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(v.begin_date).toLocaleDateString()} 
                  {v.end_date && ` — ${new Date(v.end_date).toLocaleDateString()}`}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* What You Can Do */}
      <section className="bg-water-50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-water-800 mb-4">💡 What You Can Do</h2>
        <div className="space-y-3 text-sm text-gray-700">
          {score.grade === 'A' || score.grade === 'B' ? (
            <p>Your water system has a good score! For extra peace of mind, a basic carbon filter (like Brita) can further improve taste and remove trace contaminants.</p>
          ) : (
            <>
              {exceedances.some(e => e.contaminant_code === 'PB90') && (
                <p>🔴 <strong>Lead detected above EPA limits.</strong> Use a reverse osmosis (RO) filter or a certified lead-removing pitcher. Never use hot tap water for cooking or drinking.</p>
              )}
              {exceedances.some(e => e.contaminant_code === 'CU90') && (
                <p>🟠 <strong>Copper above EPA limits.</strong> Run your tap for 30 seconds before drinking. A reverse osmosis system can remove copper.</p>
              )}
              {score.unresolved_violations > 0 && (
                <p>⚠️ <strong>{score.unresolved_violations} unresolved violation(s).</strong> Contact your water utility ({score.system_name}) to ask about their remediation plan.</p>
              )}
              <p>For comprehensive protection, we recommend a <strong>reverse osmosis system</strong> which removes 99%+ of contaminants including lead, PFAS, and nitrates.</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
