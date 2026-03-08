---
name: data-pipeline
description: Fetch, process, and store data from government APIs (EPA, USGS, Census, FDA, etc). Use for WaterScore data pipeline, bulk data fetching, ETL jobs, data cleaning and normalization.
---

# Data Pipeline (Government APIs)

Fetch and process free government data. Core skill for WaterScore and similar projects.

## Key APIs (No Key Needed)

### EPA SDWIS (Water Systems)
```bash
# Fetch water systems by state
curl -s "https://data.epa.gov/efservice/WATER_SYSTEM/STATE_CODE/CA/JSON" | python3 -m json.tool | head -50

# Fetch violations
curl -s "https://data.epa.gov/efservice/VIOLATION/PWSID/CA0101001/JSON"

# Paginate (1000 rows at a time)
curl -s "https://data.epa.gov/efservice/WATER_SYSTEM/rows/0:1000/JSON"
curl -s "https://data.epa.gov/efservice/WATER_SYSTEM/rows/1000:2000/JSON"
```

### USGS Water Data
```bash
# Real-time water quality for a state
curl -s "https://waterservices.usgs.gov/nwis/iv/?stateCd=CA&parameterCd=00010,00400&format=json&period=P1D"
```

### Census (Free Key — get at census.gov)
```bash
curl -s "https://api.census.gov/data/2021/acs/acs5?get=B01003_001E&for=zip+code+tabulation+area:*&key=YOUR_KEY"
```

## Data Processing Pattern

```python
import requests, json

# 1. Fetch
response = requests.get("https://data.epa.gov/efservice/VIOLATION/STATE_CODE/CA/JSON")
data = response.json()

# 2. Clean
cleaned = [{
    "system_id": row["PWSID"],
    "contaminant": row["CONTAMINANT_CODE"],
    "violation_type": row["VIOLATION_TYPE_CODE"],
    "begin_date": row["COMPL_PER_BEGIN_DATE"],
} for row in data if row.get("PWSID")]

# 3. Store (Supabase)
from supabase import create_client
supabase = create_client(url, key)
supabase.table("violations").upsert(cleaned).execute()
```

## Rate Limits
- EPA: No official limit. Be polite: 1 req/sec
- USGS: No key needed. Reasonable use.
- Census: 500 req/day with free key
- FEMA: No key. Reasonable use.
