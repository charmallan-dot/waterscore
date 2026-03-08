/**
 * Setup Supabase tables and load data
 * Usage: npx tsx scripts/setup-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vkmyhzjcvxscfzlopoqu.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_KEY) {
  console.error('❌ No Supabase key found. Set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const DATA_DIR = path.join(__dirname, '..', 'data', 'processed');

// Test connection first
async function testConnection() {
  console.log('🔌 Testing Supabase connection...');
  console.log(`   URL: ${SUPABASE_URL}`);
  console.log(`   Key: ${SUPABASE_KEY.slice(0, 20)}...`);
  
  // Try a simple query to see if we can connect
  const { data, error } = await supabase.from('water_scores').select('count').limit(1);
  
  if (error) {
    if (error.code === '42P01' || error.message?.includes('does not exist')) {
      console.log('📋 Tables don\'t exist yet — need to create them via SQL Editor');
      return 'needs_tables';
    }
    console.log(`⚠️  Connection response: ${error.message} (code: ${error.code})`);
    return 'error';
  }
  
  console.log('✅ Connected to Supabase!');
  return 'connected';
}

// Load JSON data
function loadJSON(filename: string): any[] {
  const filepath = path.join(DATA_DIR, filename);
  console.log(`📂 Loading ${filename}...`);
  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  console.log(`   ${data.length} rows loaded`);
  return data;
}

// Batch upsert with progress
async function batchUpsert(table: string, data: any[], batchSize = 500) {
  console.log(`\n📤 Uploading to ${table} (${data.length} rows)...`);
  let uploaded = 0;
  let errors = 0;

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const { error } = await supabase.from(table).upsert(batch, { onConflict: 'system_id' });
    
    if (error) {
      // Try insert instead
      const { error: insertError } = await supabase.from(table).insert(batch);
      if (insertError) {
        console.error(`   ❌ Batch ${i}-${i + batch.length}: ${insertError.message}`);
        errors++;
        continue;
      }
    }
    
    uploaded += batch.length;
    if (uploaded % 5000 === 0 || uploaded === data.length) {
      console.log(`   📊 ${uploaded}/${data.length} (${Math.round(uploaded / data.length * 100)}%)`);
    }
  }
  
  console.log(`✅ ${table}: ${uploaded} uploaded, ${errors} batch errors`);
}

// Batch insert (no upsert, for tables without unique constraint on system_id alone)
async function batchInsert(table: string, data: any[], batchSize = 500) {
  console.log(`\n📤 Inserting into ${table} (${data.length} rows)...`);
  let uploaded = 0;
  let errors = 0;

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const { error } = await supabase.from(table).insert(batch);
    
    if (error) {
      console.error(`   ❌ Batch ${i}-${i + batch.length}: ${error.message}`);
      errors++;
      continue;
    }
    
    uploaded += batch.length;
    if (uploaded % 5000 === 0 || uploaded === data.length) {
      console.log(`   📊 ${uploaded}/${data.length} (${Math.round(uploaded / data.length * 100)}%)`);
    }
  }
  
  console.log(`✅ ${table}: ${uploaded} inserted, ${errors} batch errors`);
}

async function main() {
  const status = await testConnection();
  
  if (status === 'needs_tables') {
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 STEP NEEDED: Create tables in Supabase SQL Editor

Go to: https://supabase.com/dashboard/project/vkmyhzjcvxscfzlopoqu/sql/new

Paste and run the SQL from: scripts/create-tables.sql

Then re-run this script.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
    return;
  }

  if (status === 'error') {
    console.log('Attempting to load data anyway...');
  }

  // Load and upload water_scores (main table)
  const scores = loadJSON('water_scores.json');
  await batchUpsert('water_scores', scores);

  // Load and upload violations
  const violations = loadJSON('violations.json');
  await batchInsert('violations', violations);

  // Load and upload contaminants
  const contaminants = loadJSON('contaminants.json');
  await batchInsert('contaminants', contaminants);

  console.log('\n🎉 Data upload complete!');
}

main().catch(console.error);
