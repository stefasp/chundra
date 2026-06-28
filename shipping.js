// shipping.js — Chundra
// Calculates shipping cost using real Correos España box sizes.
// Fragile pieces get 4cm bubble-wrap padding on all sides.
// Multi-piece orders: 4cm gap between pieces, packed optimally into fewest boxes.

const BOXES = [
  // Spain-only flat rate (sobres/bolsas for thin flat work, unframed)
  {
    id: 'flat',
    label: 'Flat envelope',
    dims: { w: 35, h: 28, d: 2 },   // practical flat limit
    maxWeight: 1,
    prices: { spain: 14.60, europe: null, world: null }, // Spain only
    spainOnly: true,
  },
  {
    id: 'small',
    label: 'Small box',
    dims: { w: 35, h: 28, d: 10 },   // Correos pequeña: 350×280×100mm
    maxWeight: 5,
    prices: { spain: 17.65, europe: 30, world: 90 },
  },
  {
    id: 'medium',
    label: 'Medium box',
    dims: { w: 39, h: 28, d: 19 },   // Correos mediana: 390×280×190mm
    maxWeight: 10,
    prices: { spain: 19.65, europe: 40, world: 130 },
  },
  {
    id: 'large',
    label: 'Large box',
    dims: { w: 50, h: 30, d: 30 },   // Correos grande: 500×300×300mm
    maxWeight: 20,
    prices: { spain: 28, europe: 50, world: 180 },
  },
];

const PADDING = 4;       // cm bubble-wrap on all sides for fragile pieces
const GAP_BETWEEN = 4;   // cm between pieces when packing multiple fragile ones

/**
 * Get the padded effective dimensions of a piece.
 * Fragile → add PADDING on all sides.
 * Non-fragile → actual dims (paintings are flat, padding not needed).
 */
function effectiveDims(product) {
  const d = product.dims;
  if (product.fragile) {
    return {
      w: d.w + PADDING * 2,
      h: d.h + PADDING * 2,
      d: d.d + PADDING * 2,
    };
  }
  // For framed paintings use framed dims if available
  const src = product.dimsFramed || d;
  return { w: src.w, h: src.h, d: src.d };
}

/**
 * Try to fit an array of {w,h,d} items into a single box.
 * Simple stacking strategy: sort by height desc, stack along depth axis.
 * Returns true if they all fit.
 */
function fitsInBox(items, box) {
  if (items.length === 0) return true;

  // Sort largest footprint first
  const sorted = [...items].sort((a, b) => (b.w * b.h) - (a.w * a.h));

  // Track the max footprint needed (w x h) and total depth stack
  let maxW = 0, maxH = 0, totalD = 0;

  sorted.forEach((item, i) => {
    maxW = Math.max(maxW, item.w);
    maxH = Math.max(maxH, item.h);
    totalD += item.d;
    if (i > 0) totalD += GAP_BETWEEN; // gap between pieces
  });

  // Try all 6 orientations of the box to find the best fit
  const boxOrientations = [
    { w: box.dims.w, h: box.dims.h, d: box.dims.d },
    { w: box.dims.w, h: box.dims.d, d: box.dims.h },
    { w: box.dims.h, h: box.dims.w, d: box.dims.d },
    { w: box.dims.h, h: box.dims.d, d: box.dims.w },
    { w: box.dims.d, h: box.dims.w, d: box.dims.h },
    { w: box.dims.d, h: box.dims.h, d: box.dims.w },
  ];

  return boxOrientations.some(o =>
    maxW <= o.w && maxH <= o.h && totalD <= o.d
  );
}

/**
 * Find the smallest (cheapest) single box that fits all items.
 * Returns the box object or null if nothing fits.
 */
function findBoxForItems(items, zone) {
  const usableBoxes = zone === 'spain'
    ? BOXES
    : BOXES.filter(b => !b.spainOnly);

  return usableBoxes.find(box => fitsInBox(items, box)) || null;
}

/**
 * Check if a product can use the flat envelope (Spain only).
 * Only unframed paintings/drawings with depth ≤ 2cm qualify.
 */
function canUseFlatEnvelope(product) {
  const dims = effectiveDims(product);
  return (
    !product.fragile &&
    dims.d <= 2 &&
    dims.w <= 35 &&
    dims.h <= 28 &&
    (product.weight || 0) <= 1
  );
}

/**
 * Main export: calculate shipping cost for a cart of products.
 *
 * @param {Array} cartItems  — array of product objects from PRODUCTS
 * @param {string} zone      — 'spain' | 'europe' | 'world'
 * @returns {Object} {
 *   cost: number,           — total shipping €
 *   boxes: Array,           — boxes used [{box, items}]
 *   breakdown: string,      — human-readable explanation
 *   isEstimate: boolean,    — true if we had to fall back to conservative estimate
 *   needsConfirmation: boolean — true if any piece is unusually large
 * }
 */
