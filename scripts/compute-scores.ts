#!/usr/bin/env npx tsx
/**
 * Compute water quality scores for each water system.
 * 
 * Score = weighted average of:
 *   - Violation history (40%) — fewer/older violations = higher
 *   - Contaminant levels (30%) — below MCL = good, above = bad
 *   - Source type (10%) — groundwater > surface water
 *   - Infrastructure age proxy (10%) — fewer violations over time = newer/better
 *   - System size (10%) — larger systems have more resources/oversight
 * 
 * Usage: npx tsx scripts/compute-scores.ts
 */

import { loadFromTable, saveToTable, getStorageMode } from './utils/db';

interface WaterSystem {
  id: string;
  name: string;
  state: string;
  city: string;
  zip_code: string;
  population_served: number;
  source_type: string;
}

interface ViolationRecord {
  id: string;
  system_id: string;
  is_health_based: boolean;
  is_major: boolean;
  is_resolved: boolean;
  begin_date: string;
  end_date: string | null;
  severity: number | null;
  contaminant_code: string;
}

interface ContaminantSample {
  id: string;
  system_id: string;
  contaminant_code: string;
  contaminant_name: string;
  measured_value: number;
  mcl: number | null;
  exceeds_mcl: boolean | null;
  category: string;
}

function scoreGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function computeViolationScore(violations: ViolationRecord[]): number {
  if (violations.length === 0) return 100;
  
  let penalty = 0;
  const now = Date.now();
  
  for (const v of violations) {
    const beginDate = new Date(v.begin_date).getTime();
    const yearsAgo = (now - beginDate) / (365.25 * 24 * 60 * 60 * 1000);
    
    // Recent violations penalize more
    const recencyFactor = Math.max(0, 1 - (yearsAgo / 10)); // Fades over 10 years
    
    let basePenalty = 5; // Base penalty per violation
    if (v.is_health_based) basePenalty = 15;
    if (v.is_major) basePenalty = 25;
    if (!v.is_resolved) basePenalty *= 1.5; // Unresolved = worse
    
    penalty += basePenalty * recencyFactor;
  }
  
  return Math.max(0, Math.min(100, 100 - penalty));
}

function computeContaminantScore(samples: ContaminantSample[]): number {
  if (samples.length === 0) return 85; // No data = assume OK-ish
  
  let penalty = 0;
  const exceedances = samples.filter(s => s.exceeds_mcl === true);
  
  // Penalty for each MCL exceedance
  for (const s of exceedances) {
    if (s.mcl && s.mcl > 0) {
      const ratio = s.measured_value / s.mcl;
      penalty += Math.min(30, ratio * 10); // Cap at 30 per contaminant
    } else {
      penalty += 15;
    }
  }
  
  // Slight penalty for contaminants near MCL (>80% of limit)
  const nearLimit = samples.filter(s => 
    s.mcl && s.measured_value > s.mcl * 0.8 && s.exceeds_mcl !== true
  );
  penalty += nearLimit.length * 3;
  
  return Math.max(0, Math.min(100, 100 - penalty));
}

function computeSourceScore(sourceType: string): number {
  // Groundwater is generally cleaner than surface water
  switch (sourceType?.toUpperCase()) {
    case 'GW': return 90;  // Groundwater
    case 'GU': return 85;  // Groundwater under influence
    case 'SW': return 75;  // Surface water
    case 'SWP': return 80; // Purchased surface water
    case 'GWP': return 88; // Purchased groundwater
    default: return 80;
  }
}

function computeSizeScore(population: number): number {
  // Larger systems have more resources, better monitoring
  if (population >= 100000) return 90;
  if (population >= 10000) return 85;
  if (population >= 3300) return 80;
  if (population >= 500) return 70;
  return 60; // Very small systems
}

