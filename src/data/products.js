// Single source of truth for everything the site says about the brand, its
// three products, packs, prices and contact details. All figures were taken
// from the existing store at ezmassager.co.za (prices in South African Rand).

export const brand = {
  name: 'EZ Massager',
  legalName: 'EZ Massager Global (Pty) Ltd',
  tagline: "South Africa's Best Muscle Recovery Product",
  storeUrl: 'https://ezmassager.co.za',
  email: 'Mandy@ezmassager.co.za',
  phone: '+27 79 513 7438',
  phoneDisplay: '079 513 7438',
  address: '1 Riverhorse Close, Newlands East, Durban, KwaZulu-Natal, 4001, South Africa',
  social: {
    instagram: 'https://instagram.com/ez_massager',
    facebook: 'https://www.facebook.com/EZMassagerSA/',
  },
  stockistsUrl: 'https://ezmassager.co.za/pages/store-locator',
  blogUrl: 'https://ezmassager.co.za/blogs/ez-blog',
  deliveryNote: 'Free delivery in South Africa. We also ship to the USA, Australia and the UK.',
};

/** @typedef {'original' | 'extra' | 'plant'} ProductId */

/**
 * @typedef {Object} Product
 * @property {ProductId} id
 * @property {string} slug            URL segment used for the product page
 * @property {string} name            Short display name
 * @property {string} fullName        Name as sold on the store
 * @property {string} strength        Headline active
 * @property {string} kicker          Two-word positioning line
 * @property {string} tagline
 * @property {string} summary
 * @property {string[]} description   Paragraphs from the store listing
 * @property {string[]} formula       Ingredients in this variant
 * @property {number} price           ZAR
 * @property {string} sku
 * @property {string} size
 * @property {{name:string, hex:string, deep:string, tint:string, ink:string, glow:string, button:string, onButton:string}} colour
 * @property {string} image
 * @property {string} imagePng
 * @property {string[]} gallery
 * @property {string} model           GLB generated from the product photo
 * @property {string} handle          Store handle
 * @property {number} variantId       Store variant id (used for the checkout link)
 * @property {string} packId          Related 3-pack
 * @property {string} [note]
 */

