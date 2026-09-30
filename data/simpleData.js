/**
 * Aura Global - Master Mock & Simple Data Catalog
 * Multi-store isolated catalog for Aura Specialty Coffee, Aura Artisan Bakery, and Aura Botanical Lounge
 */

const stores = [
  {
    id: 1,
    biller_id: 1,
    name: "Aura Specialty Coffee",
    company: "Aura Specialty Coffee Co., Ltd.",
    slug: "sbc-store",
    tagline: "Artisan Highland Roasts & Specialty Espresso",
    description: "Ethically sourced direct-trade beans from Mondulkiri & Vietnamese highlands, roasted in small batches.",
    address: "No. 128, Preah Norodom Blvd, Daun Penh, Phnom Penh",
    phone: "+855 12 345 678",
    email: "coffee@auraglobal.com",
    currency_code: "USD",
    currency_symbol: "$",
    logo: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80",
    banner: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
    theme_color: "#1e3a8a",
    is_active: 1,
    is_open: true,
    telegram_group_id: process.env.TELEGRAM_GROUP_CHAT_ID || null,
    telegram_group_name: "Aura Coffee Orders (Barista Team)",
    operating_hours: "6:30 AM - 8:30 PM",
    rating: 4.9
  },
  {
    id: 2,
    biller_id: 2,
    name: "Aura Artisan Bakery",
    company: "Aura Artisan Bakery & Viennoiserie",
    slug: "aura-bakery",
    tagline: "Authentic French Sourdough & Golden Croissants",
    description: "Artisanal bakery crafting slow-fermented sourdough, flaky French butter croissants, and seasonal pastries.",
    address: "Street 240, Daun Penh, Phnom Penh",
    phone: "+855 12 345 679",
    email: "bakery@auraglobal.com",
    currency_code: "USD",
    currency_symbol: "$",
    logo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80",
    banner: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80",
    theme_color: "#b45309",
    is_active: 1,
    is_open: true,
    telegram_group_id: process.env.TELEGRAM_GROUP_CHAT_ID || null,
    telegram_group_name: "Aura Bakery Kitchen (Orders)",
    operating_hours: "7:00 AM - 7:00 PM",
    rating: 4.8
  },
  {
    id: 3,
    biller_id: 3,
    name: "Aura Botanical Lounge",
    company: "Aura Botanical Tea & Wellness Lounge",
    slug: "aura-lounge",
    tagline: "Single-Estate Teas, Ceremonial Uji Matcha & Cascara",
    description: "Serene garden teahouse offering shade-grown Japanese matcha, cold cascara infusions, and botanical tonics.",
    address: "Street 302, BKK1, Phnom Penh",
    phone: "+855 12 345 680",
    email: "lounge@auraglobal.com",
    currency_code: "USD",
    currency_symbol: "$",
    logo: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=300&q=80",
    banner: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
    theme_color: "#047857",
    is_active: 1,
    is_open: true,
    telegram_group_id: process.env.TELEGRAM_GROUP_CHAT_ID || null,
    telegram_group_name: "Aura Lounge Orders (Tea Masters)",
    operating_hours: "8:00 AM - 9:00 PM",
    rating: 4.9
  }
];

const categories = [
  {
    id: 1,
    code: "CAT-HOT",
    name: "Hot Specialty Coffee",
    description: "Freshly pulled double espresso drinks and slow pour-overs",
    status: 1
  },
  {
    id: 2,
    code: "CAT-ICE",
    name: "Iced & Cold Brews",
    description: "Chilled espresso, nitrogen infused cold brews, and iced lattes",
    status: 1
  },
  {
    id: 3,
    code: "CAT-BAK",
    name: "Viennoiserie & Pastries",
    description: "French butter croissants, Danish pastries, and pain au chocolat",
    status: 1
  },
  {
    id: 4,
    code: "CAT-BRU",
    name: "Artisan Sourdough & Brunch",
    description: "Naturally leavened artisan sourdough loaves, toasts, and sandwiches",
    status: 1
  },
  {
    id: 5,
    code: "CAT-TEA",
    name: "Botanical Teas & Matcha",
    description: "Ceremonial Uji matcha, cascara berry infusions, and floral herbal teas",
    status: 1
  },
  {
    id: 6,
    code: "CAT-BEAN",
    name: "Highland Roasted Beans",
    description: "Direct-trade 250g whole bean bags roasted locally for home brewing",
    status: 1
  }
];

