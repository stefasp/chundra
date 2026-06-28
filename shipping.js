// shipping.js — Chundra
//
// Two shipping methods:
//   1. Correos (box-based, fragile padding, diagonal fit for flat pieces)
//   2. Inpost Punto Pack (weight-based, specific countries only)
//
// Product flags:
//   fragile: true       → +4cm padding all sides
//   flatPackable: true  → thin piece (<3cm), uses box diagonal for fitting
//   shippingNote: str   → Correos returns null (quote), Inpost still calculated
//   shippingFixed: obj  → fixed Correos prices per zone {spain, europe, world}
//   inpostOnly: true    → only Inpost available, Correos always null

// ── Correos boxes ────────────────────────────────────────────────
const BOXES = [
  {
    id: 'flat',
    label: 'Flat envelope',
    dims: { w: 44.5, h: 29, d: 0.2 },
    maxWeight: 1,
    prices: { spain: 14.60, europe: 20, world: 60 }, // europe/world provisional
    flatOnly: false, // available all zones
  },
  {
    id: 'small',
    label: 'Small box',
    dims: { w: 35, h: 28, d: 10 },
    maxWeight: 5,
    prices: { spain: 17.65, europe: 30, world: 90 },
  },
  {
    id: 'medium',
    label: 'Medium box',
    dims: { w: 39, h: 28, d: 19 },
    maxWeight: 10,
    prices: { spain: 19.65, europe: 40, world: 130 },
  },
  {
    id: 'large',
    label: 'Large box',
    dims: { w: 50, h: 30, d: 30 },
    maxWeight: 20,
    prices: { spain: 28, europe: 50, world: 180 },
  },
];

// Diagonal of each box (for flatPackable pieces)
BOXES.forEach(b => {
  b.diagonal = Math.sqrt(b.dims.w ** 2 + b.dims.h ** 2);
});

const PADDING     = 4;   // cm bubble-wrap each side for fragile pieces
const GAP_BETWEEN = 4;   // cm between pieces when packing multiple
const PACKAGING_WEIGHT = 2; // kg box + bubble wrap for Inpost weight calc

// ── Inpost pricing ────────────────────────────────────────────────
const INPOST_COUNTRIES = {
  spain:       { tiers: [[1,5],[2,5],[4,7],[10,14],[30,28]] },
  portugal:    { tiers: [[1,6],[2,6],[4,9],[10,17],[30,34]] },
  france:      { tiers: [[1,9],[2,9],[4,12],[10,23],[30,46]] },
  belgium:     { tiers: [[1,9],[2,10],[4,12],[10,23],[30,46]] },
  luxembourg:  { tiers: [[1,8],[2,9],[4,12],[10,22],[30,44]] },
  netherlands: { tiers: [[1,9],[2,10],[4,12],[10,23],[30,46]] },
  germany:     { tiers: [[1,13],[2,14],[4,15],[10,35],[30,70]] },
  italy:       { tiers: [[1,12],[2,12],[4,13],[10,22],[30,44]], maxWeight: 25 },
  poland:      { tiers: [[1,12],[2,13],[4,16],[10,26],[30,52]], maxWeight: 25 },
};

const INPOST_ZONES = new Set(Object.keys(INPOST_COUNTRIES));

const ZONE_TO_CORREOS = {
  spain: 'spain', portugal: 'europe', france: 'europe', belgium: 'europe',
  luxembourg: 'europe', netherlands: 'europe', germany: 'europe',
  italy: 'europe', poland: 'europe', europe: 'europe', world: 'world',
};

// ── Helpers ───────────────────────────────────────────────────────

function effectiveDims(product) {
  const src = product.dimsFramed || product.dims;
  if (!src) return { w: 30, h: 30, d: 5 };
  if (product.fragile) {
    return { w: src.w + PADDING*2, h: src.h + PADDING*2, d: src.d + PADDING*2 };
  }
  return { w: src.w, h: src.h, d: src.d };
}

function pieceDiagonal(product) {
  const src = product.dimsFramed || product.dims;
  if (!src) return 999;
  return Math.sqrt(src.w ** 2 + src.h ** 2);
}