/** @type {Product[]} */
export const products = [
  {
    id: 'original',
    slug: 'original-2-menthol',
    name: 'Original',
    fullName: 'Original 2% Menthol',
    strength: '2% Menthol',
    kicker: 'Everyday relief',
    tagline: 'Proven relief that thousands reach for daily.',
    summary:
      'A soothing blend of 2% Menthol and Arnica oil, rolled deep into muscles and joints for instant relief from everyday aches and pains.',
    description: [
      'Opt for proven relief that thousands reach for daily. EZ Massager Original delivers a soothing blend of 2% Menthol and Arnica oil deep into the muscles and joints for instant relief from aches and pains.',
    ],
    formula: ['Arnica oil', '2% Menthol', 'Gingko', 'Thymus', 'Ginseng Root'],
    price: 160,
    sku: 'EZ 2%',
    size: '100ml',
    colour: { name: 'Sun Yellow', hex: '#F2C400', deep: '#B08C00', tint: '#FFF1A8', ink: '#1C1600', glow: '#FFD84D', button: '#F2C400', onButton: '#1C1600' },
    image: '/images/products/original-2-menthol.webp',
    imagePng: '/images/products/original-2-menthol.png',
    gallery: ['/images/products/original-2-menthol-alt-1.webp', '/images/products/original-2-menthol-alt-2.webp'],
    model: '/models/original-2-menthol.glb',
    handle: 'ez-massager-original-2-menthol',
    variantId: 22534121160786,
    packId: 'pack-3x-original',
  },
  {
    id: 'extra',
    slug: 'extra-strength-4-menthol',
    name: 'Extra Strength',
    fullName: 'Extra Strength 4% Menthol',
    strength: '4% Menthol',
    kicker: 'Double the punch',
    tagline: 'An extra punch of relief for the most stubborn aches.',
    summary:
      'An intense blend of 4% Menthol and Arnica oil, delivered deep into muscles for instant relief from the most stubborn aches and pains.',
    description: [
      'Sometimes you need an extra punch of relief for aching muscles and joints. EZ Massager Extra Strength delivers an intense blend of 4% Menthol and Arnica oil deep into muscles for instant relief from the most stubborn aches and pains.',
    ],
    formula: ['Arnica oil', '4% Menthol', 'Gingko', 'Thymus', 'Ginseng Root'],
    price: 165,
    sku: 'EZ 4%',
    size: '100ml',
    colour: { name: 'Ember Red', hex: '#E2141F', deep: '#9E0D14', tint: '#FFDCDE', ink: '#1F0405', glow: '#FF4A52', button: '#D8121C', onButton: '#FFFFFF' },
    image: '/images/products/extra-strength-4-menthol.webp',
    imagePng: '/images/products/extra-strength-4-menthol.png',
    gallery: ['/images/products/extra-strength-4-menthol-alt-1.webp', '/images/products/extra-strength-4-menthol-alt-2.webp'],
    model: '/models/extra-strength-4-menthol.glb',
    handle: 'ez-massager-extra-strength-4-menthol',
    variantId: 22534129877074,
    packId: 'pack-3x-extra',
  },
  {
    id: 'plant',
    slug: 'arnica-natural-organic-plant-oil',
    name: 'Arnica + Plant Oil',
    fullName: 'Arnica + Natural Organic Plant Oil',
    strength: '1% Natural Organic Plant Oil',
    kicker: 'Inflammation game-changer',
    tagline: 'Meet your inflammation game-changer.',
    summary:
      'Arnica plus 1% Natural Organic Plant Oil, one of the most powerful anti-inflammatory supplements available, to ease inflammation, reduce muscle spasms and relieve pain.',
    description: [
      'Introducing EZ Massager Natural Organic Plant Oil. Heal tired sore muscles, arthritis, bruises, cramps, sprains and more with the combination of dual massage rollers and Arnica plus 1% Natural Organic Plant Oil.',
      'Thought to be one of the most powerful anti-inflammatory supplements on the market today, natural organic plant oil is known to ease inflammation, reduce muscle spasms, and relieve pain and anxiety. It serves as a powerful supplement for avid exercisers to include in their overall active lifestyles.',
    ],
    formula: ['Arnica oil', '1% Natural Organic Plant Oil', 'Gingko', 'Thymus', 'Ginseng Root'],
    price: 195,
    sku: 'EZ C',
    size: '100ml',
    colour: { name: 'Leaf Green', hex: '#4FA34A', deep: '#2E6F2B', tint: '#DCEFD6', ink: '#0B1A0A', glow: '#7ED276', button: '#2F7A2C', onButton: '#FFFFFF' },
    image: '/images/products/arnica-natural-organic-plant-oil.webp',
    imagePng: '/images/products/arnica-natural-organic-plant-oil.png',
    gallery: ['/images/site/plant-oil-lifestyle.webp', '/images/products/pack-3x-arnica-natural-organic-plant-oil.webp'],
    model: '/models/arnica-natural-organic-plant-oil.glb',
    handle: 'arnica-natural-organic-plant',
    variantId: 32258458222674,
    packId: 'pack-3x-plant',
    note: 'This product does not contain psychoactive ingredients and cannot penetrate the bloodstream.',
  },
];

/** Product details shared by every variant (verbatim from the store listings). */
export const productDetails = [
  { title: 'Patented Dual Massage Rollers', body: 'These allow for effective, single-handed massage without exerting pressure.' },
  { title: 'EZ Grip Container', body: 'This ensures even, mess-free and capped distribution of gel during the massage.' },
  { title: 'Unique Formulation', body: 'Arnica oil and the active are complemented with further healing ingredients: Gingko, Thymus and Ginseng Root.' },
  { title: '100ml Container', body: 'Ideal for travelling or popping into the gym or school bags.' },
];

export const idealFor = [
  'General aches and pains',
  'Muscle and joint pain',
  'Those recovering from injury',
  'Individuals with chronic pain',
  'Athletes',
  'Arthritis',
  'Bed-bound and wheelchair patients',
  'Diabetes (improves circulation)',
  'Pregnancy and labour pains',
  'Tired, swollen feet',
  'Travelling aches, pains and swelling',
];

/**
 * @typedef {Object} Pack
 * @property {string} id
 * @property {'value' | 'bulk'} kind
 * @property {string} name
 * @property {string} contents
 * @property {number} price
 * @property {number | null} compareAt
 * @property {string} image
 * @property {string} handle
 * @property {number} variantId
 * @property {ProductId[]} colours   Which variants are inside (drives the colour dots)
 */

