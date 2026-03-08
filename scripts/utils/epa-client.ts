/**
 * EPA Envirofacts API Client
 * Base URL: https://data.epa.gov/efservice/
 * No API key needed. Free. Be polite (1 req/sec).
 */

const BASE_URL = 'https://data.epa.gov/efservice';
const DELAY_MS = 1000; // 1 second between requests

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchEPA<T>(
  table: string,
  filters: Record<string, string> = {},
  rows?: { start: number; end: number }
): Promise<T[]> {
  // Build URL: /TABLE/COLUMN/VALUE/COLUMN/VALUE/rows/START:END/JSON
  let url = `${BASE_URL}/${table}`;
  
  for (const [key, value] of Object.entries(filters)) {
    url += `/${key}/${encodeURIComponent(value)}`;
  }
  
  if (rows) {
    url += `/rows/${rows.start}:${rows.end}`;
  }
  
  url += '/JSON';
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`EPA API error: ${response.status} ${response.statusText} — ${url}`);
  }
  
  const data = await response.json();
  await sleep(DELAY_MS);
  
  return data as T[];
}

/**
 * Fetch all rows from a table, paginating automatically.
 * EPA returns max 10,000 rows per request.
 */
export async function fetchAllEPA<T>(
  table: string,
  filters: Record<string, string> = {},
  pageSize: number = 5000
): Promise<T[]> {
  const allRows: T[] = [];
  let start = 0;
  
  while (true) {
    const end = start + pageSize;
    console.log(`  Fetching ${table} rows ${start}-${end}...`);
    
    const rows = await fetchEPA<T>(table, filters, { start, end });
    
    if (rows.length === 0) break;
    
    allRows.push(...rows);
    start = end;
    
    // Safety: if we got fewer rows than page size, we're done
    if (rows.length < pageSize) break;
  }
  
  console.log(`  Total ${table} rows: ${allRows.length}`);
  return allRows;
}

// Type definitions for EPA data
export interface WaterSystem {
  pwsid: string;
  pws_name: string;
  pws_activity_code: string;
  pws_type_code: string;
  gw_sw_code: string;
  population_served_count: number;
  primary_source_code: string;
  city_name: string;
  state_code: string;
  zip_code: string;
  address_line1: string;
}

export interface Violation {
  pwsid: string;
  violation_id: string;
  violation_code: string;
  violation_category_code: string;
  is_health_based_ind: string;
  contaminant_code: string;
  compliance_status_code: string;
  compl_per_begin_date: string;
  compl_per_end_date: string | null;
  public_notification_tier: number;
  rule_code: string;
  severity_ind_cnt: number | null;
  is_major_viol_ind: string | null;
}

export interface LCRSample {
  pwsid: string;
  sample_id: string;
  contaminant_code: string;
  sample_measure: number;
  unit_of_measure: string;
}

export interface GeographicArea {
  pwsid: string;
  state_served: string;
  zip_code_served: string | null;
  city_served: string;
  county_served: string;
  area_type_code: string;
}