// Check if a single item fits in a box
// flatPackable items use diagonal comparison
function fitsInBoxSingle(product, box) {
  const dims = effectiveDims(product);

  if (product.flatPackable) {
    const d = (product.dimsFramed || product.dims).d;
    if (d >= 3) return false; // too thick for diagonal trick
    const diag = pieceDiagonal(product);

    if (box.id === 'flat') {
      // Flat envelope is flexible — only check diagonal fits and piece isn't too thick
      // The envelope expands to accommodate the piece thickness up to ~2cm
      return diag <= box.diagonal && d <= 2;
    }
    // Other boxes: diagonal fits and depth fits in any orientation
    return diag <= box.diagonal && d <= Math.max(box.dims.w, box.dims.h, box.dims.d);
  }

  // Normal 3D fit — try all 6 orientations
  const { w, h, d } = dims;
  const [bw, bh, bd] = [box.dims.w, box.dims.h, box.dims.d];
  const orientations = [
    [bw,bh,bd],[bw,bd,bh],[bh,bw,bd],
    [bh,bd,bw],[bd,bw,bh],[bd,bh,bw],
  ];
  return orientations.some(([ow,oh,od]) => w<=ow && h<=oh && d<=od);
}

// Check if multiple items fit together in a box
function fitsInBox(items, box) {
  if (!items.length) return true;
  // For multi-item, use volumetric stacking
  const sorted = [...items].sort((a,b) => (b.w*b.h) - (a.w*a.h));
  let maxW = 0, maxH = 0, totalD = 0;
  sorted.forEach((item, i) => {
    maxW = Math.max(maxW, item.w);
    maxH = Math.max(maxH, item.h);
    totalD += item.d;
    if (i > 0) totalD += GAP_BETWEEN;
  });
  const [bw, bh, bd] = [box.dims.w, box.dims.h, box.dims.d];
  const orientations = [
    [bw,bh,bd],[bw,bd,bh],[bh,bw,bd],
    [bh,bd,bw],[bd,bw,bh],[bd,bh,bw],
  ];
  return orientations.some(([ow,oh,od]) => maxW<=ow && maxH<=oh && totalD<=od);
}

function totalWeight(products) {
  return products.reduce((s, p) => s + (p.weight || 0.5), 0);
}

function inpostPrice(zone, weightKg) {
  const country = INPOST_COUNTRIES[zone];
  if (!country) return null;
  if (weightKg > (country.maxWeight || 30)) return null;
  for (const [limit, price] of country.tiers) {
    if (weightKg <= limit) return price;
  }
  return null;
}

function inpostFits(products) {
  for (const p of products) {
    const d = p.dimsFramed || p.dims;
    if (!d) continue;
    const sides = [d.w, d.h, d.d].sort((a,b) => b-a);
    if (sides[0] > 120) return false;
    if (sides[0]+sides[1]+sides[2] > 150) return false;
  }
  return true;
}

function noShippingResult(message) {
  return {
    cost: null, method: null,
    breakdown: message,
    isEstimate: false, needsConfirmation: false,
    noMethod: true, // signals UI to show contact message
  };
}

// ── Correos ───────────────────────────────────────────────────────

