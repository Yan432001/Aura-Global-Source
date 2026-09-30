const stores = [
  {
    id: 1,
    name: "SBC Store",
    company: "SBC Fast Food & Cafe Group",
    slug: "sbc-store",
    tagline: "Delicious Fast Food, Juicy Burgers, Crispy Chicken & Shakes",
    description: "Get your favorite fast food delivered to your door. Featuring golden crispy chicken zinger burgers, extra cheesy pizza, hot dogs and milkshakes.",
    address: "221B Baker Street, London • BKK1 Hub",
    phone: "+855 12 888 777",
    email: "sbc@auraglobal.com",
    branch: "bangkok-hub",
    rating: 4.9,
    reviewsCount: 230,
    followers: 14200,
    banner: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
    cover: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80",
    theme_color: "#f25c19",
    currency_code: "USD",
    currency_symbol: "$",
    is_active: 1,
    telegram_group_id: "-1002345678901",
    telegram_group_name: "🍔 SBC Fast Food Kitchen Group",
    openStatus: "open",
    openingHours: "08:00 - 23:00"
  },
  {
    id: 2,
    name: "Aura Artisan Bakery",
    company: "Aura Artisan Bakery Co.",
    slug: "aura-bakery",
    tagline: "Fresh French Viennoiserie & Sourdough Pastries",
    description: "Handcrafted European bakery offering golden almond croissants, naturally leavened sourdough, and artisan cakes.",
    address: "No. 45 St 214, Daun Penh, Phnom Penh",
    phone: "+855 12 888 778",
    email: "bakery@auraglobal.com",
    branch: "bangkok-hub",
    rating: 4.8,
    reviewsCount: 185,
    followers: 11900,
    banner: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    cover: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&q=80",
    theme_color: "#d97706",
    currency_code: "USD",
    currency_symbol: "$",
    is_active: 1,
    telegram_group_id: "-1002345678902",
    telegram_group_name: "🥐 Aura Artisan Bakery Kitchen Group",
    openStatus: "open",
    openingHours: "06:30 - 20:00"
  },
  {
    id: 3,
    name: "Aura Healthy Bistro",
    company: "Aura Bistro Kitchen",
    slug: "aura-bistro",
    tagline: "Nutrient-Dense Poke Bowls, Salads & Cold Juices",
    description: "Farm-to-table kitchen serving fresh poke bowls, organic greens, high-protein brunch, and cold-pressed botanical juices.",
    address: "No. 88 St 302, BKK1, Phnom Penh",
    phone: "+855 12 888 779",
    email: "bistro@auraglobal.com",
    branch: "bangkok-hub",
    rating: 4.9,
    reviewsCount: 160,
    followers: 9800,
    banner: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
    cover: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80",
    theme_color: "#16a34a",
    currency_code: "USD",
    currency_symbol: "$",
    is_active: 1,
    telegram_group_id: "-1002345678903",
    telegram_group_name: "🥗 Aura Bistro Kitchen Orders Group",
    openStatus: "open",
    openingHours: "08:00 - 21:00"
  },
  {
    id: 4,
    name: "Aura Tech & Gadgets",
    company: "Aura Tech Fulfillment",
    slug: "aura-tech",
    tagline: "Specialty Brewing Gear, Scales & Accessories",
    description: "High-grade barista equipment, precision espresso scales, and specialized home brewing accessories.",
    address: "No. 12 Toul Kork, Phnom Penh",
    phone: "+855 12 888 780",
    email: "tech@auraglobal.com",
    branch: "bangkok-hub",
    rating: 4.7,
    reviewsCount: 110,
    followers: 7400,
    banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80",
    theme_color: "#8b5cf6",
    currency_code: "USD",
    currency_symbol: "$",
    is_active: 1,
    telegram_group_id: "-1002345678904",
    telegram_group_name: "⚡ Aura Tech Store Fulfillment Group",
    openStatus: "open",
    openingHours: "09:00 - 20:00"
  }
];

const fastFoodOptions = [
  {
    id: "portion",
    name: "Portion Size",
    choices: [
      { label: "Regular", priceDelta: 0, default: true },
      { label: "Large Combo (+Fries & Drink)", priceDelta: 2.50, default: false }
    ]
  },
  {
    id: "spicy",
    name: "Spicy Level",
    choices: [
      { label: "Mild / Original", priceDelta: 0, default: true },
      { label: "Spicy Peri-Peri", priceDelta: 0, default: false },
      { label: "Extra Hot 🔥", priceDelta: 0.25, default: false }
    ]
  }
];

