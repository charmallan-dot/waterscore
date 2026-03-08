/**
 * Load data into Supabase — strips extra fields to match table schema
 */
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const DATA_DIR = path.join(__dirname, '..', 'data', 'processed');

function loadJSON(f: string): any[] {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf-8'));
}

async function batchInsert(table: string, rows: any[], batchSize = 500) {
  console.log(`📤 ${table}: ${rows.length} rows...`);
  let ok = 0, fail = 0;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from(table).insert(batch);
    if (error) {
      // Try upsert for scores
      if (table === 'water_scores') {
        const { error: e2 } = await supabase.from(table).upsert(batch);
        if (e2) { fail++; if (fail <= 3) console.error(`   ❌ ${e2.message}`); continue; }
      } else {
        fail++; if (fail <= 3) console.error(`   ❌ ${error.message}`); continue;
      }
    }
    ok += batch.length;
    if (ok % 10000 === 0) console.log(`   ${ok}/${rows.length}`);
  }
  console.log(`✅ ${table}: ${ok} loaded, ${fail} batch errors`);
}

async function main() {
  // Water scores — map to schema
  const scores = loadJSON('water_scores.json').map((s: any) => ({
    system_id: s.system_id,
    system_name: s.system_name,
    state: s.state,
    city: s.city,
    population_served: s.population_served || 0,
    overall_score: s.overall_score,
    grade: s.grade,
    violation_score: s.violation_score,
    contaminant_score: s.contaminant_score,
    source_score: s.source_score,
    infrastructure_score: s.infrastructure_score,
    size_score: s.size_score,
    total_violations: s.total_violations || 0,
    health_violations: 0,
    unresolved_violations: s.unresolved_violations || 0,
    top_concerns: s.top_concerns || [],
    updated_at: s.updated_at || new Date().toISOString(),
  }));
  await batchInsert('water_scores', scores);

  // Violations — strip extra fields
  const violations = loadJSON('violations.json').map((v: any) => ({
    system_id: v.system_id,
    violation_type: v.violation_type,
    contaminant_code: v.contaminant_code,
    is_health_based: v.is_health_based || false,
    is_resolved: v.is_resolved ?? true,
    begin_date: v.begin_date,
    end_date: v.end_date,
  }));
  await batchInsert('violations', violations);

  // Contaminants — strip extra fields
  const contaminants = loadJSON('contaminants.json').map((c: any) => ({
    system_id: c.system_id,
    contaminant_code: c.contaminant_code,
    contaminant_name: c.contaminant_name,
    measured_value: c.measured_value,
    unit: c.unit,
    mcl: c.mcl,
    exceeds_mcl: c.exceeds_mcl || false,
    health_effects: c.health_effects,
  }));
  await batchInsert('contaminants', contaminants);

  console.log('\n🎉 All data loaded into Supabase!');
}

main().catch(console.error);