function calculateCorreos(products, zone) {
  const correosZone = ZONE_TO_CORREOS[zone] || 'world';

  if (!products.length) {
    return { cost: 0, breakdown: '', isEstimate: false, needsConfirmation: false, method: 'correos' };
  }

  // inpostOnly → Correos not available
  if (products.some(p => p.inpostOnly)) {
    return noShippingResult('');
  }

  // shippingNote → Correos quote on request
  if (products.some(p => p.shippingNote && !p.shippingFixed)) {
    return { cost: null, breakdown: '', isEstimate: true, needsConfirmation: true, method: 'correos' };
  }

  // shippingFixed (single product)
  if (products.length === 1 && products[0].shippingFixed) {
    const cost = products[0].shippingFixed[correosZone] ?? null;
    if (cost === null) return { cost: null, breakdown: '', isEstimate: true, needsConfirmation: true, method: 'correos' };
    return { cost, breakdown: 'Custom packaging', isEstimate: false, needsConfirmation: false, method: 'correos' };
  }

  // Multiple shippingFixed → use highest price
  if (products.every(p => p.shippingFixed)) {
    const costs = products.map(p => p.shippingFixed[correosZone] ?? null);
    if (costs.some(c => c === null)) return { cost: null, breakdown: '', isEstimate: true, needsConfirmation: true, method: 'correos' };
    return { cost: Math.max(...costs), breakdown: 'Custom packaging — largest piece rate', isEstimate: false, needsConfirmation: true, method: 'correos' };
  }

  // Single flatPackable product
  if (products.length === 1 && products[0].flatPackable) {
    const p = products[0];
    const weight = p.weight || 0.3;
    for (const box of BOXES) {
      if (fitsInBoxSingle(p, box) && weight <= box.maxWeight) {
        const cost = box.prices[correosZone];
        if (cost == null) return { cost: null, breakdown: '', isEstimate: true, needsConfirmation: true, method: 'correos' };
        return { cost, breakdown: `${box.label}`, isEstimate: false, needsConfirmation: false, method: 'correos' };
      }
    }
  }

  // Multi-product or standard 3D: bin-packing
  const items = products.map(p => ({ product: p, dims: effectiveDims(p), weight: p.weight || 0.5 }));
  const weight = totalWeight(products);
  const allDims = items.map(i => i.dims);

  // Try single box
  const singleBox = BOXES.find(box => fitsInBox(allDims, box) && weight <= box.maxWeight);
  if (singleBox) {
    const cost = singleBox.prices[correosZone];
    if (cost == null) return { cost: null, breakdown: '', isEstimate: true, needsConfirmation: true, method: 'correos' };
    return { cost, breakdown: `${singleBox.label} — all pieces`, isEstimate: false, needsConfirmation: false, method: 'correos' };
  }

  // Greedy bin-packing
  const assignments = [];
  const remaining = [...items];
  while (remaining.length > 0) {
    const current = remaining.shift();
    let placed = false;
    for (const a of assignments) {
      const testDims = [...a.items.map(i => i.dims), current.dims];
      const testWeight = a.items.reduce((s,i) => s+i.weight, 0) + current.weight;
      const testBox = BOXES.find(b => fitsInBox(testDims, b) && testWeight <= b.maxWeight);
      if (testBox) { a.items.push(current); a.box = testBox; placed = true; break; }
    }
    if (!placed) {
      const box = BOXES.find(b => fitsInBoxSingle(current.product, b) && current.weight <= b.maxWeight);
      if (box) assignments.push({ box, items: [current] });
      else return { cost: null, breakdown: `"${current.product.name}" needs custom packaging`, isEstimate: true, needsConfirmation: true, method: 'correos' };
    }
  }

  let totalCost = 0;
  const parts = [];
  for (const a of assignments) {
    const price = a.box.prices[correosZone];
    if (price == null) return { cost: null, breakdown: '', isEstimate: true, needsConfirmation: true, method: 'correos' };
    totalCost += price;
    parts.push(`${a.box.label}: ${a.items.map(i=>i.product.name).join(' + ')} (€${price})`);
  }

  return { cost: totalCost, breakdown: parts.join(' / '), isEstimate: false, needsConfirmation: false, method: 'correos' };
}

// ── Inpost ────────────────────────────────────────────────────────

function calculateInpost(products, zone) {
  if (!INPOST_ZONES.has(zone)) return null;
  if (!inpostFits(products)) return null;
  const weight = totalWeight(products) + PACKAGING_WEIGHT;
  const cost   = inpostPrice(zone, weight);
  if (cost === null) return null;
  return {
    cost,
    weight: Math.round(weight * 100) / 100,
    breakdown: `${products.length} piece${products.length>1?'s':''} · ${weight.toFixed(1)}kg`,
    isEstimate: false, needsConfirmation: false,
    method: 'inpost',
  };
}

// ── Public API ────────────────────────────────────────────────────

function calculateShippingOptions(products, zone) {
  const correos = calculateCorreos(products, zone);
  const inpost  = calculateInpost(products, zone);

  // If neither method works → no shipping available
  const correosOk = correos && correos.cost !== null && !correos.noMethod;
  const inpostOk  = inpost  && inpost.cost  !== null;

  if (!correosOk && !inpostOk) {
    return {
      correos: noShippingResult('no_method'),
      inpost:  null,
      noMethod: true,
    };
  }

  return { correos, inpost, noMethod: false };
}

// Legacy: single method (Correos) for piece modal default view
function calculateShipping(products, zone) {
  return calculateCorreos(products, zone);
}

function calculateAllZones(products) {
  return {
    spain:  calculateCorreos(products, 'spain'),
    europe: calculateCorreos(products, 'europe'),
    world:  calculateCorreos(products, 'world'),
  };
}

function formatShippingCost(result) {
  if (!result || result.cost === null) return 'Quote';
  return `€${result.cost % 1 === 0 ? result.cost : result.cost.toFixed(2)}`;
}

const ZONE_LABELS = {
  spain:       { flag: '🇪🇸', name: 'Spain' },
  portugal:    { flag: '🇵🇹', name: 'Portugal' },
  france:      { flag: '🇫🇷', name: 'France' },
  belgium:     { flag: '🇧🇪', name: 'Belgium' },
  luxembourg:  { flag: '🇱🇺', name: 'Luxembourg' },
  netherlands: { flag: '🇳🇱', name: 'Netherlands' },
  germany:     { flag: '🇩🇪', name: 'Germany' },
  italy:       { flag: '🇮🇹', name: 'Italy' },
  poland:      { flag: '🇵🇱', name: 'Poland' },
  europe:      { flag: '🌍', name: 'Rest of Europe' },
  world:       { flag: '🌏', name: 'Rest of the world' },
};
