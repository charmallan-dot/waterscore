#!/usr/bin/env npx tsx
/**
 * Fetch water systems + violations from EPA SDWIS
 * 
 * This is the CORE data source. Every public water system in the US
 * is registered in SDWIS with its violations.
 * 
 * Usage: npx tsx scripts/fetch-sdwis.ts [--state CA] [--all]
 */

import { fetchEPA, fetchAllEPA, type WaterSystem, type Violation, type GeographicArea } from './utils/epa-client';
import { saveToTable, getStorageMode } from './utils/db';

// All US state codes
const ALL_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
];

async function fetchWaterSystems(stateCode: string): Promise<any[]> {
  console.log(`\n📊 Fetching water systems for ${stateCode}...`);
  
  const raw = await fetchAllEPA<WaterSystem>('WATER_SYSTEM', {
    STATE_CODE: stateCode,
    PWS_ACTIVITY_CODE: 'A',    // Active systems only
    PWS_TYPE_CODE: 'CWS'       // Community Water Systems (serve residents year-round)
  });
  
  // Transform to our schema
  const systems = raw.map(ws => ({
    id: ws.pwsid,
    name: ws.pws_name,
    state: ws.state_code,
    population_served: ws.population_served_count || 0,
    source_type: ws.gw_sw_code || ws.primary_source_code || 'Unknown',
    city: ws.city_name,
    zip_code: ws.zip_code,
    is_active: true,
    updated_at: new Date().toISOString()
  }));
  
  console.log(`  Found ${systems.length} active community water systems in ${stateCode}`);
  return systems;
}

async function fetchViolations(stateCode: string): Promise<any[]> {
  console.log(`\n⚠️  Fetching violations for ${stateCode}...`);
  
  const raw = await fetchAllEPA<Violation>('VIOLATION', {
    PRIMACY_AGENCY_CODE: stateCode,
    IS_HEALTH_BASED_IND: 'Y'   // Health-based violations only (most relevant)
  });
  
  // Transform to our schema
  const violations = raw.map(v => ({
    id: `${v.pwsid}-${v.violation_id}`,
    system_id: v.pwsid,
    contaminant_code: v.contaminant_code,
    violation_type: v.violation_category_code,
    is_health_based: v.is_health_based_ind === 'Y',
    is_major: v.is_major_viol_ind === 'Y',
    severity: v.severity_ind_cnt,
    begin_date: v.compl_per_begin_date,
    end_date: v.compl_per_end_date,
    is_resolved: v.compliance_status_code === 'R' || v.compliance_status_code === 'K',
    public_notification_tier: v.public_notification_tier
  }));
  
  console.log(`  Found ${violations.length} health-based violations in ${stateCode}`);
  return violations;
}

async function fetchGeographicAreas(stateCode: string): Promise<any[]> {
  console.log(`\n🗺️  Fetching geographic areas for ${stateCode}...`);
  
  const raw = await fetchAllEPA<GeographicArea>('GEOGRAPHIC_AREA', {
    STATE_SERVED: stateCode
  });
  
  // Transform — map cities to water systems
  const areas = raw
    .filter(g => g.city_served)
    .map(g => ({
      system_id: g.pwsid,
      state: g.state_served,
      city: g.city_served,
      county: g.county_served,
      zip_code: g.zip_code_served
    }));
  
  console.log(`  Found ${areas.length} geographic area mappings in ${stateCode}`);
  return areas;
}

async function main() {
  const args = process.argv.slice(2);
  const stateFlag = args.indexOf('--state');
  const allFlag = args.includes('--all');
  
  let states: string[];
  
  if (stateFlag !== -1 && args[stateFlag + 1]) {
    states = [args[stateFlag + 1].toUpperCase()];
  } else if (allFlag) {
    states = ALL_STATES;
  } else {
    // Default: fetch a few states for testing
    states = ['CA', 'TX', 'NY', 'FL', 'OH'];
    console.log('ℹ️  No state specified. Fetching CA, TX, NY, FL, OH as demo.');
    console.log('   Use --state CA for one state, or --all for all states.\n');
  }
  
  console.log(`🌊 WaterScore Data Pipeline — SDWIS Fetch`);
  console.log(`📦 Storage: ${getStorageMode()}`);
  console.log(`🏛️  States: ${states.join(', ')}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  
  const allSystems: any[] = [];
  const allViolations: any[] = [];
  const allAreas: any[] = [];
  
  for (const state of states) {
    try {
      const systems = await fetchWaterSystems(state);
      allSystems.push(...systems);
      
      const violations = await fetchViolations(state);
      allViolations.push(...violations);
      
      const areas = await fetchGeographicAreas(state);
      allAreas.push(...areas);
    } catch (error) {
      console.error(`❌ Error fetching ${state}:`, error);
    }
  }
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 Total water systems: ${allSystems.length}`);
  console.log(`⚠️  Total violations: ${allViolations.length}`);
  console.log(`🗺️  Total area mappings: ${allAreas.length}`);
  
  // Save
  await saveToTable('water_systems', allSystems);
  await saveToTable('violations', allViolations);
  await saveToTable('geographic_areas', allAreas);
  
  console.log(`\n✅ SDWIS fetch complete!`);
}

main().catch(console.error);
