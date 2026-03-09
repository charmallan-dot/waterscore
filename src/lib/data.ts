/**
 * Data access layer — reads from Supabase (production) or local JSON (dev fallback)
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { supabase } from './supabase';

const DATA_DIR = join(process.cwd(), 'data/processed');
const USE_LOCAL = existsSync(join(DATA_DIR, 'water_scores.json'));

function loadJSON<T>(filename: string): T[] {
  const path = join(DATA_DIR, filename);
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, 'utf-8'));
}

export interface WaterScore {
  system_id: string;
  system_name: string;
  state: string;
  city: string;
  zip_code?: string;
  population_served: number;
  overall_score: number;
  grade: string;
  violation_score: number;
  contaminant_score: number;
  source_score: number;
  infrastructure_score: number;
  size_score: number;
  total_violations: number;
  unresolved_violations: number;
  total_contaminant_samples?: number;
  mcl_exceedances?: number;
  health_violations?: number;
  top_concerns: string[];
  updated_at: string;
}

export interface Violation {
  id?: string;
  system_id: string;
  contaminant_code: string;
  contaminant_name?: string;
  violation_type: string;
  is_health_based: boolean;
  is_major?: boolean;
  is_resolved: boolean;
  begin_date: string;
  end_date: string | null;
}

export interface ContaminantSample {
  id?: string;
  system_id: string;
  contaminant_code: string;
  contaminant_name: string;
  measured_value: number;
  unit: string;
  mcl: number | null;
  exceeds_mcl: boolean | null;
  category?: string;
  health_effects: string;
  sample_date?: string;
}

// ---- Cached local data ----
let scoresCache: WaterScore[] | null = null;

function getLocalScores(): WaterScore[] {
  if (!scoresCache) scoresCache = loadJSON<WaterScore>('water_scores.json');
  return scoresCache;
}

// ---- Supabase helpers ----

async function fetchAllScores(): Promise<WaterScore[]> {
  if (USE_LOCAL) return getLocalScores();
  
  // Supabase limits to 1000 rows by default, fetch all with pagination
  const all: WaterScore[] = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('water_scores')
      .select('*')
      .range(from, from + pageSize - 1);
    if (error || !data || data.length === 0) break;
    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

// ---- Exported functions (all async now for Supabase) ----

export async function getScoreBySystemId(systemId: string): Promise<WaterScore | undefined> {
  if (USE_LOCAL) return getLocalScores().find(s => s.system_id === systemId);
  
  const { data } = await supabase
    .from('water_scores')
    .select('*')
    .eq('system_id', systemId)
    .single();
  return data || undefined;
}

export async function searchSystems(query: string, limit = 20): Promise<WaterScore[]> {
  if (USE_LOCAL) {
    const q = query.toLowerCase().trim();
    return getLocalScores()
      .filter(s =>
        s.system_name.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q) ||
        s.zip_code?.includes(q) ||
        s.state.toLowerCase() === q
      )
      .slice(0, limit);
  }

  // Try state match first
  if (query.trim().length === 2) {
    const { data } = await supabase
      .from('water_scores')
      .select('*')
      .eq('state', query.trim().toUpperCase())
      .order('population_served', { ascending: false })
      .limit(limit);
    if (data && data.length > 0) return data;
  }

  // Text search
  const { data } = await supabase
    .from('water_scores')
    .select('*')
    .or(`system_name.ilike.%${query}%,city.ilike.%${query}%`)
    .order('population_served', { ascending: false })
    .limit(limit);
  return data || [];
}

export async function getWorstSystems(limit = 20): Promise<WaterScore[]> {
  if (USE_LOCAL) return [...getLocalScores()].sort((a, b) => a.overall_score - b.overall_score).slice(0, limit);
  
  const { data } = await supabase
    .from('water_scores')
    .select('*')
    .order('overall_score', { ascending: true })
    .limit(limit);
  return data || [];
}

export async function getBestSystems(limit = 20): Promise<WaterScore[]> {
  if (USE_LOCAL) return [...getLocalScores()].sort((a, b) => b.overall_score - a.overall_score).slice(0, limit);

  const { data } = await supabase
    .from('water_scores')
    .select('*')
    .order('overall_score', { ascending: false })
    .limit(limit);
  return data || [];
}

export async function getViolationsForSystem(systemId: string): Promise<Violation[]> {
  if (USE_LOCAL) return loadJSON<Violation>('violations.json').filter(v => v.system_id === systemId);

  const { data } = await supabase
    .from('violations')
    .select('*')
    .eq('system_id', systemId);
  return data || [];
}

export async function getContaminantsForSystem(systemId: string): Promise<ContaminantSample[]> {
  if (USE_LOCAL) return loadJSON<ContaminantSample>('contaminants.json').filter(c => c.system_id === systemId);

  const { data } = await supabase
    .from('contaminants')
    .select('*')
    .eq('system_id', systemId);
  return data || [];
}

export async function getAllScores(): Promise<WaterScore[]> {
  return fetchAllScores();
}

export async function getGradeDistribution(): Promise<Record<string, number>> {
  const scores = await fetchAllScores();
  const dist: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  for (const s of scores) dist[s.grade] = (dist[s.grade] || 0) + 1;
  return dist;
}

export async function getTotalStats() {
  const scores = await fetchAllScores();
  const states = new Set(scores.map(s => s.state));
  return {
    totalSystems: scores.length,
    totalPopulation: scores.reduce((sum, s) => sum + (s.population_served || 0), 0),
    avgScore: scores.length ? Math.round(scores.reduce((sum, s) => sum + s.overall_score, 0) / scores.length) : 0,
    gradeDistribution: (() => {
      const d: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
      for (const s of scores) d[s.grade] = (d[s.grade] || 0) + 1;
      return d;
    })(),
    states: states.size,
  };
}