/** @type {Pack[]} */
export const packs = [
  {
    id: 'pack-3x-original',
    kind: 'value',
    name: '3 Pack | Original 2% Menthol',
    contents: 'Three Original 2% Menthol massagers',
    price: 420,
    compareAt: 447,
    image: '/images/products/pack-3x-original-2-menthol.webp',
    handle: 'original-2-menthol-3-pack',
    variantId: 22534124601426,
    colours: ['original', 'original', 'original'],
  },
  {
    id: 'pack-3x-extra',
    kind: 'value',
    name: '3 Pack | Extra Strength 4% Menthol',
    contents: 'Three Extra Strength 4% Menthol massagers',
    price: 447,
    compareAt: null,
    image: '/images/products/pack-3x-extra-strength-4-menthol.webp',
    handle: 'extra-strength-4-menthol-3-pack',
    variantId: 22534136234066,
    colours: ['extra', 'extra', 'extra'],
  },
  {
    id: 'pack-3x-plant',
    kind: 'value',
    name: '3 Pack | Arnica + Natural Organic Plant Oil',
    contents: 'Three Arnica + Natural Organic Plant Oil massagers',
    price: 558,
    compareAt: 585,
    image: '/images/products/pack-3x-arnica-natural-organic-plant-oil.webp',
    handle: 'arnica-natural-organic-plant-oil-3-pack',
    variantId: 32869392154706,
    colours: ['plant', 'plant', 'plant'],
  },
  {
    id: 'pack-3x-variety',
    kind: 'value',
    name: '3 Pack | Variety of Variants',
    contents: 'One of each: Original, Extra Strength and Arnica + Plant Oil',
    price: 466,
    compareAt: 493,
    image: '/images/products/pack-3x-variety.webp',
    handle: 'value-pack-3-variants',
    variantId: 32351820939346,
    colours: ['original', 'extra', 'plant'],
  },
  {
    id: 'pack-6x-variety-2each',
    kind: 'bulk',
    name: '6 Pack | Variety of Variants',
    contents: 'Two of each: Original, Extra Strength and Arnica + Plant Oil',
    price: 720,
    compareAt: 986,
    image: '/images/products/pack-6x-variety-2-each.webp',
    handle: 'variety-bulk-pack-6-x-pack-2-each',
    variantId: 32869249482834,
    colours: ['original', 'original', 'extra', 'extra', 'plant', 'plant'],
  },
  {
    id: 'pack-6x-plant',
    kind: 'bulk',
    name: '6 Pack | Arnica + Natural Organic Plant Oil',
    contents: 'Six Arnica + Natural Organic Plant Oil massagers',
    price: 890,
    compareAt: 1170,
    image: '/images/products/pack-6x-arnica-natural-organic-plant-oil.webp',
    handle: 'bulk-pack-6-x-natural-organic-plant-oil-pack',
    variantId: 32869380587602,
    colours: ['plant', 'plant', 'plant', 'plant', 'plant', 'plant'],
  },
  {
    id: 'pack-6x-variety-2-4',
    kind: 'bulk',
    name: '6 Pack | Variety of Variants 2% & 4%',
    contents: 'Three Original 2% Menthol and three Extra Strength 4% Menthol',
    price: 620,
    compareAt: 894,
    image: '/images/products/pack-6x-variety-2-and-4.webp',
    handle: 'variety-bulk-pack-6-x-pack-1',
    variantId: 32869368758354,
    colours: ['original', 'original', 'original', 'extra', 'extra', 'extra'],
  },
  {
    id: 'pack-6x-variety-4-plant',
    kind: 'bulk',
    name: '6 Pack | Variety of 4% & Natural Organic Plant Oil',
    contents: 'Three Extra Strength 4% Menthol and three Arnica + Natural Organic Plant Oil',
    price: 750,
    compareAt: 1032,
    image: '/images/products/pack-6x-variety-4-and-plant-oil.webp',
    handle: 'variety-bulk-pack-6-x-pack',
    variantId: 32869377212498,
    colours: ['extra', 'extra', 'extra', 'plant', 'plant', 'plant'],
  },
];

export const ingredients = [
  {
    id: 'arnica',
    name: 'Arnica',
    role: 'Heals and soothes',
    body: 'Reduces swelling, alleviates pain, promotes healing and helps heal bruises.',
    image: '/images/site/ingredient-arnica.webp',
  },
  {
    id: 'menthol',
    name: 'Menthol',
    role: 'Fast, cooling relief',
    body: 'Helps relieve pain caused by muscle strains or sprains, backache, bruising and cramping, as well as arthritis, bursitis and tendonitis.',
    image: '/images/site/ingredient-menthol.webp',
  },
  {
    id: 'ginseng',
    name: 'Ginseng Root',
    role: 'Skin support',
    body: 'Evens skin tone, improves elasticity and carries over 40 antioxidants that prevent free radical damage and the signs of ageing.',
    image: '/images/site/ingredient-ginseng-root.webp',
  },
  {
    id: 'ginkgo',
    name: 'Gingko',
    role: 'Circulation',
    body: 'Improves blood circulation, helping the actives reach overworked muscles faster.',
    image: '/images/site/ingredient-ginkgo.webp',
  },
  {
    id: 'thymus',
    name: 'Thymus',
    role: 'Anti-spasm',
    body: 'Helps to relieve smooth muscle spasms.',
    image: null,
  },
  {
    id: 'plant-oil',
    name: 'Natural Organic Plant Oil',
    role: 'Anti-inflammatory',
    body: 'Acts as a powerful anti-inflammatory, easing inflammation and reducing muscle spasms. Found in the Arnica + Natural Organic Plant Oil variant.',
    image: '/images/site/plant-oil-lifestyle.webp',
  },
];