const categories = [
  {
    id: 21,
    name: "Burger",
    code: "CAT-BURGER",
    description: "Juicy handcrafted burgers and crispy chicken zinger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
    icon: "🍔",
    status: 1
  },
  {
    id: 22,
    name: "Pizza",
    code: "CAT-PIZZA",
    description: "Loaded cheesy pizzas and fresh baked crusts",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
    icon: "🍕",
    status: 1
  },
  {
    id: 23,
    name: "Chicken",
    code: "CAT-CHICKEN",
    description: "Crispy & juicy fried chicken drumsticks and tenders",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80",
    icon: "🍗",
    status: 1
  },
  {
    id: 24,
    name: "Snacks",
    code: "CAT-SNACKS",
    description: "Crispy golden french fries and classic hot dogs",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=400&q=80",
    icon: "🍟",
    status: 1
  },
  {
    id: 25,
    name: "Drinks",
    code: "CAT-DRINKS",
    description: "Creamy milkshakes, iced soda, and chilled refreshments",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80",
    icon: "🥤",
    status: 1
  },
  {
    id: 1,
    name: "Espresso & Coffee",
    code: "CAT-COF",
    description: "Handcrafted espresso, lattes, and specialty brews",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80",
    status: 1
  },
  {
    id: 2,
    name: "Cold Brew & Tea",
    code: "CAT-TEA",
    description: "Slow-steeped cold brews and premium organic teas",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80",
    status: 1
  },
  {
    id: 3,
    name: "Pastries & Bites",
    code: "CAT-PST",
    description: "Oven-fresh pastries and quick cafe bites",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80",
    status: 1
  },
  {
    id: 4,
    name: "French Viennoiserie",
    code: "CAT-BAK",
    description: "Butter croissants, pain au chocolat, brioche",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    status: 1
  },
  {
    id: 5,
    name: "Sourdough & Bread",
    code: "CAT-BRD",
    description: "Naturally fermented sourdough loaves and rustic breads",
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=400&q=80",
    status: 1
  },
  {
    id: 6,
    name: "Cakes & Tarts",
    code: "CAT-CAK",
    description: "Artisan desserts, cheesecakes, and fruit tarts",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80",
    status: 1
  },
  {
    id: 7,
    name: "Poke & Grain Bowls",
    code: "CAT-POK",
    description: "Fresh sashimi, avocado, quinoa, and grain bowls",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
    status: 1
  },
  {
    id: 8,
    name: "All-Day Brunch",
    code: "CAT-BRN",
    description: "Gourmet toasts, eggs benedict, and brunch classics",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80",
    status: 1
  },
  {
    id: 9,
    name: "Cold-Pressed Juices",
    code: "CAT-JUC",
    description: "Raw organic fruit and botanical juices",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=400&q=80",
    status: 1
  },
  {
    id: 10,
    name: "Brewing Gear",
    code: "CAT-GEAR",
    description: "Scales, grinders, pour-over drippers",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
    status: 1
  }
];

const standardCoffeeOptions = [
  {
    id: "size",
    name: "Size",
    choices: [
      { label: "Regular (12oz)", priceDelta: 0, default: true },
      { label: "Large (16oz)", priceDelta: 0.75, default: false }
    ]
  },
  {
    id: "ice",
    name: "Ice Level",
    choices: [
      { label: "Normal Ice", priceDelta: 0, default: true },
      { label: "Less Ice", priceDelta: 0, default: false },
      { label: "No Ice", priceDelta: 0, default: false }
    ]
  },
  {
    id: "sweetness",
    name: "Sweetness",
    choices: [
      { label: "100% Standard", priceDelta: 0, default: true },
      { label: "50% Less Sweet", priceDelta: 0, default: false },
      { label: "Sugar-Free", priceDelta: 0, default: false }
    ]
  }
];

const bakeryOptions = [
  {
    id: "preparation",
    name: "Preparation",
    choices: [
      { label: "Warmed Up", priceDelta: 0, default: true },
      { label: "Standard (Room Temp)", priceDelta: 0, default: false }
    ]
  }
];

