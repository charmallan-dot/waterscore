#!/usr/bin/env npx tsx
/**
 * Fetch lead & copper sample results from EPA SDWIS
 * 
 * This gives us ACTUAL measured contaminant levels per water system,
 * which is the most valuable data for scoring.
 * 
 * Usage: npx tsx scripts/fetch-contaminants.ts [--state CA]
 */

import { fetchAllEPA, type LCRSample } from './utils/epa-client';
import { saveToTable, loadFromTable, getStorageMode } from './utils/db';
import { getContaminantInfo, exceedsMCL } from './utils/contaminants';

async function fetchLeadCopper(stateCode: string): Promise<any[]> {
  console.log(`\n🔬 Fetching lead & copper samples for ${stateCode}...`);
  
  const raw = await fetchAllEPA<LCRSample>('LCR_SAMPLE_RESULT', {
    PRIMACY_AGENCY_CODE: stateCode
  });
  
  const samples = raw.map(s => {
    const info = getContaminantInfo(s.contaminant_code);
    const exceeds = exceedsMCL(s.contaminant_code, s.sample_measure);
    
    return {
      id: `${s.pwsid}-${s.sample_id}-${s.contaminant_code}`,
      system_id: s.pwsid,
      contaminant_code: s.contaminant_code,
      contaminant_name: info?.name || s.contaminant_code,
      measured_value: s.sample_measure,
      unit: s.unit_of_measure || info?.unit || 'mg/L',
      mcl: info?.mcl || null,
      exceeds_mcl: exceeds,
      category: info?.category || 'Unknown',
      health_effects: info?.healthEffects || ''
    };
  });
  
  const exceedCount = samples.filter(s => s.exceeds_mcl === true).length;
  console.log(`  Found ${samples.length} samples, ${exceedCount} exceeding MCL`);
  
  return samples;
}

async function main() {
  const args = process.argv.slice(2);
  const stateFlag = args.indexOf('--state');
  
  let states: string[];
  if (stateFlag !== -1 && args[stateFlag + 1]) {
    states = [args[stateFlag + 1].toUpperCase()];
  } else {
    states = ['CA', 'TX', 'NY', 'FL', 'OH'];
    console.log('ℹ️  Fetching CA, TX, NY, FL, OH. Use --state XX for specific state.\n');
  }
  
  console.log(`🔬 WaterScore Data Pipeline — Contaminant Samples`);
  console.log(`📦 Storage: ${getStorageMode()}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  
  const allSamples: any[] = [];
  
  for (const state of states) {
    try {
      const samples = await fetchLeadCopper(state);
      allSamples.push(...samples);
    } catch (error) {
      console.error(`❌ Error fetching ${state}:`, error);
    }
  }
  
  console.log(`\n📊 Total contaminant samples: ${allSamples.length}`);
  await saveToTable('contaminants', allSamples);
  console.log(`\n✅ Contaminant fetch complete!`);
}

main().catch(console.error);