export const features = [
  {
    id: 'rollers',
    title: 'Patented dual rollers',
    body:
      'Two roller balls sit exactly the right distance apart, so pressure points on the neck, back and along the shoulder blades get a proper massage without you exerting any strength. Rolling increases blood flow to overworked, sore muscles while the gel goes on.',
    image: '/images/products/extra-strength-4-menthol-alt-1.webp',
  },
  {
    id: 'grip',
    title: 'The EZ Grip',
    body:
      'Ergonomically designed for everyone from children to the elderly, including hands with little strength or painful joints. Hold it in one hand, roll it where it hurts, and reach the spots you never could.',
    image: '/images/products/original-2-menthol-alt-1.webp',
  },
  {
    id: 'formula',
    title: 'Mess-free, metered gel',
    body:
      'The container distributes gel evenly until the skin is coated. Then the rollers stop dispensing, so you keep massaging without being drenched in product. Quick-drying Menthol and Arnica oil give long-lasting relief for aches, pains and swelling.',
    image: '/images/products/original-2-menthol-alt-2.webp',
  },
];

export const testimonials = [
  {
    quote:
      "It's about time a company improved the way we apply these products. It is so simple, makes so much sense and my hands don't get messy. I just massage directly into the area that really hurts.",
    name: 'P. Moore',
  },
  {
    quote:
      'I strongly recommend the EZ Massager for sports (or just everyday sore muscles). I plan on having one in transition for my next triathlon. It will be a great mid-race relief to keep me going!',
    name: 'S. Parrode',
  },
  {
    quote:
      "This is exactly what I've been looking for to help with my achilles tendonitis. The rollers fit perfectly around the tendon, glide so smoothly and give an excellent massage. The smell of menthol seems to disappear pretty quickly.",
    name: 'C. Brennan',
  },
];

export const story = {
  short:
    'EZ Massager was born out of complete frustration. After years of suffering muscle pain, John, the designer and inventor, was sick of applying arnica creams with his hands.',
  paragraphs: [
    'EZ Massager was born out of complete frustration. After years of suffering with muscle pain, the late John Taalman was sick of applying creams with his hands. He could not massage deeply enough to ease his pain, and the application of topical creams was messy. He could not find a better solution, so he decided to create one. Now, thanks to John, thousands of people are finding the relief they need.',
    "After a few years, the concept of EZ Massager was revived by John's stepson, Dean Black. After many late nights, long promotions, trial and error and a few helping hands, EZ Massager is well on its way to providing the effective pain relief that John envisioned all those years ago. In everything we do, we aim to help people live pain-free lives.",
  ],
  givingBack:
    'We want to make a difference, not only to you but to the world. We understand that an integral part of making that difference stretches far beyond just helping to roll away the pain, so we actively support the Sinakikele Children Foundation.',
  athletes:
    'We are proud to work with athletes across South Africa, helping them stay pain-free as they pursue their dreams.',
};

export const blogPosts = [
  {
    title: 'The Highlights of the Human Body',
    excerpt:
      'Health and fitness are all the craze. There is a lot of information available on how we can make our bodies healthier and fitter. But what exactly is our body?',
  },
  {
    title: 'Core Strength & Injury Prevention',
    excerpt:
      'If you have ever had an injury, particularly in your lower limbs, you have probably been advised to strengthen your core to aid recovery and prevent re-injury.',
  },
  {
    title: 'Myofascial Release Therapy',
    excerpt:
      'Walk into any gym or studio and there is a good chance there will be a large cylinder of foam somewhere in the room. Here is why.',
  },
];

/** Straight-to-checkout link for a single unit of a store variant. */
export const checkoutUrl = (variantId, quantity = 1) => `${brand.storeUrl}/cart/${variantId}:${quantity}`;
/** Product listing on the existing store. */
export const storeProductUrl = (handle) => `${brand.storeUrl}/products/${handle}`;
/** Format a Rand amount the way the store does (whole Rand, no cents). */
export const rand = (amount) => `R${Math.round(amount).toLocaleString('en-ZA').replace(/,/g, ' ')}`;
export const productById = (id) => products.find((p) => p.id === id);
export const packById = (id) => packs.find((p) => p.id === id);
