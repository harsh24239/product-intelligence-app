export function parseRawText(rawText) {
  const extracted = {};
  let remainingText = rawText;

  const patterns = {
    power: /(\d+(?:\.\d+)?)\s*(kW|HP|W)/i,
    voltage: /(\d{3,4})\s*(V|kV)/i,
    current: /(\d+(?:\.\d+)?)\s*(A|mA)/i,
    frequency: /(\d{2,3})\s*(Hz)/i,
    speed: /(\d{3,5})\s*(RPM|rpm)/i,
    torque: /(\d+(?:\.\d+)?)\s*(Nm|kNm)/i,
    ipRating: /(IP[0-6][0-9])/i,
    temperature: /(-?\d+)\s*to\s*(-?\d+)\s*(C|F)/i,
    pressure: /(\d+(?:\.\d+)?)\s*(bar|PSI|MPa)/i,
    weight: /(\d+(?:\.\d+)?)\s*(kg|lbs)/i,
    dimensions: /(\d+(?:\.\d+)?)\s*[xX]\s*(\d+(?:\.\d+)?)\s*[xX]\s*(\d+(?:\.\d+)?)\s*(mm|cm|m)/i
  };

  for (const [key, regex] of Object.entries(patterns)) {
    const match = rawText.match(regex);
    if (match) {
      extracted[key] = {
        value: match[0],
        rawMatch: match[0],
        confidence: 85 // Mock confidence
      };
      remainingText = remainingText.replace(match[0], '');
    }
  }

  return { extracted, remainingText };
}

export function parseCSVRow(csvRow) {
  // Simple proxy since it uses same logic if values are combined
  const rowStr = Object.values(csvRow).join(' ');
  return parseRawText(rowStr);
}

export function preprocessText(rawText) {
  if (!rawText) return '';
  let cleaned = rawText.replace(/\s+/g, ' ').trim();
  
  // common OCR fixes
  cleaned = cleaned.replace(/(\d)l/g, '$11').replace(/(\d)O/g, '$10');
  
  // expand abbrevs
  cleaned = cleaned.replace(/\beff\./gi, 'efficiency').replace(/\bmax\./gi, 'maximum');
  
  return cleaned;
}

export function detectDocumentType(content) {
  const text = content.toLowerCase();
  
  if (text.includes('motor') || text.includes('rpm') || text.includes('ie3') || text.includes('ie4')) {
    return { type: 'Electric Motors', confidence: 0.9, indicators: ['motor', 'rpm', 'ie'] };
  } else if (text.includes('valve') || text.includes('bar') || text.includes('flow') || text.includes('hydraulic')) {
    return { type: 'Hydraulic Valves', confidence: 0.85, indicators: ['valve', 'hydraulic'] };
  } else if (text.includes('pneumatic') || text.includes('cylinder')) {
    return { type: 'Pneumatic Systems', confidence: 0.85, indicators: ['pneumatic', 'cylinder'] };
  } else if (text.includes('sensor') || text.includes('pnp') || text.includes('npn')) {
    return { type: 'Sensors & Instrumentation', confidence: 0.85, indicators: ['sensor', 'pnp'] };
  } else if (text.includes('mill') || text.includes('carbide') || text.includes('drill')) {
    return { type: 'CNC Tooling', confidence: 0.8, indicators: ['mill', 'carbide'] };
  } else if (text.includes('bearing') || text.includes('skf')) {
    return { type: 'Power Transmission', confidence: 0.8, indicators: ['bearing'] };
  }

  return { type: 'Unknown', confidence: 0.5, indicators: [] };
}
