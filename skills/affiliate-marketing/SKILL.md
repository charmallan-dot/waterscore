---
name: affiliate-marketing
description: Manage affiliate links and product recommendations. Use for water filter recommendations, product comparison content, and monetization of WaterScore pages.
---

# Affiliate Marketing

Recommend products and earn commissions. Core monetization for WaterScore.

## Water Filter Affiliate Programs

| Program | Commission | Cookie | Sign Up |
|---------|-----------|--------|---------|
| Amazon Associates | 1-4% | 24hr | affiliate-program.amazon.com |
| AquaTru | $30-50 per sale | 30 days | aquatru.com/affiliates |
| Berkey | 10% | 30 days | berkeyfilters.com/affiliates |
| iSpring | 5-8% | — | Amazon Associates |
| Clearly Filtered | 15% | 30 days | clearlyfiltered.com/affiliates |
| Pelican Water | Varies | — | pelicanglobal.com |

## Recommendation Logic

Match filter type to detected contaminants:

```python
FILTER_RECS = {
    "lead": {
        "type": "Reverse Osmosis",
        "products": ["AquaTru Countertop RO", "iSpring RCC7AK"],
        "why": "RO removes 99%+ of lead"
    },
    "pfas": {
        "type": "Activated Carbon + RO",
        "products": ["Clearly Filtered Pitcher", "AquaTru"],
        "why": "Multi-stage filtration needed for PFAS"
    },
    "chlorine": {
        "type": "Carbon Filter",
        "products": ["Brita Pitcher", "PUR Faucet Mount"],
        "why": "Basic carbon filters effectively remove chlorine"
    },
    "nitrates": {
        "type": "Reverse Osmosis",
        "products": ["iSpring RCC7", "APEC Water Systems"],
        "why": "Only RO reliably removes nitrates"
    },
    "bacteria": {
        "type": "UV + Filter",
        "products": ["SteriPen", "Viqua UV System"],
        "why": "UV treatment kills bacteria and viruses"
    }
}
```

## Disclosure Requirements

Always include on pages with affiliate links:
```
"WaterScore may earn a commission from purchases made through links on this page. 
This doesn't affect our recommendations — we only suggest filters proven to remove 
your specific contaminants."
```

## Tips
- Amazon is easiest to start (sign up, get links immediately)
- Specialty affiliates (AquaTru, Berkey) pay WAY more per sale
- Always recommend based on ACTUAL contaminants — builds trust
- Disclosure is legally required (FTC guidelines)
