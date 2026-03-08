-- WaterScore Database Schema
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vkmyhzjcvxscfzlopoqu/sql/new

-- Main scores table
CREATE TABLE IF NOT EXISTS water_scores (
  system_id TEXT PRIMARY KEY,
  system_name TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT,
  county TEXT,
  zip_codes TEXT[], -- array of zip codes served
  population_served INTEGER DEFAULT 0,
  source_type TEXT,
  overall_score INTEGER NOT NULL,
  grade TEXT NOT NULL,
  violation_score INTEGER DEFAULT 100,
  contaminant_score INTEGER DEFAULT 100,
  source_score INTEGER DEFAULT 80,
  infrastructure_score INTEGER DEFAULT 70,
  size_score INTEGER DEFAULT 70,
  total_violations INTEGER DEFAULT 0,
  health_violations INTEGER DEFAULT 0,
  unresolved_violations INTEGER DEFAULT 0,
  top_concerns TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Violations table
CREATE TABLE IF NOT EXISTS violations (
  id BIGSERIAL PRIMARY KEY,
  system_id TEXT NOT NULL,
  violation_type TEXT,
  contaminant_code TEXT,
  contaminant_name TEXT,
  is_health_based BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT TRUE,
  begin_date TEXT,
  end_date TEXT
);

-- Contaminant samples (lead & copper)
CREATE TABLE IF NOT EXISTS contaminants (
  id BIGSERIAL PRIMARY KEY,
  system_id TEXT NOT NULL,
  contaminant_code TEXT,
  contaminant_name TEXT,
  measured_value NUMERIC,
  unit TEXT,
  mcl NUMERIC,
  exceeds_mcl BOOLEAN DEFAULT FALSE,
  sample_date TEXT,
  health_effects TEXT
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_water_scores_state ON water_scores(state);
CREATE INDEX IF NOT EXISTS idx_water_scores_city ON water_scores(city);
CREATE INDEX IF NOT EXISTS idx_water_scores_grade ON water_scores(grade);
CREATE INDEX IF NOT EXISTS idx_water_scores_score ON water_scores(overall_score);
CREATE INDEX IF NOT EXISTS idx_violations_system ON violations(system_id);
CREATE INDEX IF NOT EXISTS idx_contaminants_system ON contaminants(system_id);

-- Full text search on system name and city
CREATE INDEX IF NOT EXISTS idx_water_scores_search 
  ON water_scores USING gin(to_tsvector('english', system_name || ' ' || COALESCE(city, '') || ' ' || state));

-- Enable Row Level Security (read-only public access)
ALTER TABLE water_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contaminants ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (public data)
CREATE POLICY "Public read access" ON water_scores FOR SELECT USING (true);
CREATE POLICY "Public read access" ON violations FOR SELECT USING (true);
CREATE POLICY "Public read access" ON contaminants FOR SELECT USING (true);

-- Zip code lookup helper (search by any zip in the array)
CREATE OR REPLACE FUNCTION search_by_zip(zip TEXT)
RETURNS SETOF water_scores AS $$
  SELECT * FROM water_scores WHERE zip = ANY(zip_codes) ORDER BY population_served DESC;
$$ LANGUAGE sql STABLE;