const products = [
  // Store 1: SBC Store (Fast Food & Cafe) (biller_id: 1)
  {
    id: 101,
    biller_id: 1,
    category_id: 21,
    code: "PRD-FF-01",
    name: "Zinger Burger",
    price: 5.49,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    unit: "Item",
    details: "Crispy chicken with spicy mayo",
    rating: 4.9,
    reviews: 248,
    popular: true,
    is_best_seller: true,
    badge: "Popular",
    inStock: true,
    options: fastFoodOptions
  },
  {
    id: 102,
    biller_id: 1,
    category_id: 22,
    code: "PRD-FF-02",
    name: "Cheese Pizza",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    unit: "Item",
    details: "Loaded with extra cheese",
    rating: 4.9,
    reviews: 312,
    popular: true,
    is_best_seller: true,
    badge: "Hot Deals",
    inStock: true,
    options: fastFoodOptions
  },
  {
    id: 103,
    biller_id: 1,
    category_id: 23,
    code: "PRD-FF-03",
    name: "Fried Chicken",
    price: 7.49,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
    unit: "Bucket",
    details: "Crispy & juicy chicken",
    rating: 4.8,
    reviews: 195,
    popular: true,
    badge: "Top Rated",
    inStock: true,
    options: fastFoodOptions
  },
  {
    id: 104,
    biller_id: 1,
    category_id: 24,
    code: "PRD-FF-04",
    name: "Hot Dog",
    price: 3.49,
    image: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=600&q=80",
    unit: "Item",
    details: "Classic hot dog with sauce",
    rating: 4.7,
    reviews: 160,
    popular: true,
    badge: "Special",
    inStock: true,
    options: fastFoodOptions
  },
  {
    id: 105,
    biller_id: 1,
    category_id: 24,
    code: "PRD-FF-05",
    name: "French Fries",
    price: 2.49,
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80",
    unit: "Portion",
    details: "Crispy golden fries",
    rating: 4.9,
    reviews: 420,
    popular: true,
    badge: "Crunchy",
    inStock: true,
    options: fastFoodOptions
  },
  {
    id: 106,
    biller_id: 1,
    category_id: 25,
    code: "PRD-FF-06",
    name: "Milkshake",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
    unit: "Glass",
    details: "Creamy & tasty milkshake",
    rating: 4.9,
    reviews: 280,
    popular: true,
    badge: "Chilled",
    inStock: true,
    options: standardCoffeeOptions
  },
  {
    id: 1,
    biller_id: 1,
    category_id: 1,
    code: "PRD-COF-01",
    name: "Spanish Iced Latte",
    price: 4.25,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
    unit: "Cup",
    details: "Signature espresso layered with sweetened condensed milk and fresh organic whole milk over iced cube crystals.",
    rating: 4.9,
    reviews: 142,
    inStock: true,
    options: standardCoffeeOptions
  },
  {
    id: 2,
    biller_id: 1,
    category_id: 1,
    code: "PRD-COF-02",
    name: "Artisan Flat White",
    price: 3.85,
    image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80",
    unit: "Cup",
    details: "Double ristretto shot finished with velvety microfoam milk and latte art.",
    rating: 4.8,
    reviews: 98,
    inStock: true,
    options: [
      {
        id: "milk",
        name: "Milk Type",
        choices: [
          { label: "Whole Milk", priceDelta: 0, default: true },
          { label: "Barista Oat Milk", priceDelta: 0.60, default: false },
          { label: "Almond Milk", priceDelta: 0.60, default: false }
        ]
      }
    ]
  },
  {
    id: 3,
    biller_id: 1,
    category_id: 2,
    code: "PRD-COF-03",
    name: "Mondulkiri Cold Brew Reserve",
    price: 4.50,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
    unit: "Cup",
    details: "Slow steeped for 18 hours using high-altitude Mondulkiri single origin beans with natural chocolate and citrus notes.",
    rating: 4.9,
    reviews: 84,
    inStock: true,
    options: standardCoffeeOptions
  },
  {
    id: 4,
    biller_id: 1,
    category_id: 2,
    code: "PRD-COF-04",
    name: "Ceremonial Uji Matcha Latte",
    price: 4.75,
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
    unit: "Cup",
    details: "First-harvest ceremonial grade Uji matcha whisked with warm bamboo chasen and blended with sweet oat milk.",
    rating: 4.9,
    reviews: 116,
    inStock: true,
    options: standardCoffeeOptions
  },
  {
    id: 5,
    biller_id: 1,
    category_id: 3,
    code: "PRD-BAK-01",
    name: "Golden Almond Croissant",
    price: 3.75,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    unit: "Piece",
    details: "Twice-baked French butter croissant filled with luscious almond frangipane cream and topped with toasted sliced almonds.",
    rating: 4.9,
    reviews: 130,
    inStock: true,
    options: bakeryOptions
  },
  {
    id: 6,
    biller_id: 1,
    category_id: 3,
    code: "PRD-BAK-02",
    name: "Pain au Chocolat",
    price: 3.50,
    image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=600&q=80",
    unit: "Piece",
    details: "Buttery, flaky laminated pastry wrapping double batons of dark French chocolate.",
    rating: 4.8,
    reviews: 75,
    inStock: true,
    options: bakeryOptions
  },

  // Store 2: Aura Artisan Bakery (biller_id: 2)
  {
    id: 7,
    biller_id: 2,
    category_id: 4,
    code: "PRD-BAK-03",
    name: "Classic Butter Croissant",
    price: 2.80,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    unit: "Piece",
    details: "Traditional honeycomb-structured croissant made with French Normandy butter and 72-hour cold fermentation.",
    rating: 4.9,
    reviews: 92,
    inStock: true,
    options: bakeryOptions
  },
  {
    id: 8,
    biller_id: 2,
    category_id: 5,
    code: "PRD-BRD-01",
    name: "Country Sourdough Loaf (Whole)",
    price: 5.50,
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80",
    unit: "Loaf",
    details: "Wild yeast fermented rustic sourdough with an open crumb and caramelized crust.",
    rating: 4.9,
    reviews: 110,
    inStock: true,
    options: [
      {
        id: "slicing",
        name: "Slicing",
        choices: [
          { label: "Whole Uncut", priceDelta: 0, default: true },
          { label: "Sliced (Toast Thickness)", priceDelta: 0, default: false }
        ]
      }
    ]
  },
  {
    id: 9,
    biller_id: 2,
    category_id: 6,
    code: "PRD-CAK-01",
    name: "Valrhona Chocolate Tart",
    price: 4.90,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
    unit: "Slice",
    details: "Dark 70% Guanaja chocolate ganache in a crisp sable shell garnished with gold leaf.",
    rating: 4.8,
    reviews: 64,
    inStock: true
  },
  {
    id: 10,
    biller_id: 2,
    category_id: 6,
    code: "PRD-CAK-02",
    name: "Vanilla Bean Basque Cheesecake",
    price: 5.25,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
    unit: "Slice",
    details: "Burnt caramelized exterior with an ultra-creamy, molten vanilla core.",
    rating: 4.9,
    reviews: 88,
    inStock: true
  },

  // Store 3: Aura Healthy Bistro (biller_id: 3)
  {
    id: 11,
    biller_id: 3,
    category_id: 7,
    code: "PRD-BIS-01",
    name: "Norwegian Salmon Poke Bowl",
    price: 8.50,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    unit: "Bowl",
    details: "Sashimi-grade salmon cubes, edamame, Hass avocado, furikake, pickled radish over warm brown rice.",
    rating: 4.9,
    reviews: 105,
    inStock: true,
    options: [
      {
        id: "base",
        name: "Base",
        choices: [
          { label: "Organic Brown Rice", priceDelta: 0, default: true },
          { label: "Tri-Color Quinoa", priceDelta: 0.50, default: false },
          { label: "Mixed Salad Greens", priceDelta: 0, default: false }
        ]
      }
    ]
  },
  {
    id: 12,
    biller_id: 3,
    category_id: 8,
    code: "PRD-BIS-02",
    name: "Truffle Scrambled Eggs Sourdough",
    price: 7.20,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
    unit: "Plate",
    details: "Pasture-raised eggs folded with black truffle oil and chives on toasted sourdough.",
    rating: 4.8,
    reviews: 72,
    inStock: true
  },
  {
    id: 13,
    biller_id: 3,
    category_id: 9,
    code: "PRD-BIS-03",
    name: "Vitality Green Glow Detox Juice",
    price: 4.00,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80",
    unit: "Bottle",
    details: "Cold-pressed kale, green apple, cucumber, celery, and fresh ginger.",
    rating: 4.7,
    reviews: 58,
    inStock: true
  },

  // Store 4: Aura Tech & Gadgets (biller_id: 4)
  {
    id: 14,
    biller_id: 4,
    category_id: 10,
    code: "PRD-TCH-01",
    name: "Precision Coffee Scale & Timer",
    price: 34.00,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    unit: "Item",
    details: "0.1g high accuracy scale with built-in brew flow timer, silicone mat, and USB-C fast charging.",
    rating: 4.8,
    reviews: 42,
    inStock: true
  },
  {
    id: 15,
    biller_id: 4,
    category_id: 10,
    code: "PRD-TCH-02",
    name: "Manual Ceramic Burr Hand Grinder",
    price: 48.00,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    unit: "Item",
    details: "CNC stainless steel conical burrs with 24 click stepless grind adjustment from espresso to French press.",
    rating: 4.9,
    reviews: 51,
    inStock: true
  }
];

const simpleData = {
  stores,
  categories,
  products
};

export { stores, categories, products };
export default simpleData;