const products = [
  // --- Store 1: Aura Specialty Coffee ---
  {
    id: 1,
    biller_id: 1,
    category_id: 2,
    code: "PRD-COF-01",
    name: "Spanish Iced Latte",
    price: 4.25,
    unit: 1,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
    details: "Signature double shot highland espresso shaken with condensed milk and velvety fresh milk over crystalline ice.",
    options: [
      {
        name: "Size",
        choices: [
          { label: "Regular (12oz)", priceDelta: 0 },
          { label: "Large (16oz)", priceDelta: 0.75 }
        ]
      },
      {
        name: "Ice Level",
        choices: [
          { label: "Normal Ice", priceDelta: 0 },
          { label: "Less Ice", priceDelta: 0 },
          { label: "No Ice", priceDelta: 0 }
        ]
      },
      {
        name: "Milk Choice",
        choices: [
          { label: "Fresh Cow Milk", priceDelta: 0 },
          { label: "Oat Milk (Barista Blend)", priceDelta: 0.60 },
          { label: "Almond Milk", priceDelta: 0.60 }
        ]
      }
    ]
  },
  {
    id: 2,
    biller_id: 1,
    category_id: 1,
    code: "PRD-COF-02",
    name: "Mondulkiri Hand Pour-Over (V60)",
    price: 4.50,
    unit: 1,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    details: "Single-origin Arabica from Bousra, Mondulkiri. Delicate notes of dark chocolate, star anise, and citrus blossom.",
    options: [
      {
        name: "Roast Profile",
        choices: [
          { label: "Light Roast (Floral & Bright)", priceDelta: 0 },
          { label: "Medium Roast (Chocolate & Nutty)", priceDelta: 0 }
        ]
      },
      {
        name: "Temperature",
        choices: [
          { label: "Hot (93°C)", priceDelta: 0 },
          { label: "Iced Japanese Style", priceDelta: 0.50 }
        ]
      }
    ]
  },
  {
    id: 3,
    biller_id: 1,
    category_id: 1,
    code: "PRD-COF-03",
    name: "Velvet Flat White",
    price: 3.85,
    unit: 1,
    image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80",
    details: "Ristretto double shot folded with silky micro-foam in a 6oz ceramic cup.",
    options: [
      {
        name: "Milk Choice",
        choices: [
          { label: "Standard Whole Milk", priceDelta: 0 },
          { label: "Oat Milk (Barista Blend)", priceDelta: 0.60 },
          { label: "Soy Milk", priceDelta: 0.50 }
        ]
      }
    ]
  },
  {
    id: 4,
    biller_id: 1,
    category_id: 2,
    code: "PRD-COF-04",
    name: "Cascara Sparkling Cold Brew",
    price: 4.00,
    unit: 1,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
    details: "Slow cold-steeped coffee cherry husks carbonated with tonic water and a twist of fresh Kampot lime.",
    options: [
      {
        name: "Sweetness",
        choices: [
          { label: "Zero Sugar", priceDelta: 0 },
          { label: "Half Sweet", priceDelta: 0 },
          { label: "Standard Sweetness", priceDelta: 0 }
        ]
      }
    ]
  },
  {
    id: 5,
    biller_id: 1,
    category_id: 3,
    code: "PRD-BAK-01",
    name: "Golden Almond Croissant",
    price: 3.75,
    unit: 1,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    details: "Twice-baked butter croissant generously filled with house almond frangipane and topped with toasted almond flakes.",
    options: [
      {
        name: "Preparation",
        choices: [
          { label: "Warmed Up", priceDelta: 0 },
          { label: "As Is", priceDelta: 0 }
        ]
      }
    ]
  },
  {
    id: 12,
    biller_id: 1,
    category_id: 6,
    code: "PRD-BEAN-01",
    name: "Mondulkiri Highlands Reserve (250g)",
    price: 11.50,
    unit: 1,
    image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80",
    details: "Whole beans roasted weekly in Phnom Penh. Flavor profile: Dark cocoa, hazelnut, sweet wild honey.",
    options: [
      {
        name: "Grind",
        choices: [
          { label: "Whole Beans (Unground)", priceDelta: 0 },
          { label: "Espresso Grind (Fine)", priceDelta: 0 },
          { label: "Pour Over / Filter (Medium)", priceDelta: 0 },
          { label: "French Press (Coarse)", priceDelta: 0 }
        ]
      }
    ]
  },

  // --- Store 2: Aura Artisan Bakery ---
  {
    id: 6,
    biller_id: 2,
    category_id: 3,
    code: "PRD-BAK-02",
    name: "Pain au Chocolat (Dark Belgian)",
    price: 3.50,
    unit: 1,
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&q=80",
    details: "Layers of caramelized laminated pastry wrapped around two batons of 64% single-origin Belgian dark chocolate.",
    options: [
      {
        name: "Preparation",
        choices: [
          { label: "Warmed Up", priceDelta: 0 },
          { label: "As Is", priceDelta: 0 }
        ]
      }
    ]
  },
  {
    id: 7,
    biller_id: 2,
    category_id: 4,
    code: "PRD-BAK-03",
    name: "Country Sourdough Loaf (800g)",
    price: 5.50,
    unit: 1,
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80",
    details: "Naturally fermented for 36 hours with our 7-year heirloom wild sourdough starter. Crackling blistered crust with airy crumb.",
    options: [
      {
        name: "Slicing",
        choices: [
          { label: "Sliced (Toast thickness)", priceDelta: 0 },
          { label: "Whole Loaf (Uncut)", priceDelta: 0 }
        ]
      }
    ]
  },
  {
    id: 8,
    biller_id: 2,
    category_id: 4,
    code: "PRD-BAK-04",
    name: "Smoked Salmon & Ricotta Sourdough Toast",
    price: 7.50,
    unit: 1,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
    details: "Toasted country sourdough topped with whipped herb ricotta, wild Norwegian smoked salmon, caper berries, and pickled shallots.",
    options: [
      {
        name: "Egg Topping",
        choices: [
          { label: "No Egg", priceDelta: 0 },
          { label: "Add Poached Organic Egg", priceDelta: 1.25 }
        ]
      }
    ]
  },
  {
    id: 9,
    biller_id: 2,
    category_id: 3,
    code: "PRD-BAK-05",
    name: "Pistachio Raspberry Cruffin",
    price: 4.25,
    unit: 1,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    details: "Croissant dough baked in a muffin tin, piped with Sicilian pistachio creme patissiere and tart raspberry coulis.",
    options: [
      {
        name: "Preparation",
        choices: [
          { label: "As Is", priceDelta: 0 }
        ]
      }
    ]
  },

  // --- Store 3: Aura Botanical Lounge ---
  {
    id: 10,
    biller_id: 3,
    category_id: 5,
    code: "PRD-TEA-01",
    name: "Ceremonial Uji Matcha Latte",
    price: 4.75,
    unit: 1,
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
    details: "First-harvest ceremonial grade matcha from Uji, Kyoto. Whisked by hand with bamboo chasen and steamed oat milk.",
    options: [
      {
        name: "Temperature",
        choices: [
          { label: "Hot (Velvety Steamed)", priceDelta: 0 },
          { label: "Iced with Cold Foam", priceDelta: 0.50 }
        ]
      },
      {
        name: "Sweetness",
        choices: [
          { label: "Unsweetened (Pure Matcha)", priceDelta: 0 },
          { label: "Subtle Raw Honey", priceDelta: 0.25 },
          { label: "Standard Sweetness", priceDelta: 0 }
        ]
      }
    ]
  },
  {
    id: 11,
    biller_id: 3,
    category_id: 5,
    code: "PRD-TEA-02",
    name: "Wild Jasmine Silver Needle Infusion",
    price: 4.25,
    unit: 1,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    details: "Spring white tea scented naturally over five consecutive nights with fresh nocturnal jasmine blossoms.",
    options: [
      {
        name: "Serving Style",
        choices: [
          { label: "Glass Pot (Multiple Steeps)", priceDelta: 0 },
          { label: "Cold Steeped Over Ice", priceDelta: 0.50 }
        ]
      }
    ]
  }
];

module.exports = {
  stores,
  categories,
  products
};
