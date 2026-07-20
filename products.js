// products.js — Chundra
// fragile: true → 4cm bubble-wrap padding on all sides
// packingEfficiency: 0=occupies full volume, 1=lots of free space around piece
// dimsFramed: framed dimensions used for shipping calc when present
// shippingNote: overrides auto-calc, shows custom quote message

const PRODUCTS = {


  flyingpendant: {
    id: 'flyingpendant', name: 'Flying pendant', subtitle: 'Folk charm',
    category: ['pendants'], status: 'available', wholesaleAvailable: true,
    price: 21, fragile: true,
    dims: { w: 5.5, h: 7, d: 0.5 },
    weight: 0.36, productionCost: 1, hoursWorked: 1, packingEfficiency: 0.10,
    materials: 'Ceramic and chain',
    description: `Inspired by contemporary folk aesthetics, this handcrafted ceramic pendant brings a quiet sense of originality to any outfit. Light enough for everyday wear, yet expressive enough to become a signature piece.`,
    images: ['images/flying-01.png', 'images/flying-02.png', 'images/flying-03.png'],
  },

  // ─── GUARDIANAS ────────────────────────────────────────────────

  ariadna: {
    id: 'ariadna', name: 'Ariadna', subtitle: 'a quiet enigma',
    category: ['guardians'], status: 'available', wholesaleAvailable: true,
    price: 152, priceSale: 90, fragile: true,
    dims: { w: 17, h: 32.5, d: 16.5 },
    weight: 1.42, productionCost: 10, hoursWorked: 4, packingEfficiency: 0.62,
    materials: 'Mixed — ceramic, acrylic paint, textile, matte varnish',
    description: `Ariadna holds a mysterious, almost somber presence, yet she vibrates with color, with life. There is something luminous in her contrasts — in the dialogue between gold, floral textures, and the vivid interplay of turquoise and warm orange tones.

She seems to stand at the threshold of something unresolved, as if facing a crossroads not entirely her own — something inherited, something ancient. And yet, she does not resist it. She resolves it quietly, with elegance.

Ariadna does not impose direction; she refines it. Her presence is light, almost floating, but carries a deep certainty. She reminds us that not all tensions must be broken — some are meant to be held, transformed, and woven into something precise, something beautiful.`,
    images: [
      'images/ariadna-01.png',
      'images/ariadna-02.png',
      'images/ariadna-03.png',
      'images/ariadna-04.png',
      'images/ariadna-05.png',
      'images/ariadna-06.png',
    ],
  },

  zaira: {
    id: 'zaira', name: 'Zaira', subtitle: 'the wisdom of the flesh',
    category: ['guardians'], status: 'available', wholesaleAvailable: true,
    price: 116, priceSale: 103, fragile: true,
    dims: { w: 16, h: 21, d: 19 },
    weight: 0.96, productionCost: 7, hoursWorked: 5, packingEfficiency: 0.50,
    materials: 'Mixed — ceramic, acrylic paint, matte varnish',
    description: `Zaira seems to move guided by her gut feelings.

We often say we should listen to our hearts, but I'm not sure that the heart is what truly tells us where to go. I believe direction might be somewhere deeper, more primitive — from the stomach, from the viscera, from that place where sensations live before they become emotions or words.

Zaira calls us back to the flesh, to the awareness of our mortality, to a more vivid way of being. She invites us to awaken a quiet, humble wisdom.`,
    images: [
      'images/zaira-01.png',
      'images/zaira-02.png',
      'images/zaira-03.png',
      'images/zaira-04.png',
      'images/zaira-05.png',
      'images/zaira-06.png',
      'images/zaira-07.png',
    ],
  },

  juana: {
    id: 'juana', name: 'Guardian Juana', subtitle: 'feline strength',
    category: ['guardians'], status: 'available', wholesaleAvailable: true,
    price: 66, fragile: true,
    dims: { w: 12.5, h: 15, d: 3 },
    weight: 0.36, productionCost: 2, hoursWorked: 2.5, packingEfficiency: 0.30,
    materials: 'Ceramic and fabric',
    description: `Sharp and alert. This piece celebrates the voracity to reach dreams and the determination to conquer what we desire. It is not softness; it is drive, energy, and power concentrated in every action.`,
    images: ['images/juana-01.png', 'images/juana-02.png', 'images/juana-03.png', 'images/juana-04.png'],
  },

  mara: {
    id: 'mara', name: 'Guardian Mara', subtitle: 'the power to nest, the power to fly',
    category: ['guardians'], status: 'available', wholesaleAvailable: true,
    price: 66, fragile: true,
    dims: { w: 13.5, h: 14, d: 4 },
    weight: 0.45, productionCost: 2, hoursWorked: 2.5, packingEfficiency: 0.30,
    materials: 'Ceramic and fabric',
    description: `A symbol of balance between nesting and flying. The woman, embraced by the bird's wing, reminds us that we can put down roots, care for others, and create harmony without losing the freedom to spread our wings. A piece that invites stillness, care, and expansion.`,
    images: ['images/mara-01.png','images/mara-02.png','images/mara-03.png', 'images/mara-04.png'],
  },

  lunar: {
    id: 'lunar', name: 'Lunar Guardian', subtitle: 'movement of life and femininity',
    category: ['guardians','ritual'], status: 'available', wholesaleAvailable: true,
    price: 139, priceSale: 87, fragile: true,
    dims: { w: 14.5, h: 17.5, d: 10 },
    weight: 0.58, productionCost: 6, hoursWorked: 4, packingEfficiency: 0.65,
    materials: 'Ceramic',
    description: `This piece celebrates the essence of the feminine in all its complexity. The Lunar Guardian honors the shifting nature of femininity. The torso, resting on a surface reminiscent of the sea's texture, connects us to nature — its flow and the constant movement of life.

The Lunar Guardian reminds us that we are not linear: our power moves, changes, and transforms.

**It includes two interchangeable heads**, each carrying its own symbolic power.

Ritual: Includes a guided exercise to help reconnect with our inner cycles and prepare for moments of introspection and strength.`,
    images: [
      'images/lunar-01.png',
      'images/lunar-02.png',
      'images/lunar-03.png',
      'images/lunar-04.png',
      'images/lunar-05.png',
    ],
  },

  marina: {
    id: 'marina', name: 'Guardian Marina', subtitle: 'transformative power of depth',
    category: ['guardians','ritual'], status: 'available', wholesaleAvailable: true,
    price: 85, priceSale: 72, fragile: true,
    dims: { w: 15, h: 19, d: 12.5 },
    weight: 1.0, productionCost: 10, hoursWorked: 3, packingEfficiency: 0.20,
    materials: 'Ceramic, glass and fabric',
    description: `Marina inhabits the deep waters, where calm and storm coexist.

With her textures — waves, peaks, currents — she evokes the strength of what moves beneath, what is not always visible. With her blue stone as a beacon, she guards the mysteries of emotional flow and invites us to dive into the unknown without fear.

Marina is the guardian of the hidden, of inner movement, of the transformative power of depth.

Ritual: Includes an exercise to help you face challenges or fears, connecting with a stronger, renewed version of yourself.`,
    images: ['images/marina-01.png', 'images/marina-02.png', 'images/marina-03.png', 'images/marina-04.png'],
  },

  salamanca: {
    id: 'salamanca', name: 'Guardian Salamanca', subtitle: 'guardian of transition',
    category: ['guardians','ritual'], status: 'available', wholesaleAvailable: true,
    price: 89, priceSale: 76, fragile: true,
    dims: { w: 16, h: 18.5, d: 13 },
    weight: 1.0, productionCost: 10, hoursWorked: 3, packingEfficiency: 0.20,
    materials: 'Ceramic, metal and fabric',
    description: `Salamanca is the guardian of transition and loyalty, a companion in processes of change and a protector during transformations. Her presence is earthy and warm, with an energy of rootedness and shelter. She represents the ancestral: her textures evoke caves, our origins, the inherited and the ancient.

Her companion, the threshold guardian, allows us to leave that cave, guides us, and builds a bridge toward the new. Together, they guard the portals of change and invite us to transform without losing our connection to what came before.

Ritual: Includes an exercise inviting reflection on inherited mandates and consciously choosing what we want to continue.`,
    images: ['images/salamanca-01.png', 'images/salamanca-02.png', 'images/salamanca-03.png', 'images/salamanca-04.png'],
  },

  trina: {
    id: 'trina', name: 'Guardian Trina', subtitle: 'the dreams protector',
    category: ['guardians','ritual'], status: 'available', wholesaleAvailable: true,
    price: 89, priceSale: 76, fragile: true,
    dims: { w: 10, h: 15, d: 10 },
    weight: 0.56, productionCost: 6, hoursWorked: 3, packingEfficiency: 0.20,
    materials: 'Ceramic and fabric',
    description: `Trina comes from the Latin Trinus, meaning "triple." Filled with wisdom, balance, and wholeness (body, mind, and spirit / past, present, and future / birth, life, and death). Delicate yet carrying inner strength — feminine, ancient, introspective.

A guardian of the hidden, she watches in silence and supports processes of understanding and inner revelation. Calm but powerful, she protects dreams.

Ritual: Includes an exercise to dialogue with the past and reconstruct it in a way that creates a positive impact, broadening our perspective.`,
    images: ['images/trina-01.png', 'images/trina-02.png', 'images/trina-03.png'],
  },

  amalia: {
    id: 'amalia', name: 'Guardian Amalia', subtitle: 'conscious serenity',
    category: ['guardians','ritual'], status: 'available', wholesaleAvailable: true,
    price: 109, fragile: true,
    dims: { w: 13, h: 38, d: 13 },
    weight: 1.45, productionCost: 10, hoursWorked: 4, packingEfficiency: 0.30,
    materials: 'Ceramic',
    description: `Amalia represents conscious serenity, the wisdom attained when we stop reacting and start observing. Her face conveys temperance, balance, and inner clarity. This piece invites you to pause, reconnect with calm, and remember that the deepest strength arises from lucid silence.

Includes a ritual to reconnect with the present and cultivate a kinder, more serene inner state, through the creation of a personal mantra to accompany your meditations.`,
    images: ['images/amalia-01.png','images/amalia-02.png','images/amalia-03.png'],
  },

  // ─── VIAJEROS ──────────────────────────────────────────────────

  traveler: {
    id: 'traveler', name: 'The Silent Traveler', subtitle: 'the ancient messenger',
    category: ['viajeros'], status: 'available', wholesaleAvailable: true,
    price: 93, fragile: true,
    dims: { w: 18.5, h: 17.5, d: 16 },
    weight: 1.1, productionCost: 5, hoursWorked: 3, packingEfficiency: 0.45,
    materials: 'Ceramic and textile',
    description: `The Silent Traveler does not journey alone; he moves in harmony with his companion, his steadfast support. Together, they traverse the world — their world. They seem to have stepped out of a mythological tale, with a touch of Spain perhaps present in the bull, an unconscious expression of cultural ties.

This piece was sketched while wandering through the Gibralfaro mountain in Málaga. The traveler carries with him something ancient, almost aboriginal, like the aesthetic of an ancient script, as though telling a story from a distant time.`,
    images: [
      'images/traveler-01.png',
      'images/traveler-02.png',
      'images/traveler-03.png',
      'images/traveler-04.png',
      'images/traveler-05.png',
    ],
  },

  gibran: {
    id: 'gibran', name: 'Traveler Gibran', subtitle: 'a fully present traveler',
    category: ['viajeros'], status: 'available', wholesaleAvailable: true,
    price: 78, fragile: true,
    dims: { w: 15, h: 12, d: 6.5 },
    weight: 0.35, productionCost: 3, hoursWorked: 2.8, packingEfficiency: 0.20,
    materials: 'Ceramic',
    description: `Nowadays it seems we live on autopilot: collecting destinations, photos, and experiences "for the feed," but often forgetting what truly matters. The deepest memories don't come from the places we visit, but from how we feel every step of the way, from shared laughter, unexpected wonder, and the connection with those who accompany us.

This piece is a reminder that the essential thing is not to accumulate places, but to live the present fully. Destinations fade, but emotions and shared moments remain.`,
    images: ['images/gibran-01.png', 'images/gibran-02.png', 'images/gibran-03.png', 'images/gibran-04.png'],
  },

  // ─── LÁMPARAS ──────────────────────────────────────────────────

  totem: {
    id: 'totem', name: 'Totem of Legacy', subtitle: 'cycle of life',
    category: ['lamparas'], status: 'available', wholesaleAvailable: true,
    price: 132, priceSale: 104, fragile: true,
    dims: { w: 13, h: 30, d: 9 },
    weight: 1.35, productionCost: 10, hoursWorked: 4, packingEfficiency: 0.20,
    materials: 'Ceramic',
    description: `This piece speaks of the cycle of life. The figures could represent one person — youth and age — or two, reflecting how life is passed from one to another. It's a reminder that we don't completely leave when we go; we leave parts of ourselves in those we love, in those who love us, and in the things we build and leave behind.

Like a totem, it stands tall, carrying the weight of memories, of connections, of legacy. **Sold without lampshade.**`,
    images: ['images/totem-01.png','images/totem-02.png','images/totem-03.png'],
    video: 'images/totem.mp4',
  },

  // ─── MACETAS & JARS ────────────────────────────────────────────

  carnival: {
    id: 'carnival', name: 'Carnival Jar', subtitle: 'life cycles',
    category: ['macetas'], status: 'available', wholesaleAvailable: true,
    price: 178, priceSale: 120, fragile: true,
    dims: { w: 17, h: 21, d: 17 },
    weight: 1.6, productionCost: 10, hoursWorked: 7, packingEfficiency: 0.30,
    materials: 'Ceramic',
    description: `This piece embodies the strength of encounters and the transformations that occur when they happen. Everything is intertwined, all vital energies are connected, the cycles that pass through us, and the beauty that arises from chaos. A presence that inhabits the space and fills it with inner movement.`,
    images: ['images/rito-01.png','images/rito-02.png','images/rito-03.png','images/rito-04.png','images/rito-05.png','images/rito-06.png', 'images/rito-07.png', 'images/rito-08.png'],
  },

  // ─── WALL ART ──────────────────────────────────────────────────

  'candle-cat': {
    id: 'candle-cat', name: 'Cat Candle Holder', subtitle: 'wall art collection',
    category: ['wallart'], status: 'available', wholesaleAvailable: true,
    price: 55, fragile: true,
    dims: { w: 14, h: 20, d: 7 },
    weight: 0.5, productionCost: 3, hoursWorked: 2, packingEfficiency: 0.85,
    materials: 'Ceramic',
    description: `This piece belongs to the Wall Art collection and is designed with a delicate hanging pendant, allowing the candle holder to be displayed on the wall like a small personal temple of light. With a more pop and contemporary aesthetic, it features a playful yet elegant cat gaze that looks back at the viewer with charm and subtle sophistication. Its color palette blends lilacs, violets, and blues, creating a modern, dreamy presence that balances character and refinement.`,
    images: ['images/portavela-catpower-01.png', 'images/portavela-catpower-02.png', 'images/portavela-catpower-03.png'],
  },

  'candle-freckles': {
    id: 'candle-freckles', name: 'Malva Freckles Candle Holder', subtitle: 'wall art collection',
    category: ['wallart'], status: 'available', wholesaleAvailable: true,
    price: 44, fragile: true,
    dims: { w: 14, h: 20, d: 7 },
    weight: 0.5, productionCost: 2, hoursWorked: 1, packingEfficiency: 0.85,
    materials: 'Ceramic',
    description: `This piece belongs to the Wall Art collection and is designed with a delicate hanging pendant, allowing the candle holder to be displayed on the wall like a small personal temple of light. In soft violet-grey tones with white and earthy speckled details, it carries a refined and sophisticated presence.`,
    images: ['images/portavela-malva-01.png','images/portavela-malva-02.png'],
  },

  gaze: {
    id: 'gaze', name: 'The Gaze', subtitle: 'wall art collection',
    category: ['wallart'], status: 'available', wholesaleAvailable: true,
    price: 48, fragile: true,
    dims: { w: 14.5, h: 40, d: 1.5 },        // fully extended
    dimsCompact: { w: 14.5, h: 11.5, d: 1.5 }, // central figure (used for shipping)
    flatPackable: true,
    weight: 0.5, productionCost: 2, hoursWorked: 1.5, packingEfficiency: 0.85,
    materials: 'Ceramic',
    description: `This piece captures a luminous gaze emerging from a deep, night-blue face, surrounded by golden petals. The eyes are alert and alive, as if quietly tracing every detail of the world around them. It speaks of a perception that goes beyond seeing.`,
    images: ['images/justhere-01.png','images/justhere-02.png','images/justhere-03.png'],
  },

  heartandfox: {
    id: 'heartandfox', name: 'Heart & Fox', subtitle: 'wall art collection',
    category: ['wallart'], status: 'available', wholesaleAvailable: true,
    price: 48, fragile: true,
    dims: { w: 14, h: 40, d: 1.5 },          // fully extended
    dimsCompact: { w: 14, h: 14, d: 1.5 },    // central figure (used for shipping)
    flatPackable: true,
    weight: 0.5, productionCost: 2.1, hoursWorked: 1.5, packingEfficiency: 0.85,
    materials: 'Ceramic',
    description: `This colorful piece is part of the Wall Art Collection. An introspective fox with a touch of Mexican soul — elegant, thoughtful, and festive, just as every home should be.`,
    images: ['images/heartandfox-01.png','images/heartandfox-02.png','images/heartandfox-03.png','images/heartandfox-04.png'],
  },

  'snake-heart-flam-1': {
    id: 'snake-heart-flam-1', name: 'Snake Heart Flam 1', subtitle: 'wall art collection',
    category: ['wallart'], status: 'sold', wholesaleAvailable: true,
    price: 48, fragile: true,
    dims: { w: 19, h: 36, d: 2 },
    dimsCompact: { w: 19, h: 15, d: 2 },    // central figure (used for shipping)
    weight: 0.5, packingEfficiency: 0.25,
    productionCost: 2, hoursWorked: 1.7,
    materials: 'Ceramic, bright glaze, underglazes, textile and metal details',
    description: `A vivid wall piece combining the symbolic force of the snake with the warmth of the heart and the energy of flame. Part of the Wall Art collection.`,
    images: [
      'images/snakeheartflam-01.png','images/snakeheartflam-02.png',
    ],
  },

  'bright-star-1': {
    id: 'bright-star-1', name: 'Bright Star 1', subtitle: 'wall art collection',
    category: ['wallart'], status: 'available', wholesaleAvailable: true,
    price: 48, fragile: true,
    dims: { w: 23, h: 40, d: 1.5 },
    dimsCompact: { w: 19, h: 19, d: 1.5 },    // central figure (used for shipping)
    weight: 0.5, packingEfficiency: 0.85, flatPackable: true,
    productionCost: 3, hoursWorked: 2,
    materials: 'Ceramic, bright glaze, underglazes and textile details',
    description: `A luminous wall piece from the Wall Art collection. Bright glazes and textile details create a piece that catches light and holds attention.`,
    images: [
      'images/brightstar-01.png','images/brightstar-02.png',
    ],
  },

  // ─── CUADROS ───────────────────────────────────────────────────

  thewalk: {
    id: 'thewalk', name: 'The Walk',
    category: ['cuadros'], status: 'available', wholesaleAvailable: true,
    price: 59, fragile: false,
    dims: { w: 20, h: 20, d: 1.5 },
    weight: 0.3, productionCost: 2, hoursWorked: 3, framed: 'unframed', flatPackable: true,
    materials: 'Mixed media on canvas',
    images: ['images/small-painting-thewalk-01.png','images/small-painting-thewalk-02.png','images/small-painting-thewalk-03.png','images/small-painting-thewalk-04.png','images/small-painting-thewalk-05.png','images/small-painting-thewalk-06.png'],
  },

  bird: {
    id: 'bird', name: 'Bird',
    category: ['cuadros'], status: 'available', wholesaleAvailable: true,
    price: 46, fragile: false,
    dims: { w: 20, h: 20, d: 1.5 },
    weight: 0.3, productionCost: 1, hoursWorked: 1.5, framed: 'unframed', flatPackable: true,
    materials: 'Acrylic on canvas',
    images: ['images/small-painting-bird-01.png','images/small-painting-bird-02.png'],
  },

  mistify: {
    id: 'mistify', name: 'Mistify',
    category: ['cuadros'], status: 'available', wholesaleAvailable: true,
    price: 59, fragile: false,
    dims: { w: 20, h: 20, d: 1.5 },
    weight: 0.3, productionCost: 2, hoursWorked: 2, framed: 'unframed', flatPackable: true,
    materials: 'Mixed media on canvas',
    images: ['images/small-painting-mistify-01.png','images/small-painting-mistify-02.png','images/small-painting-mistify-03.png','images/small-painting-mistify-04.png'],
  },

  wait: {
    id: 'wait', name: 'Wait for me',
    category: ['cuadros'], status: 'available', wholesaleAvailable: true,
    price: 215, fragile: false,
    dims: { w: 35, h: 35, d: 0.4 },
    dimsFramed: { w: 41.5, h: 41.5, d: 1.5 },
    weight: 1.2, productionCost: 6, hoursWorked: 2, framed: 'framed', flatPackable: true,
    materials: 'Acrylic on wood',
    shippingNote: 'Shipping to Europe and beyond: quote on request for non-Inpost destinations.',
    images: ['images/wait-01.png', 'images/wait-02.png', 'images/wait-03.png', 'images/wait-04.png','images/wait-05.png'],
  },

  marea: {
    id: 'marea', name: 'Marea',
    category: ['cuadros'], status: 'available', wholesaleAvailable: true,
    price: 305, priceSale: 250, fragile: false,
    dims: { w: 35, h: 35, d: 0.4 },
    dimsFramed: { w: 41.5, h: 41.5, d: 1.5 },
    weight: 0.7, productionCost: 6, hoursWorked: 8, framed: 'framed', flatPackable: true,
    materials: 'Acrylic on wood',
    shippingNote: 'Shipping to Europe and beyond: quote on request for non-Inpost destinations.',
    images: ['images/marea-01.png','images/marea-02.png','images/marea-03.png','images/pivot-06.png'],
  },

  pivot: {
    id: 'pivot', name: 'Pivot',
    category: ['cuadros'], status: 'available', wholesaleAvailable: true,
    price: 305, priceSale: 250, fragile: false,
    dims: { w: 35, h: 35, d: 0.4 },
    dimsFramed: { w: 41.5, h: 41.5, d: 1.5 },
    weight: 0.7, productionCost: 6, hoursWorked: 8, framed: 'framed', flatPackable: true,
    materials: 'Acrylic on wood',
    shippingNote: 'Shipping to Europe and beyond: quote on request for non-Inpost destinations.',
    images: ['images/pivot-01.png','images/pivot-02.png','images/pivot-03.png','images/pivot-06.png'],
  },

  whispers: {
    id: 'whispers', name: 'Whispers of the Deep',
    category: ['cuadros'], status: 'available', wholesaleAvailable: true,
    price: 269, fragile: false,
    dims: { w: 60, h: 40, d: 0.3 },
    weight: 0.7, productionCost: 4, hoursWorked: 9, framed: 'stretched canvas', flatPackable: true,
    materials: 'Acrylic on canvas',
    shippingNote: 'Shipping to Europe and beyond: quote on request for non-Inpost destinations.',
    images: ['images/whispers-01.png'],
  },

  horizons: {
    id: 'horizons', name: 'Inner Horizons',
    category: ['cuadros'], status: 'available', wholesaleAvailable: true,
    price: 329, fragile: false,
    dims: { w: 60, h: 40, d: 0.3 },
    weight: 1.25, productionCost: 4, hoursWorked: 11, framed: 'unframed', flatPackable: true,
    materials: 'Acrylic on canvas',
    shippingNote: 'Shipping to Europe and beyond: quote on request for non-Inpost destinations.',
    images: ['images/horizons-01.png','images/horizons-02.png','images/horizons-05.png'],
  },

  encuentro: {
    id: 'encuentro', name: 'Encuentros',
    category: ['cuadros'], status: 'available', wholesaleAvailable: true,
    price: 329, priceSale: 270, fragile: false,
    dims: { w: 60, h: 40, d: 0.3 },
    dimsFramed: { w: 71.5, h: 51.5, d: 2.3 },
    weight: 2.3, productionCost: 4, hoursWorked: 11, framed: 'framed', flatPackable: true,
    materials: 'Acrylic on canvas',
    shippingNote: 'Shipping to Europe and beyond: quote on request for non-Inpost destinations.',
    images: ['images/encuentros-01.png','images/encuentros-02.png','images/encuentros-03.png'],
  },

  confluence: {
    id: 'confluence', name: 'Confluence',
    category: ['cuadros'], status: 'available', wholesaleAvailable: true,
    price: 389, fragile: false,
    dims: { w: 90, h: 60, d: 0.1 },
    weight: 0.8, productionCost: 8, hoursWorked: 13, framed: 'stretched canvas',
    materials: 'Acrylic on canvas',
    shippingNote: 'Shipping to Europe and beyond: quote on request for non-Inpost destinations.',
    images: ['images/confluence-01.png','images/confluence-02.png','images/confluence-03.png'],
  },

  dreams: {
    id: 'dreams', name: 'Dreams Echo',
    category: ['cuadros'], status: 'available', wholesaleAvailable: true,
    price: 75, fragile: false,
    dims: { w: 40, h: 40, d: 1.5 },
    weight: 0.43, productionCost: 3, hoursWorked: 2, framed: 'stretched canvas',
    materials: 'Acrylic on canvas',
    inpostOnly: true,
    images: ['images/dreams-01.png','images/dreams-02.png','images/dreams-03.png','images/dreams-04.png','images/dreams-05.png'],
  },

  // ─── DIBUJOS ───────────────────────────────────────────────────

  'floral-dream-1': {
    id: 'floral-dream-1', name: 'Floral Dream 1',
    category: ['dibujo'], status: 'available', wholesaleAvailable: true,
    price: 120, priceSale: 90, fragile: false,
    dims: { w: 20, h: 27.5, d: 0 }, gsm: 180,
    dimsFramed: { w: 30, h: 40, d: 0 },
    weight: 0.6, productionCost: 4, hoursWorked: 4, framed: 'framed', flatPackable: true,
    materials: 'Pencil and ink on paper 180 gsm',
    images: ['images/dibujo-06.png'],
  },

  'floral-dream-2': {
    id: 'floral-dream-2', name: 'Floral Dream 2',
    category: ['dibujo'], status: 'available', wholesaleAvailable: true,
    price: 90, priceSale: 70, fragile: false,
    dims: { w: 20, h: 27.5, d: 0 }, gsm: 180,
    dimsFramed: { w: 30, h: 40, d: 0 },
    weight: 0.6, framed: 'framed', flatPackable: true, productionCost: 4, hoursWorked: 3,
    materials: 'Pencil and ink on paper 180 gsm',
    images: ['images/dibujo-07.png'],
  },

  master: {
    id: 'master', name: 'Master',
    category: ['dibujo'], status: 'available', wholesaleAvailable: true,
    price: 70, priceSale: 60, fragile: false,
    dims: { w: 21, h: 14, d: 0 }, gsm: 80,
    dimsFramed: { w: 30.5, h: 22, d: 1.4 },
    weight: 0.5, productionCost: 4, hoursWorked: 3, framed: 'framed', flatPackable: true,
    materials: 'Pencil and ink on paper 80 gsm',
    images: ['images/dibujo-02.png'],
  },

  // ─── NUEVOS ────────────────────────────────────────────────────

  newman: {
    id: 'newman', name: 'A New Man', subtitle: 'guardian of inner space',
    category: ['guardians'], status: 'available', wholesaleAvailable: true,
    price: 146, fragile: true,
    dims: { w: 16, h: 35, d: 18 },
    weight: 3.0, productionCost: 10, hoursWorked: 7, packingEfficiency: 0,
    materials: 'Ceramic, textile, acrylic details, semi-matte varnish',
    description: `A New Man reflects on the construction of masculinity in Western culture and imagines the possibility of another configuration of being. The figure appears rigid, pale and unfinished, yet opens to reveal an interior where plants and flowers emerge in vivid contrast.

What happens when softness, vulnerability and inner life are suppressed in favor of performance, strength and protection? This work proposes that when this armor breaks, it is not the self that collapses, but a fiction. What appears through the crack is not purity or an essential truth, but space: space to listen, to transform, and to inhabit oneself with greater honesty.

For indoor use only.`,
    images: [
      'images/newman-01.png','images/newman-02.png','images/newman-03.png',
      'images/newman-04.png','images/newman-05.png','images/newman-06.png',
      'images/newman-07.png',
    ],
  },



  'night-owl': {
    id: 'night-owl', name: 'Night Owl', subtitle: 'wall art collection',
    category: ['wallart'], status: 'available',
    price: 48, fragile: true,
    dims: { w: 19, h: 31, d: 3 },
    dimsCompact: { w: 19, h: 19, d: 3 },
    weight: 0.5, packingEfficiency: 0.85, flatPackable: true,
    productionCost: 3, hoursWorked: 3,
    wholesaleAvailable: true,
    materials: 'Ceramic, bright glaze, underglazes and textile details',
    images: ['images/nightowl-01.png', 'images/nightowl-02.png', 'images/nightowl-03.png', 'images/nightowl-04.png'],
  },

  'the-eye': {
    id: 'the-eye', name: 'The Eye', subtitle: 'wall art collection',
    category: ['wallart'], status: 'available',
    price: 42, fragile: true,
    dims: { w: 19, h: 19, d: 1.5 },
    weight: 0.5, packingEfficiency: 0.85, flatPackable: true,
    productionCost: 3, hoursWorked: 3,
    wholesaleAvailable: true,
    materials: 'Ceramic, bright glaze, underglazes, metal and textile details',
    images: ['images/eye-01.png', 'images/eye-02.png', 'images/eye-03.png', 'images/eye-04.png', 'images/eye-05.png'],
  },

  // ─── VENDIDO ───────────────────────────────────────────────────


  breathingdeeply: {
    id: 'breathingdeeply', name: 'Breathing Deeply', subtitle: 'Silence is part of music',
    category: ['macetas'], status: 'sold',
    price: 78, fragile: true, productionCost: 10, hoursWorked: 6,
    dims: null,
    weight: null,
    materials: 'Ceramic',
    description: `There is something paradoxically beautiful in the way we connect with others and with the world around us when we allow ourselves to disconnect from the symbolic universe we have built as humans. Beyond the structures of civilization lies a reality that is not separate from us but makes everything else possible: rich, silent, alive. Silence is part of music. This shaman invites us to pause — perhaps to disconnect, or perhaps to finally connect. We are more than humans, we are animals. Breath.

For indoor use only.`,
    images: [
      'images/breathingdeeply-01.png','images/breathingdeeply-02.png',
      'images/breathingdeeply-03.png','images/breathingdeeply-04.png',
      'images/breathingdeeply-05.png',
    ],
  },

  amazona: {
    id: 'amazona', name: 'Amazona', subtitle: 'cosmic feminine mystery',
    category: ['macetas'], status: 'sold',
    price: 97, fragile: true,
    dims: { w: 18, h: 15.5, d: 18 },
    weight: 1.28, productionCost: 10, hoursWorked: 8,
    materials: 'Ceramic',
    description: `She embodies the feminine with grace, with power, carrying an ancient energy that feels almost otherworldly. Amazona is a creature from another planet, for the feminine has been so long disqualified in this one that when it rises within us, it feels like a hidden, distant, precious force. Surrounded by petals, she watches us, studies us, and invites us to question the feminine — what it means, what it hides, and what it holds. She is both the question and the answer, a cosmic reminder of the strength and beauty that lie within the feminine mystery.`,
    images: ['images/amazona-01.png','images/amazona-02.png','images/amazona-03.png','images/amazona-04.png'],
  },

};