async function main() {
  console.log(`🧮 WaterScore — Computing Scores`);
  console.log(`📦 Storage: ${getStorageMode()}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  
  // Load data
  const systems = await loadFromTable<WaterSystem>('water_systems');
  const violations = await loadFromTable<ViolationRecord>('violations');
  const contaminants = await loadFromTable<ContaminantSample>('contaminants');
  
  console.log(`\n📊 Data loaded:`);
  console.log(`   Water systems: ${systems.length}`);
  console.log(`   Violations: ${violations.length}`);
  console.log(`   Contaminant samples: ${contaminants.length}`);
  
  if (systems.length === 0) {
    console.error('❌ No water systems found. Run fetch-sdwis.ts first.');
    process.exit(1);
  }
  
  // Group violations and contaminants by system
  const violationsBySystem = new Map<string, ViolationRecord[]>();
  for (const v of violations) {
    if (!violationsBySystem.has(v.system_id)) violationsBySystem.set(v.system_id, []);
    violationsBySystem.get(v.system_id)!.push(v);
  }
  
  const contaminantsBySystem = new Map<string, ContaminantSample[]>();
  for (const c of contaminants) {
    if (!contaminantsBySystem.has(c.system_id)) contaminantsBySystem.set(c.system_id, []);
    contaminantsBySystem.get(c.system_id)!.push(c);
  }
  
  // Compute scores
  const scores: any[] = [];
  let gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  
  for (const system of systems) {
    const sysViolations = violationsBySystem.get(system.id) || [];
    const sysSamples = contaminantsBySystem.get(system.id) || [];
    
    const violationScore = computeViolationScore(sysViolations);
    const contaminantScore = computeContaminantScore(sysSamples);
    const sourceScore = computeSourceScore(system.source_type);
    const sizeScore = computeSizeScore(system.population_served);
    const infrastructureScore = Math.round((violationScore + sizeScore) / 2); // Proxy
    
    // Weighted average
    const overall = Math.round(
      violationScore * 0.40 +
      contaminantScore * 0.30 +
      sourceScore * 0.10 +
      infrastructureScore * 0.10 +
      sizeScore * 0.10
    );
    
    const grade = scoreGrade(overall);
    gradeDistribution[grade as keyof typeof gradeDistribution]++;
    
    // Determine top concerns
    const concerns: string[] = [];
    const exceedances = sysSamples.filter(s => s.exceeds_mcl === true);
    if (exceedances.length > 0) {
      concerns.push(...exceedances.map(e => `${e.contaminant_name} above EPA limit`).slice(0, 3));
    }
    const unresolvedViolations = sysViolations.filter(v => !v.is_resolved);
    if (unresolvedViolations.length > 0) {
      concerns.push(`${unresolvedViolations.length} unresolved violation(s)`);
    }
    if (system.source_type === 'SW') {
      concerns.push('Surface water source (more treatment needed)');
    }
    
    scores.push({
      system_id: system.id,
      system_name: system.name,
      state: system.state,
      city: system.city,
      zip_code: system.zip_code,
      population_served: system.population_served,
      overall_score: overall,
      grade,
      violation_score: Math.round(violationScore),
      contaminant_score: Math.round(contaminantScore),
      source_score: Math.round(sourceScore),
      infrastructure_score: Math.round(infrastructureScore),
      size_score: Math.round(sizeScore),
      total_violations: sysViolations.length,
      unresolved_violations: unresolvedViolations?.length || 0,
      total_contaminant_samples: sysSamples.length,
      mcl_exceedances: exceedances?.length || 0,
      top_concerns: concerns.slice(0, 5),
      updated_at: new Date().toISOString()
    });
  }
  
  // Sort by score (worst first for debugging)
  scores.sort((a, b) => a.overall_score - b.overall_score);
  
  console.log(`\n📊 Grade Distribution:`);
  console.log(`   A (90-100): ${gradeDistribution.A} systems`);
  console.log(`   B (80-89):  ${gradeDistribution.B} systems`);
  console.log(`   C (70-79):  ${gradeDistribution.C} systems`);
  console.log(`   D (60-69):  ${gradeDistribution.D} systems`);
  console.log(`   F (<60):    ${gradeDistribution.F} systems`);
  
  console.log(`\n🔴 Worst 5 Systems:`);
  for (const s of scores.slice(0, 5)) {
    console.log(`   ${s.grade} (${s.overall_score}) — ${s.system_name}, ${s.state} — ${s.top_concerns[0] || 'Multiple issues'}`);
  }
  
  console.log(`\n🟢 Best 5 Systems:`);
  for (const s of scores.slice(-5).reverse()) {
    console.log(`   ${s.grade} (${s.overall_score}) — ${s.system_name}, ${s.state}`);
  }
  
  await saveToTable('water_scores', scores);
  console.log(`\n✅ Scores computed for ${scores.length} water systems!`);
}

main().catch(console.error);