function calculateShipping(cartItems, zone) {
  if (!cartItems || cartItems.length === 0) {
    return { cost: 0, boxes: [], breakdown: 'No items', isEstimate: false, needsConfirmation: false };
  }

  // Build effective dim items
  const items = cartItems.map(p => ({
    product: p,
    dims: effectiveDims(p),
    weight: p.weight || 0,
  }));

  // Special: single unframed flat painting to Spain
  if (zone === 'spain' && items.length === 1 && canUseFlatEnvelope(items[0].product)) {
    const flatBox = BOXES.find(b => b.id === 'flat');
    return {
      cost: flatBox.prices.spain,
      boxes: [{ box: flatBox, items: [items[0].product] }],
      breakdown: `Flat envelope — Spain`,
      isEstimate: false,
      needsConfirmation: false,
    };
  }

  // Check if any item exceeds the largest box (needs custom quote)
  const largeBox = BOXES[BOXES.length - 1];
  const oversized = items.filter(item =>
    item.dims.w > largeBox.dims.w &&
    item.dims.h > largeBox.dims.h &&
    item.dims.d > largeBox.dims.d
  );
  if (oversized.length > 0) {
    return {
      cost: null,
      boxes: [],
      breakdown: 'One or more pieces require a custom shipping quote.',
      isEstimate: true,
      needsConfirmation: true,
    };
  }

  // Try packing everything into one box first (cheapest outcome)
  const allDims = items.map(i => i.dims);
  const singleBox = findBoxForItems(allDims, zone);
  const totalWeight = items.reduce((s, i) => s + i.weight, 0);

  if (singleBox && totalWeight <= singleBox.maxWeight) {
    const cost = singleBox.prices[zone];
    const names = items.map(i => i.product.name).join(', ');
    return {
      cost,
      boxes: [{ box: singleBox, items: cartItems }],
      breakdown: `${singleBox.label} (all pieces together)`,
      isEstimate: false,
      needsConfirmation: false,
    };
  }

  // Greedy bin-packing: assign each item to the smallest possible box
  // Try to combine items into as few boxes as possible
  const usableBoxes = zone === 'spain' ? BOXES : BOXES.filter(b => !b.spainOnly);
  const assignments = []; // [{box, items:[]}]
  const remaining = [...items];

  while (remaining.length > 0) {
    const current = remaining.shift();
    let placed = false;

    // Try to fit current item into an existing assignment
    for (const assignment of assignments) {
      const testItems = [...assignment.items.map(i => i.dims), current.dims];
      const testWeight = assignment.items.reduce((s, i) => s + i.weight, 0) + current.weight;
      const testBox = findBoxForItems(testItems, zone);
      if (testBox && testWeight <= testBox.maxWeight) {
        assignment.items.push(current);
        assignment.box = testBox; // may upgrade box size
        placed = true;
        break;
      }
    }

    if (!placed) {
      // Start a new box for this item
      const box = findBoxForItems([current.dims], zone);
      if (box) {
        assignments.push({ box, items: [current] });
      } else {
        // Oversized single item
        return {
          cost: null,
          boxes: [],
          breakdown: `"${current.product.name}" is too large for standard boxes. Custom quote needed.`,
          isEstimate: true,
          needsConfirmation: true,
        };
      }
    }
  }

  // Sum up box costs
  let totalCost = 0;
  const boxSummary = [];
  for (const a of assignments) {
    const price = a.box.prices[zone];
    totalCost += price;
    const names = a.items.map(i => i.product.name).join(' + ');
    boxSummary.push(`${a.box.label}: ${names} (€${price})`);
  }

  return {
    cost: totalCost,
    boxes: assignments.map(a => ({ box: a.box, items: a.items.map(i => i.product) })),
    breakdown: boxSummary.join(' / '),
    isEstimate: false,
    needsConfirmation: false,
  };
}

/**
 * Calculate shipping for all three zones at once.
 * Returns { spain, europe, world } each with the result from calculateShipping.
 */
function calculateAllZones(cartItems) {
  return {
    spain: calculateShipping(cartItems, 'spain'),
    europe: calculateShipping(cartItems, 'europe'),
    world: calculateShipping(cartItems, 'world'),
  };
}

/**
 * Format a shipping result for display.
 * @param {Object} result — from calculateShipping
 * @returns {string} — display string like "€28" or "Custom quote"
 */
function formatShippingCost(result) {
  if (result.cost === null) return 'Custom quote';
  return `€${result.cost.toFixed(2).replace('.00', '')}`;
}
