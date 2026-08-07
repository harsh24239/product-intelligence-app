export const STANDARDS_KB = {
  ipRatings: {
    'IP20': 'Protected against solid objects > 12.5mm, no protection against liquids.',
    'IP44': 'Protected against solid objects > 1mm, splashed water from all directions.',
    'IP54': 'Dust-protected, splashed water from all directions.',
    'IP55': 'Dust-protected, water jets from all directions.',
    'IP65': 'Dust-tight, water jets from all directions.',
    'IP66': 'Dust-tight, powerful water jets.',
    'IP67': 'Dust-tight, temporary immersion in water.',
    'IP68': 'Dust-tight, continuous immersion in water.'
  },
  insulationClasses: {
    'A': 'Max 105°C operating temperature',
    'E': 'Max 120°C operating temperature',
    'B': 'Max 130°C operating temperature',
    'F': 'Max 155°C operating temperature',
    'H': 'Max 180°C operating temperature',
    'C': 'Max 220°C operating temperature'
  },
  motorEfficiencyClasses: {
    'IE1': 'Standard Efficiency',
    'IE2': 'High Efficiency',
    'IE3': 'Premium Efficiency',
    'IE4': 'Super Premium Efficiency',
    'IE5': 'Ultra Premium Efficiency'
  },
  certifications: {
    'CE': 'Conformité Européenne',
    'UL': 'Underwriters Laboratories',
    'ATEX': 'Appareils destinés à être utilisés en ATmosphères EXplosibles',
    'IEC 60034': 'International standard for rotating electrical machines'
  },
  powerConversions: {
    'kW to HP': 'Multiply by 1.341',
    'HP to kW': 'Multiply by 0.7457'
  },
  mountingCodes: {
    'B3': 'Foot mounted',
    'B5': 'Flange mounted (large flange)',
    'B14': 'Face mounted (small flange)',
    'B34': 'Foot and face mounted',
    'B35': 'Foot and flange mounted'
  },
  materialCodes: {
    'SS316': 'Stainless Steel 316',
    'EN-GJL-250': 'Cast Iron',
    'AlSi12': 'Aluminum Alloy'
  },
  temperatureRanges: {
    'Standard': '-20 to 40C',
    'Cold': '-40 to 40C',
    'Hot': '-20 to 60C'
  },
  anomalyRules: [
    { field: 'speed', condition: "(val) => { const rpm = parseInt(val); return rpm && rpm > 7200; }", severity: 'high', message: 'RPM > 7200: Unusually high RPM for standard induction motor' },
    { field: 'voltage', condition: "(val) => { const v = parseInt(val); const standard = [110,230,400,480,690,1000]; return v && !standard.includes(v); }", severity: 'medium', message: 'Voltage listed in non-standard value' },
    { field: 'power', condition: "(val) => { const p = parseFloat(val); return p && p < 0.1 && val.toLowerCase().includes('kw'); }", severity: 'low', message: 'Power listed in wrong units (e.g. value seems to be in watts but labeled kW)' },
    { field: 'pressure', condition: "(val) => { const p = parseFloat(val); return p && p > 400 && val.toLowerCase().includes('bar') && !!val; }", severity: 'high', message: 'Pressure > 400 bar is unusually high' }
  ]
};

export function inferMissingSpecs(product) {
  const inferred = [];
  const text = (product.rawInput || '').toUpperCase();
  
  // Infer IP rating
  if (!product.specs.ipRating) {
    const match = text.match(/IP[0-6][0-9]/);
    if (match) {
      inferred.push({ key: 'ipRating', value: match[0], confidence: 90, enrichedBy: 'rag_enrichment', source: 'Standards KB', sourceQuote: match[0] });
    }
  }

  // Infer Efficiency
  if (!product.specs.efficiency) {
    const match = text.match(/IE[1-5]/);
    if (match) {
      inferred.push({ key: 'efficiency', value: match[0], confidence: 95, enrichedBy: 'rag_enrichment', source: 'Standards KB', sourceQuote: match[0] });
    }
  }

  return inferred;
}

export function validateAndFlagAnomalies(product) {
  const anomalies = [];
  
  for (const rule of STANDARDS_KB.anomalyRules) {
    const val = product.specs[rule.field];
    if (val) {
      try {
        const check = eval(rule.condition);
        if (check(val)) {
          anomalies.push({ field: rule.field, issue: rule.message, severity: rule.severity, resolved: false });
        }
      } catch(e) {}
    }
  }

  // Special rules
  if (product.certifications?.includes('ATEX') && !product.specs.ipRating) {
     anomalies.push({ field: 'ipRating', issue: 'Missing IP rating for products claiming ATEX certification', severity: 'high', resolved: false });
  }

  if (product.specs.dimensions) {
    const dims = product.specs.dimensions.toLowerCase().split('x').map(d => parseFloat(d));
    if (dims.some(d => d > 5000)) {
       anomalies.push({ field: 'dimensions', issue: 'Dimensions where any axis > 5000mm (likely OCR error)', severity: 'high', resolved: false });
    }
  }

  return anomalies;
}

export function normalizeUnits(value, fromUnit, toUnit) {
  if (!value) return null;
  const num = parseFloat(value);
  if (isNaN(num)) return { normalized: value, original: value };

  let normalizedNum = num;
  if (fromUnit === 'HP' && toUnit === 'kW') {
    normalizedNum = num * 0.7457;
  } else if (fromUnit === 'kW' && toUnit === 'HP') {
    normalizedNum = num * 1.341;
  } else if (fromUnit === 'bar' && toUnit === 'psi') {
    normalizedNum = num * 14.5038;
  } else if (fromUnit === 'psi' && toUnit === 'bar') {
    normalizedNum = num / 14.5038;
  }

  return { normalized: `${normalizedNum.toFixed(2)}${toUnit}`, original: `${value}${fromUnit}` };
}
