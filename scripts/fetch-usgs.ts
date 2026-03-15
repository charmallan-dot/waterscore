#!/usr/bin/env npx tsx
/**
 * Fetch real-time water quality data from USGS Water Services
 *
 * USGS provides real-time monitoring for surface water sites across the US.
 * We pull key parameters (turbidity, pH, dissolved oxygen, conductance, nitrate)
 * and store them for use in scoring.
 *
 * API docs: https://waterservices.usgs.gov/docs/
 * No API key needed. Free. Be polite.
 *
 * Usage: npx tsx scripts/fetch-usgs.ts [--state CA] [--all]
 */

import { saveToTable, getStorageMode } from './utils/db';

const USGS_BASE = 'https://waterservices.usgs.gov/nwis/iv';

// Parameter codes we care about
const PARAM_CODES: Record<string, string> = {
  '00010': 'temperature',    // Water temperature (°C)
  '00300': 'dissolved_oxygen', // Dissolved oxygen (mg/L)
  '00400': 'pH',              // pH
  '00095': 'conductance',     // Specific conductance (µS/cm)
  '63680': 'turbidity',       // Turbidity (FNU)
  '99133': 'nitrate',         // Nitrate + nitrite (mg/L as N)
};

const ALL_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
];

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface USGSReading {
  site_id: string;
  site_name: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  parameter: string;
  parameter_code: string;
  value: number;
  unit: string;
  datetime: string;
}

async function fetchUSGSState(stateCode: string): Promise<USGSReading[]> {
  const paramCodes = Object.keys(PARAM_CODES).join(',');
  const url = `${USGS_BASE}/?format=json&stateCd=${stateCode}&parameterCd=${paramCodes}&siteStatus=active&siteType=ST`;

  console.log(`  Fetching USGS data for ${stateCode}...`);

  const response = await fetch(url);

  if (!response.ok) {
    // USGS may return 404 for states with no active monitoring sites
    if (response.status === 404) {
      console.log(`  No USGS data for ${stateCode}`);
      return [];
    }
    throw new Error(`USGS API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  const timeSeries = json?.value?.timeSeries || [];
  const readings: USGSReading[] = [];

  for (const ts of timeSeries) {
    const siteCode = ts.sourceInfo?.siteCode?.[0]?.value;
    const siteName = ts.sourceInfo?.siteName || '';
    const lat = ts.sourceInfo?.geoLocation?.geogLocation?.latitude || null;
    const lng = ts.sourceInfo?.geoLocation?.geogLocation?.longitude || null;
    const paramCode = ts.variable?.variableCode?.[0]?.value;
    const unit = ts.variable?.unit?.unitCode || '';

    // Get the most recent value
    const values = ts.values?.[0]?.value || [];
    if (values.length === 0) continue;

    const latest = values[values.length - 1];
    const val = parseFloat(latest.value);
    if (isNaN(val) || val < 0) continue; // Skip invalid / no-data markers

    readings.push({
      site_id: siteCode,
      site_name: siteName,
      state: stateCode,
      latitude: lat,
      longitude: lng,
      parameter: PARAM_CODES[paramCode] || paramCode,
      parameter_code: paramCode,
      value: val,
      unit,
      datetime: latest.dateTime,
    });
  }

  console.log(`  Found ${readings.length} readings from ${new Set(readings.map(r => r.site_id)).size} sites in ${stateCode}`);
  return readings;
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
    states = ['CA', 'TX', 'NY', 'FL', 'OH'];
    console.log('ℹ️  No state specified. Fetching CA, TX, NY, FL, OH as demo.');
    console.log('   Use --state CA for one state, or --all for all states.\n');
  }

  console.log(`🌊 WaterScore Data Pipeline — USGS Fetch`);
  console.log(`📦 Storage: ${getStorageMode()}`);
  console.log(`🏛️  States: ${states.join(', ')}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  const allReadings: USGSReading[] = [];

  for (const state of states) {
    try {
      const readings = await fetchUSGSState(state);
      allReadings.push(...readings);
      await sleep(1000); // Be polite
    } catch (error) {
      console.error(`❌ Error fetching ${state}:`, error);
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 Total readings: ${allReadings.length}`);
  console.log(`📍 Unique sites: ${new Set(allReadings.map(r => r.site_id)).size}`);

  await saveToTable('usgs_readings', allReadings);

  console.log(`\n✅ USGS fetch complete!`);
}

main().catch(console.error);
