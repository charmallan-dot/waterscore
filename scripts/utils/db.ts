/**
 * Database layer — works with local JSON files OR Supabase.
 * 
 * Set SUPABASE_URL + SUPABASE_SERVICE_KEY for Supabase mode.
 * Otherwise, saves to data/ directory as JSON files.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(__dirname, '../../data/processed');

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

const USE_SUPABASE = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);

let supabase: any = null;

async function getSupabase() {
  if (!supabase && USE_SUPABASE) {
    const { createClient } = await import('@supabase/supabase-js');
    supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }
  return supabase;
}

/**
 * Save data to a table (local JSON or Supabase)
 */
export async function saveToTable(table: string, data: any[]): Promise<void> {
  if (USE_SUPABASE) {
    const db = await getSupabase();
    // Upsert in batches of 500
    for (let i = 0; i < data.length; i += 500) {
      const batch = data.slice(i, i + 500);
      const { error } = await db.from(table).upsert(batch, { onConflict: 'id' });
      if (error) throw new Error(`Supabase error on ${table}: ${error.message}`);
    }
    console.log(`  ✅ Saved ${data.length} rows to Supabase:${table}`);
  } else {
    const filePath = join(DATA_DIR, `${table}.json`);
    writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`  ✅ Saved ${data.length} rows to ${filePath}`);
  }
}

/**
 * Load data from a table (local JSON or Supabase)
 */
export async function loadFromTable<T>(table: string): Promise<T[]> {
  if (USE_SUPABASE) {
    const db = await getSupabase();
    const { data, error } = await db.from(table).select('*');
    if (error) throw new Error(`Supabase error on ${table}: ${error.message}`);
    return data as T[];
  } else {
    const filePath = join(DATA_DIR, `${table}.json`);
    if (!existsSync(filePath)) return [];
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  }
}

/**
 * Get current storage mode
 */
export function getStorageMode(): string {
  return USE_SUPABASE ? `Supabase (${process.env.SUPABASE_URL})` : `Local JSON (${DATA_DIR})`;
}