const PRODUCT_ORDER = [
  'thewalk','bird','mistify',
  'candle-cat','candle-freckles','gaze','heartandfox',
  'ariadna','zaira','juana','mara','lunar','marina','salamanca','trina','amalia',
  'carnival','traveler','gibran','totem',
  'wait','marea','pivot','whispers','horizons','encuentro','confluence','dreams',
  'newman','snake-heart-flam-1','night-owl','the-eye','bright-star-1','floral-dream-1','floral-dream-2','master','breathingdeeply','amazona',
];

// ── Dynamic sort order ──────────────────────────────────────────
// Sculptures (3D pieces) first, then paintings/drawings (2D pieces).
// Within each group, sorted by price ascending (cheapest first).

const PAINTING_CATEGORIES = ['cuadros', 'dibujo'];

function isPainting(product) {
  return (product.category || []).some(c => PAINTING_CATEGORIES.includes(c));
}

function getSortedProductOrder() {
  const ids = Object.keys(PRODUCTS).filter(id => PRODUCTS[id].status !== 'sold');

  const sculptures = ids.filter(id => !isPainting(PRODUCTS[id]));
  const paintings  = ids.filter(id => isPainting(PRODUCTS[id]));

  const byPrice = (a, b) => {
    const pa = PRODUCTS[a].priceSale ?? PRODUCTS[a].price ?? 0;
    const pb = PRODUCTS[b].priceSale ?? PRODUCTS[b].price ?? 0;
    return pa - pb;
  };

  sculptures.sort(byPrice);
  paintings.sort(byPrice);

  const soldIds = Object.keys(PRODUCTS).filter(id => PRODUCTS[id].status === 'sold');

  return [...sculptures, ...paintings, ...soldIds];
}