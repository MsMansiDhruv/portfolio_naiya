export interface ProjectCaseStudy {
  id: string
  number: string
  title: string
  category: string
  tagline: string
  year: string
  role: string
  description: string
  coverImage: string
  accentColor: string
  detailCrops: string[]
  packagingMockup?: string
  typographySpecs: {
    typeface: string
    weights: string
    concept: string
  }
  processFragments: string[]
  deliverables: string[]

  // Legacy fields for backward compatibility
  cover: string
  client?: string
  summary?: string
  accent?: string
  blurb?: string
  gallery: string[]
  story?: any[]
  storyBeats?: any[]
  object?: string
  thesis?: string
  span?: string
  hotspots?: any[]
  kind: string
  note?: string
  caption?: string
}

export type WorkPiece = ProjectCaseStudy
export type CraftPiece = ProjectCaseStudy

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  company: string
  tag?: string
  rating?: number
}

export const PORTFOLIO_PROJECTS: ProjectCaseStudy[] = [
  {
    id: 'social-media',
    number: '01',
    title: 'Social Media',
    category: 'Social Media',
    tagline: 'Campaign creatives, social feed carousels, and paid ad sets.',
    year: '2025',
    role: 'Visual Designer',
    description: 'Campaign creatives, luxury lighting & interior showcases, specialty coffee branding, and performance ad sets designed for VI Oil, Light Lounge (Patel Electrical Co.), Brown Mule Coffee, and ANKPAL across Instagram and Meta campaigns. Built with clear type hierarchy, vivid composition, and strong visual hooks.',
    coverImage: '/work/vi/vi-social-jalebi-fafda-card.jpg',
    cover: '/work/vi/vi-social-jalebi-fafda-card.jpg',
    accentColor: '#F59E0B',
    kind: 'SOCIAL MEDIA',
    detailCrops: [
      '/work/vi/vi-social-jalebi-fafda.jpg',
      '/work/vi/vi-social-oil-benefits-splash.jpg',
      '/work/vi/vi-social-mirror-peanuts.jpg',
      '/work/social/light-lounge-living-room.jpg',
      '/work/social/brown-mule-coffee-grit.jpg',
      '/work/social/light-lounge-door-patel.jpg',
      '/work/social/light-lounge-ceiling-fan.jpg',
      '/work/social/brown-mule-coffee.jpg',
      '/work/vi/vi-social-pan-vortex.jpg',
      '/work/vi/vi-social-peanuts.jpg',
    ],
    gallery: [
      '/work/vi/vi-social-jalebi-fafda.jpg',
      '/work/vi/vi-social-oil-benefits-splash.jpg',
      '/work/vi/vi-social-mirror-peanuts.jpg',
      '/work/social/light-lounge-living-room.jpg',
      '/work/social/brown-mule-coffee-grit.jpg',
      '/work/social/light-lounge-door-patel.jpg',
      '/work/social/light-lounge-ceiling-fan.jpg',
      '/work/social/brown-mule-coffee.jpg',
      '/work/vi/vi-social-pan-vortex.jpg',
      '/work/vi/vi-social-peanuts.jpg',
      '/work/vi/vi-social-cabinet.jpg',
      '/work/vi/vi-social-couple.jpg',
      '/work/vi/vi-social-spices-kitchen.jpg',
      '/work/ankpal/meta ads/social-visibility.jpg',
      '/work/ankpal/meta ads/meta-ad-systems.jpg',
    ],
    typographySpecs: {
      typeface: 'Söhne + Inter',
      weights: 'Bold (700) / Black (900)',
      concept: 'High-contrast typography for quick mobile reading.',
    },
    processFragments: [
      'Visual hook and layout ideation',
      'Carousel pacing and slide structures',
      'Multi-size asset export (1:1, 4:5, 9:16)',
    ],
    deliverables: [
      'Ad Creative Sets',
      'Feed Carousels & Graphics',
      'Marketing Banners',
    ],
  },
  {
    id: 'print-media',
    number: '02',
    title: 'Print Media',
    category: 'Print Media',
    tagline: 'Corporate product flyers, exhibition stall backdrops, and marketing banners.',
    year: '2025',
    role: 'Graphic Designer',
    description: 'Corporate product flyers, dual-sided marketing brochures, large-format exhibition stall backdrops, and partner banners designed for ANKPAL AI-ERP and Parmanand Group. Engineered with clear information architecture, high-impact branding, and press-ready CMYK print files.',
    coverImage: '/work/flyers/ankpal-fmcg-flyer-01.jpg',
    cover: '/work/flyers/ankpal-fmcg-flyer-01.jpg',
    accentColor: '#0ea5e9',
    kind: 'PRINT MEDIA',
    detailCrops: [
      '/work/flyers/ankpal-fmcg-flyer-01.jpg',
      '/work/flyers/ankpal-genie-flyer-01.jpg',
      '/work/print/parmanand-stall-backdrop.jpg',
      '/work/print/ankpal-banner-standee.jpg',
      '/work/print/ankpal-banner-horizontal.jpg',
    ],
    gallery: [
      '/work/flyers/ankpal-fmcg-flyer-01.jpg',
      '/work/flyers/ankpal-genie-flyer-01.jpg',
      '/work/print/parmanand-stall-backdrop.jpg',
      '/work/print/ankpal-banner-standee.jpg',
      '/work/print/ankpal-banner-horizontal.jpg',
    ],
    typographySpecs: {
      typeface: 'Inter + Söhne',
      weights: 'Bold (700) / Regular (400)',
      concept: 'High-clarity technical typography engineered for print scanning.',
    },
    processFragments: [
      'Visual hierarchy and feature grouping',
      'Custom vector diagrams and feature icons',
      'Dual-sided CMYK press-ready file setup',
    ],
    deliverables: [
      'FMCG Distribution Flyer (Dual-Sided)',
      'Smart ERP Genie Flyer (Dual-Sided)',
      'Stall Backdrop & Standee Banners',
    ],
  },
  {
    id: 'logo-branding',
    number: '03',
    title: 'Logo Design',
    category: 'Logo Design',
    tagline: 'Precision identity marks, joinery systems, and brand architecture for Kyron and Kavach.',
    year: '2024',
    role: 'Brand Designer',
    description: 'Logo mark and brand identity systems engineered for Kyron and Kavach by MD Corp. Crafted conceptual vector marks combining material joinery architecture, negative space letterforms, Hindi typography, and safety shield geometry.',
    coverImage: '/work/logo/kavach-stationery-cover.jpg',
    cover: '/work/logo/kavach-stationery-cover.jpg',
    accentColor: '#121212',
    kind: 'LOGO DESIGN',
    detailCrops: [
      '/work/logo/kyron-logo-concept.jpg',
      '/work/logo/kavach-logo-meaning.jpg',
    ],
    gallery: [
      '/work/logo/kyron-logo-concept.jpg',
      '/work/logo/kavach-logo-meaning.jpg',
    ],
    typographySpecs: {
      typeface: 'Custom Logotype + Geometric Sans',
      weights: 'Regular (400) / Semibold (600)',
      concept: 'Geometric precision fused with architectural letterforms.',
    },
    processFragments: [
      'Concept exploration (Kyron Panel Joinery & Kavach Shield)',
      'Vector geometry, negative space, and symmetry construction',
      'Brand guideline sheet and visual applications',
    ],
    deliverables: [
      'Kyron - Concept 01 The Join (Negative Space K)',
      'Kavach - Logo Meaning & Hindi Construction System',
      'Brand Identity Guidelines & Vector Assets',
    ],
  },
  {
    id: 'packaging-architecture',
    number: '04',
    title: 'Packaging',
    category: 'Packaging',
    tagline: 'Macro Fuel nutrition jars, Blentree spice boxes, and Vadhiyar agricultural seed pouches.',
    year: '2025',
    role: 'Packaging Designer',
    description: 'Complete retail packaging and dieline engineering for Macro Fuel creatine & whey protein nutrition supplement jars, Blentree Ready-to-Cook spice boxes, and Vadhiyar hybrid seed pouch systems. Engineered for high retail shelf impact, clear culinary & nutritional hierarchy, and 100% press-ready print production.',
    coverImage: '/work/macrofuel/macrofuel-creatine-single-jar.jpg',
    cover: '/work/macrofuel/macrofuel-creatine-single-jar.jpg',
    accentColor: '#D4AF37',
    kind: 'PACKAGING',
    detailCrops: [
      '/work/macrofuel/macrofuel-creatine-single-jar.jpg',
      '/work/packaging/blentree-fish-curry-box.jpg',
      '/work/macrofuel/macrofuel-opt-01.jpg',
      '/work/macrofuel/macrofuel-whey-jars.jpg',
      '/work/vadiyar/vadhiyar-mustard-pouch.jpg',
      '/work/vadiyar/vadhiyar-carom-pouch.jpg',
      '/work/vadiyar/vadhiyar-guar-pouch.jpg',
    ],
    gallery: [
      '/work/macrofuel/macrofuel-creatine-single-jar.jpg',
      '/work/packaging/blentree-fish-curry-box.jpg',
      '/work/macrofuel/macrofuel-opt-01.jpg',
      '/work/macrofuel/macrofuel-whey-jars.jpg',
      '/work/vadiyar/vadhiyar-mustard-pouch.jpg',
      '/work/vadiyar/vadhiyar-carom-pouch.jpg',
      '/work/vadiyar/vadhiyar-guar-pouch.jpg',
    ],
    packagingMockup: '/work/macrofuel/macrofuel-creatine-single-jar.jpg',
    typographySpecs: {
      typeface: 'Grotesk + Classic Serif',
      weights: 'Regular (400) / Medium (500)',
      concept: 'Clear hierarchy for shelf distinction and legal text.',
    },
    processFragments: [
      'Dieline layout and panel planning',
      'Nutritional facts and label hierarchy',
      'Color separation and press-ready files',
    ],
    deliverables: [
      'Macro Fuel Retail Box & Dieline Production Specs',
      'Blentree Ready-to-Cook Fish Curry Masala Box',
      'Macro Fuel Creatine & Whey Protein Jars',
      'Vadhiyar Hybrid Seed Pouch Line',
    ],
  },
  {
    id: 'pitch-decks',
    number: '05',
    title: 'Pitch Decks',
    category: 'Pitch Decks',
    tagline: 'ANKPAL AI distribution slide systems, investor pitch decks, and data visualization.',
    year: '2024',
    role: 'Presentation Designer',
    description: 'Investor and product presentation design for ANKPAL AI Distribution Management and Speedair logistics. Translated complex workflows, market numbers, and architecture systems into high-impact, structured slide decks.',
    coverImage: '/work/pitch/ankpal-genie-growth-cover.jpg',
    cover: '/work/pitch/ankpal-genie-growth-cover.jpg',
    accentColor: '#121212',
    kind: 'PITCH DECKS',
    detailCrops: [
      '/work/pitch/ankpal-genie-growth-cover.jpg',
      '/work/pitch/ankpal-pitch-systems.jpg',
      '/work/pitch/ankpal-pitch-vc.jpg',
      '/work/pitch/speedair-pitch-deck.jpg',
    ],
    gallery: [
      '/work/pitch/ankpal-genie-growth-cover.jpg',
      '/work/pitch/ankpal-pitch-systems.jpg',
      '/work/pitch/ankpal-pitch-vc.jpg',
      '/work/pitch/speedair-pitch-deck.jpg',
    ],
    typographySpecs: {
      typeface: 'Inter Display',
      weights: 'Medium (500) / Bold (700)',
      concept: 'Clean presentation typography designed for readability.',
    },
    processFragments: [
      'Slide flow and information structure',
      'Custom chart and infographic design',
      'Template slides and master layout',
    ],
    deliverables: [
      'ANKPAL AI Distribution Pitch Deck',
      'Investor Presentation Slides',
      'Data Visuals & Service Infographics',
    ],
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote: 'Naiya delivered complete retail packaging and label systems on tight deadlines. The dielines were flawless and went straight to print production.',
    author: 'Anonymous',
    role: 'Brand Founder',
    company: 'FMCG Retail Line',
    tag: 'PACKAGING & PRINT',
    rating: 5,
  },
  {
    id: 't2',
    quote: 'Exceptional attention to typographic grids, packaging layouts, and vector artwork. An absolute pleasure to collaborate with.',
    author: 'Colleague',
    role: 'Senior Product Designer',
    company: 'Design Team Collaborator',
    tag: 'BRAND & COLLABORATION',
    rating: 5,
  },
  {
    id: 't3',
    quote: 'Her pitch deck design transformed our presentations. Structured, clean, and delivered with great design clarity.',
    author: 'Anonymous',
    role: 'Marketing Lead',
    company: 'SaaS Enterprise',
    tag: 'PITCH & STRATEGY',
    rating: 5,
  },
]

