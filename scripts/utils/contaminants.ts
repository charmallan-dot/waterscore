/**
 * Contaminant reference data — EPA MCLs (Maximum Contaminant Levels)
 * These are the legal limits for contaminants in drinking water.
 */

export interface ContaminantInfo {
  code: string;
  name: string;
  mcl: number | null;       // Maximum Contaminant Level (legal limit)
  mclg: number | null;      // MCL Goal (health-based goal)
  unit: string;
  category: string;
  healthEffects: string;
}

// Key contaminants with their EPA limits
export const CONTAMINANT_DB: Record<string, ContaminantInfo> = {
  'PB90': {
    code: 'PB90', name: 'Lead (90th percentile)',
    mcl: 0.015, mclg: 0, unit: 'mg/L',
    category: 'Metal',
    healthEffects: 'Brain damage in children, kidney damage, high blood pressure'
  },
  'CU90': {
    code: 'CU90', name: 'Copper (90th percentile)',
    mcl: 1.3, mclg: 1.3, unit: 'mg/L',
    category: 'Metal',
    healthEffects: 'Stomach/intestinal distress, liver/kidney damage'
  },
  '1005': {
    code: '1005', name: 'Barium',
    mcl: 2.0, mclg: 2.0, unit: 'mg/L',
    category: 'Metal',
    healthEffects: 'Increased blood pressure'
  },
  '1010': {
    code: '1010', name: 'Cadmium',
    mcl: 0.005, mclg: 0.005, unit: 'mg/L',
    category: 'Metal',
    healthEffects: 'Kidney damage'
  },
  '1015': {
    code: '1015', name: 'Chromium',
    mcl: 0.1, mclg: 0.1, unit: 'mg/L',
    category: 'Metal',
    healthEffects: 'Skin damage, increased cancer risk'
  },
  '1020': {
    code: '1020', name: 'Fluoride',
    mcl: 4.0, mclg: 4.0, unit: 'mg/L',
    category: 'Chemical',
    healthEffects: 'Bone disease, mottled teeth in children'
  },
  '1024': {
    code: '1024', name: 'Mercury',
    mcl: 0.002, mclg: 0.002, unit: 'mg/L',
    category: 'Metal',
    healthEffects: 'Kidney damage, nervous system effects'
  },
  '1040': {
    code: '1040', name: 'Nitrate',
    mcl: 10.0, mclg: 10.0, unit: 'mg/L',
    category: 'Chemical',
    healthEffects: 'Blue baby syndrome in infants'
  },
  '1041': {
    code: '1041', name: 'Nitrite',
    mcl: 1.0, mclg: 1.0, unit: 'mg/L',
    category: 'Chemical',
    healthEffects: 'Blue baby syndrome in infants'
  },
  '1045': {
    code: '1045', name: 'Selenium',
    mcl: 0.05, mclg: 0.05, unit: 'mg/L',
    category: 'Metal',
    healthEffects: 'Hair/fingernail loss, numbness, circulation problems'
  },
  '1074': {
    code: '1074', name: 'Arsenic',
    mcl: 0.01, mclg: 0, unit: 'mg/L',
    category: 'Metal',
    healthEffects: 'Skin damage, cancer, circulatory problems'
  },
  '2050': {
    code: '2050', name: 'Atrazine',
    mcl: 0.003, mclg: 0.003, unit: 'mg/L',
    category: 'Pesticide',
    healthEffects: 'Cardiovascular/reproductive problems'
  },
  '2456': {
    code: '2456', name: 'Total Trihalomethanes (TTHM)',
    mcl: 0.08, mclg: null, unit: 'mg/L',
    category: 'Disinfection Byproduct',
    healthEffects: 'Liver/kidney/nervous system problems, increased cancer risk'
  },
  '2950': {
    code: '2950', name: 'Haloacetic Acids (HAA5)',
    mcl: 0.06, mclg: null, unit: 'mg/L',
    category: 'Disinfection Byproduct',
    healthEffects: 'Increased cancer risk'
  },
  // PFAS (new EPA standards 2024)
  'PFOA': {
    code: 'PFOA', name: 'PFOA (Forever Chemical)',
    mcl: 0.000004, mclg: 0, unit: 'mg/L',
    category: 'PFAS',
    healthEffects: 'Cancer, thyroid disease, immune system effects, reproductive issues'
  },
  'PFOS': {
    code: 'PFOS', name: 'PFOS (Forever Chemical)',
    mcl: 0.000004, mclg: 0, unit: 'mg/L',
    category: 'PFAS',
    healthEffects: 'Cancer, thyroid disease, immune system effects, reproductive issues'
  },
};

/**
 * Look up contaminant info by code
 */
export function getContaminantInfo(code: string): ContaminantInfo | undefined {
  return CONTAMINANT_DB[code];
}

/**
 * Check if a sample measurement exceeds the MCL
 */
export function exceedsMCL(code: string, value: number): boolean | null {
  const info = CONTAMINANT_DB[code];
  if (!info || info.mcl === null) return null;
  return value > info.mcl;
}