export const SELECTED_WORK = PORTFOLIO_PROJECTS

export const CRAFT_STUDIO = PORTFOLIO_PROJECTS

export const CAPABILITIES_LIST = [
  {
    label: 'Packaging & Labels',
    title: 'Packaging & Labels',
    desc: 'Retail pouches, bottle labels, and product line systems.',
    tools: ['Adobe Illustrator', 'Photoshop', 'Dieline Prep'],
  },
  {
    label: 'Logo & Brand Systems',
    title: 'Logo & Brand Systems',
    desc: 'Distinct marks, typography pairings, and brand guides.',
    tools: ['Vector Drafting', 'Typography', 'Color Systems'],
  },
  {
    label: 'Pitch Decks & Presentations',
    title: 'Pitch Decks & Presentations',
    desc: 'Structured slides and financial data visualization.',
    tools: ['PowerPoint', 'Keynote', 'Infographics'],
  },
  {
    label: 'Social & Print Media',
    title: 'Social & Print Media',
    desc: 'Ad creatives, carousels, and luxury print stationery.',
    tools: ['Meta Ads', 'Foil Stamping', 'Layout Design'],
  },
]

export const SERVICES = [
  {
    title: 'Packaging Design',
    desc: 'Retail packaging and labels with complete print specifications.',
    body: 'Retail packaging and labels with complete print specifications.',
  },
  {
    title: 'Brand Identity',
    desc: 'Complete visual systems from logo marks to brand guides.',
    body: 'Complete visual systems from logo marks to brand guides.',
  },
  {
    title: 'Presentation Design',
    desc: 'Investor-ready pitch decks and narrative slide systems.',
    body: 'Investor-ready pitch decks and narrative slide systems.',
  },
]

export const PROCESS_STEPS = [
  {
    n: '01',
    num: '01',
    title: 'Discover & Understand',
    desc: 'Understanding the core problem, target audience, and constraints.',
    body: 'Understanding the core problem, target audience, and constraints.',
  },
  {
    n: '02',
    num: '02',
    title: 'Design & Iterate',
    desc: 'Exploring concepts, pairing type, and refining layouts.',
    body: 'Exploring concepts, pairing type, and refining layouts.',
  },
  {
    n: '03',
    num: '03',
    title: 'Prepare & Deliver',
    desc: 'Delivering press-ready print files and organized digital assets.',
    body: 'Delivering press-ready print files and organized digital assets.',
  },
]

export const STUDIO_ATMOSPHERE = {
  status: 'Available for Select Projects',
  location: 'Gujarat, India',
  role: 'Graphic Designer',
  toolkitWave: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'Figma', 'Print Dielines'],
}

