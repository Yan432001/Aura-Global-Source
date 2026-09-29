// Universal simple dataset for Aura Global E-Menu & Multi-Store Telegram Mini App
const simpleData = {
  stores: [
    {
      id: 1,
      name: "Aura Specialty Coffee",
      company: "Aura Coffee Roasters Co.",
      slug: "sbc-store",
      tagline: "Farm-to-cup artisan coffee & matcha bar",
      location: "BKK1, Phnom Penh",
      address: "100 Central Boulevard, BKK1, Phnom Penh",
      phone: "+855 12 345 678",
      email: "coffee@auraglobal.com",
      hours: "07:00 AM - 08:30 PM",
      is_open: true,
      status_text: "Open Now",
      logo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop&crop=faces",
      banner: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=400&fit=crop",
      theme_color: "#0d9488",
      currency_code: "USD",
      currency_symbol: "$",
      is_active: 1,
      group_name: "biller",
      // telegram_group_id: process.env.TELEGRAM_GROUP_CHAT_ID || "-1002345678901",
      telegram_group_name: "☕ Aura Coffee Kitchen & Barista Group",
      rating: 4.9,
      reviewsCount: 342,
    },
    {
      id: 2,
      name: "Aura Artisan Bakery",
      company: "Aura Pastry & Boulangerie",
      slug: "aura-bakery",
      tagline: "Freshly baked European sourdough & Viennoiserie",
      location: "Daun Penh, Phnom Penh",
      address: "42 Riverside Walk, Daun Penh, Phnom Penh",
      phone: "+855 23 888 999",
      email: "bakery@auraglobal.com",
      hours: "06:30 AM - 07:00 PM",
      is_open: true,
      status_text: "Open Now",
      logo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop&crop=faces",
      banner: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1200&h=400&fit=crop",
      theme_color: "#d97706",
      currency_code: "USD",
      currency_symbol: "$",
      is_active: 1,
      group_name: "biller",
      // telegram_group_id: process.env.TELEGRAM_GROUP_CHAT_ID || "-1002345678902",
      telegram_group_name: "🥐 Aura Bakery Oven & Dispatch Group",
      rating: 4.8,
      reviewsCount: 219,
    },
    {
      id: 3,
      name: "Aura Green Bistro",
      company: "Aura Organic Dining",
      slug: "aura-bistro",
      tagline: "Healthy grain bowls, poke, and fresh squeezed detox juices",
      location: "Diamond Island, Phnom Penh",
      address: "88 Diamond Island Promenade, Phnom Penh",
      phone: "+855 10 999 111",
      email: "bistro@auraglobal.com",
      hours: "10:00 AM - 09:30 PM",
      is_open: true,
      status_text: "Open Now",
      logo: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop&crop=faces",
      banner: "https://images.unsplash.com/photo-1543353071-10c8ba85a904?w=1200&h=400&fit=crop",
      theme_color: "#16a34a",
      currency_code: "USD",
      currency_symbol: "$",
      is_active: 1,
      group_name: "biller",
      // telegram_group_id: process.env.TELEGRAM_GROUP_CHAT_ID || "-1002345678903",
      telegram_group_name: "🥗 Aura Bistro Kitchen Orders Group",
      rating: 4.7,
      reviewsCount: 185,
    },
    {
      id: 4,
      name: "Aura Lifestyle & Tech",
      company: "Aura Smart Essentials",
      slug: "aura-tech",
      tagline: "Curated minimalist gadgets, tumblers, and everyday goods",
      location: "Norodom, Phnom Penh",
      address: "15 Norodom Blvd, Phnom Penh",
      phone: "+855 17 555 444",
      email: "tech@auraglobal.com",
      hours: "09:00 AM - 09:00 PM",
      is_open: true,
      status_text: "Open Now",
      logo: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=200&h=200&fit=crop&crop=faces",
      banner: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop",
      theme_color: "#6366f1",
      currency_code: "USD",
      currency_symbol: "$",
      is_active: 1,
      group_name: "biller",
      // telegram_group_id: process.env.TELEGRAM_GROUP_CHAT_ID || "-1002345678904",
      telegram_group_name: "⚡ Aura Tech Store Fulfillment Group",
      rating: 4.9,
      reviewsCount: 420,
    }
  ],

  categories: [
    {
      id: 1,
      code: "CAT-COFFEE",
      name: "Specialty Coffee",
      description: "Artisan espresso, single origin pour-overs & cold brew",
      icon: "☕",
      status: 1
    },
    {
      id: 2,
      code: "CAT-TEAS",
      name: "Teas & Refreshers",
      description: "Japanese matcha, organic floral teas & sparkling sodas",
      icon: "🍵",
      status: 1
    },
    {
      id: 3,
      code: "CAT-BAKERY",
      name: "Artisan Bakery",
      description: "Warm croissants, Danish pastries & slow-fermented sourdough",
      icon: "🥐",
      status: 1
    },
    {
      id: 4,
      code: "CAT-BOWLS",
      name: "Bistro Bowls & Mains",
      description: "Fresh protein salads, poke bowls & gourmet sandwiches",
      icon: "🥗",
      status: 1
    },
    {
      id: 5,
      code: "CAT-DESSERTS",
      name: "Desserts & Sweets",
      description: "Basque cheesecakes, macarons & gelato treats",
      icon: "🍰",
      status: 1
    },
    {
      id: 6,
      code: "CAT-LIFESTYLE",
      name: "Goods & Accessories",
      description: "Thermal tumblers, ceramic drippers & tote bags",
      icon: "🎒",
      status: 1
    }
  ],

  products: [
    // Coffee & Beverages (Store 1)
    {
      id: 1,
      code: "PRD-COF-01",
      name: "Spanish Iced Latte",
      price: 4.25,
      unit: "cup",
      category_id: 1,
      biller_id: 1,
      details: "Double shot espresso with condensed milk, whole milk, and crushed ice.",
      image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&h=500&fit=crop",
      in_stock: 50,
      badge: "Best Seller",
      popular: true,
      variants: [
        { id: "v-sm", name: "Small", size: "Small (12oz)", priceAdjustment: 0, priceDelta: 0, default: true },
        { id: "v-md", name: "Medium", size: "Medium (16oz)", priceAdjustment: 0.75, priceDelta: 0.75 },
        { id: "v-lg", name: "Large", size: "Large (20oz)", priceAdjustment: 1.50, priceDelta: 1.50 }
      ],
      options: [
        {
          id: "size",
          name: "Size",
          required: true,
          choices: [
            { label: "Regular (12oz)", priceDelta: 0, default: true },
            { label: "Large (16oz)", priceDelta: 0.75 }
          ]
        },
        {
          id: "ice",
          name: "Ice Level",
          required: false,
          choices: [
            { label: "Normal Ice", priceDelta: 0, default: true },
            { label: "Less Ice", priceDelta: 0 },
            { label: "No Ice", priceDelta: 0 }
          ]
        },
        {
          id: "sweetness",
          name: "Sweetness",
          required: false,
          choices: [
            { label: "100% Normal", priceDelta: 0, default: true },
            { label: "50% Less Sweet", priceDelta: 0 },
            { label: "No Sugar", priceDelta: 0 }
          ]
        }
      ]
    },
    {
      id: 2,
      code: "PRD-COF-02",
      name: "Vanilla Cold Foam Cold Brew",
      price: 4.50,
      unit: "cup",
      category_id: 1,
      biller_id: 1,
      details: "18-hour steeped Ethiopian cold brew topped with velvety sweet vanilla cream.",
      image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=500&fit=crop",
      in_stock: 35,
      badge: "Popular",
      popular: true,
      variants: [
        { id: "v-sm", name: "Small", size: "Small (12oz)", priceAdjustment: 0, priceDelta: 0, default: true },
        { id: "v-md", name: "Medium", size: "Medium (16oz)", priceAdjustment: 0.75, priceDelta: 0.75 },
        { id: "v-lg", name: "Large", size: "Large (20oz)", priceAdjustment: 1.50, priceDelta: 1.50 }
      ],
      options: [
        {
          id: "size",
          name: "Size",
          required: true,
          choices: [
            { label: "Regular (12oz)", priceDelta: 0, default: true },
            { label: "Large (16oz)", priceDelta: 0.75 }
          ]
        },
        {
          id: "dairy",
          name: "Milk Base",
          required: false,
          choices: [
            { label: "Whole Milk", priceDelta: 0, default: true },
            { label: "Oat Milk (+0.50)", priceDelta: 0.50 },
            { label: "Almond Milk (+0.50)", priceDelta: 0.50 }
          ]
        }
      ]
    },
    {
      id: 3,
      code: "PRD-COF-03",
      name: "Kyoto Style Dirty Matcha",
      price: 4.75,
      unit: "cup",
      category_id: 2,
      biller_id: 1,
      details: "Ceremonial Uji matcha layered over chilled oat milk with an espresso shot.",
      image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&h=500&fit=crop",
      in_stock: 40,
      badge: "Signature",
      popular: true,
      options: [
        {
          id: "size",
          name: "Size",
          required: true,
          choices: [
            { label: "Regular (12oz)", priceDelta: 0, default: true },
            { label: "Large (16oz)", priceDelta: 0.75 }
          ]
        },
        {
          id: "shot",
          name: "Espresso Shot",
          required: false,
          choices: [
            { label: "Single Shot", priceDelta: 0, default: true },
            { label: "Double Shot (+0.75)", priceDelta: 0.75 },
            { label: "Decaf", priceDelta: 0 }
          ]
        }
      ]
    },
    {
      id: 4,
      code: "PRD-COF-04",
      name: "Sparkling Yuzu Citrus Tonic",
      price: 3.95,
      unit: "cup",
      category_id: 2,
      biller_id: 1,
      details: "Japanese yuzu fruit puree with sparkling tonic water and mint garnish.",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&h=500&fit=crop",
      in_stock: 30,
      badge: "Refreshing",
      popular: false,
      options: [
        {
          id: "ice",
          name: "Ice Level",
          required: false,
          choices: [
            { label: "Normal Ice", priceDelta: 0, default: true },
            { label: "Less Ice", priceDelta: 0 }
          ]
        }
      ]
    },

    // Bakery (Store 2)
    {
      id: 5,
      code: "PRD-BAK-01",
      name: "Golden Almond Croissant",
      price: 3.75,
      unit: "pc",
      category_id: 3,
      biller_id: 2,
      details: "Twice-baked butter croissant loaded with almond frangipane and toasted flakes.",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=500&fit=crop",
      in_stock: 25,
      badge: "Chef's Pick",
      popular: true,
      options: [
        {
          id: "serving",
          name: "Preparation",
          required: false,
          choices: [
            { label: "Warmed Up", priceDelta: 0, default: true },
            { label: "Room Temperature", priceDelta: 0 }
          ]
        }
      ]
    },
    {
      id: 6,
      code: "PRD-BAK-02",
      name: "Pain au Chocolat (Dark Belgian)",
      price: 3.50,
      unit: "pc",
      category_id: 3,
      biller_id: 2,
      details: "Flaky layered French pastry rolled with twin batons of 70% dark chocolate.",
      image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&h=500&fit=crop",
      in_stock: 30,
      badge: "Hot",
      popular: true,
      options: [
        {
          id: "serving",
          name: "Preparation",
          required: false,
          choices: [
            { label: "Warmed Up", priceDelta: 0, default: true },
            { label: "Room Temperature", priceDelta: 0 }
          ]
        }
      ]
    },
    {
      id: 7,
      code: "PRD-BAK-03",
      name: "Country Sourdough Loaf (800g)",
      price: 5.50,
      unit: "loaf",
      category_id: 3,
      biller_id: 2,
      details: "Natural wild yeast sourdough with blistered caramelised crust and open crumb.",
      image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&h=500&fit=crop",
      in_stock: 18,
      badge: "Artisan",
      popular: false,
      options: [
        {
          id: "slicing",
          name: "Slicing",
          required: false,
          choices: [
            { label: "Whole Loaf (Uncut)", priceDelta: 0, default: true },
            { label: "Sliced (Toast thickness)", priceDelta: 0 }
          ]
        }
      ]
    },
    {
      id: 8,
      code: "PRD-BAK-04",
      name: "Burnt Basque Cheesecake Slice",
      price: 4.80,
      unit: "slice",
      category_id: 5,
      biller_id: 2,
      details: "Creamy molten center with a caramelized crust. Baked fresh daily.",
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&h=500&fit=crop",
      in_stock: 20,
      badge: "Must Try",
      popular: true,
      options: [
        {
          id: "topping",
          name: "Topping",
          required: false,
          choices: [
            { label: "Classic Sea Salt", priceDelta: 0, default: true },
            { label: "Mixed Berry Compote (+0.60)", priceDelta: 0.60 }
          ]
        }
      ]
    },
    {
      id: 21,
      code: "PRD-BAK-05",
      name: "Cardamom Sugar Morning Bun",
      price: 3.60,
      unit: "pc",
      category_id: 3,
      biller_id: 2,
      details: "Flaky layered brioche pastry rolled in brown sugar, Saigon cinnamon & freshly ground green cardamom.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop",
      in_stock: 22,
      badge: "Warm & Spiced",
      popular: true,
      options: [
        {
          id: "serving",
          name: "Preparation",
          required: false,
          choices: [
            { label: "Warmed Up", priceDelta: 0, default: true },
            { label: "Room Temperature", priceDelta: 0 }
          ]
        }
      ]
    },
    {
      id: 22,
      code: "PRD-BAK-06",
      name: "Traditional French Sourdough Baguette",
      price: 2.80,
      unit: "baguette",
      category_id: 3,
      biller_id: 2,
      details: "Slow cold fermentation, blistered crunchy golden crust, airy honeycomb crumb.",
      image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500&h=500&fit=crop",
      in_stock: 35,
      badge: "Boulangerie",
      popular: false,
      options: [
        {
          id: "slicing",
          name: "Slicing",
          required: false,
          choices: [
            { label: "Whole Uncut", priceDelta: 0, default: true },
            { label: "Sliced in Halves", priceDelta: 0 }
          ]
        }
      ]
    },

    // Bistro & Bowls (Store 3)
    {
      id: 9,
      code: "PRD-BIS-01",
      name: "Ahi Tuna Avocado Poke Bowl",
      price: 8.90,
      unit: "bowl",
      category_id: 4,
      biller_id: 3,
      details: "Sashimi-grade tuna, edamame, ripe avocado, seaweed salad, sushi rice & sesame soy.",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
      in_stock: 25,
      badge: "Top Rated",
      popular: true,
      options: [
        {
          id: "base",
          name: "Grain Base",
          required: true,
          choices: [
            { label: "Japanese Sushi Rice", priceDelta: 0, default: true },
            { label: "Organic Brown Rice", priceDelta: 0 },
            { label: "Mixed Salad Greens", priceDelta: 0 }
          ]
        },
        {
          id: "spice",
          name: "Spice Level",
          required: false,
          choices: [
            { label: "Mild Sesame Shoyu", priceDelta: 0, default: true },
            { label: "Spicy Sriracha Mayo", priceDelta: 0 }
          ]
        }
      ]
    },
    {
      id: 10,
      code: "PRD-BIS-02",
      name: "Smoked Salmon & Poached Egg Toast",
      price: 7.50,
      unit: "plate",
      category_id: 4,
      biller_id: 3,
      details: "Norwegian smoked salmon on toasted sourdough with smashed avocado and dill cream.",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&h=500&fit=crop",
      in_stock: 20,
      badge: "Breakfast",
      popular: true,
      options: [
        {
          id: "egg",
          name: "Egg Doneness",
          required: false,
          choices: [
            { label: "Soft Poached (Runny)", priceDelta: 0, default: true },
            { label: "Medium Poached", priceDelta: 0 }
          ]
        }
      ]
    },
    {
      id: 11,
      code: "PRD-BIS-03",
      name: "Cold-Pressed Green Glow Juice",
      price: 4.20,
      unit: "bottle",
      category_id: 2,
      biller_id: 3,
      details: "Organic kale, green apple, cucumber, celery, lemon and cold-pressed ginger.",
      image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&h=500&fit=crop",
      in_stock: 35,
      badge: "Healthy",
      popular: false,
      options: [
        {
          id: "temp",
          name: "Temperature",
          required: false,
          choices: [
            { label: "Chilled", priceDelta: 0, default: true },
            { label: "With Ice Cup", priceDelta: 0 }
          ]
        }
      ]
    },

    // Tech & Lifestyle (Store 4)
    {
      id: 12,
      code: "PRD-TEC-01",
      name: "Aura Double-Wall Ceramic Tumbler",
      price: 24.00,
      unit: "pc",
      category_id: 6,
      biller_id: 4,
      details: "380ml vacuum-insulated tumbler with splash-proof lid. Keeps hot 6h, cold 12h.",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&h=500&fit=crop",
      in_stock: 45,
      badge: "Signature",
      popular: true,
      options: [
        {
          id: "color",
          name: "Color",
          required: true,
          choices: [
            { label: "Matte Charcoal", priceDelta: 0, default: true },
            { label: "Chalk White", priceDelta: 0 },
            { label: "Forest Sage", priceDelta: 0 }
          ]
        }
      ]
    },
    {
      id: 13,
      code: "PRD-TEC-02",
      name: "Organic Heavy Canvas Market Tote",
      price: 16.50,
      unit: "pc",
      category_id: 6,
      biller_id: 4,
      details: "Durable 16oz cotton canvas with reinforced handles and interior zip pocket.",
      image: "https://images.unsplash.com/photo-1597484662367-9b50af734493?w=500&h=500&fit=crop",
      in_stock: 60,
      badge: "Eco-Friendly",
      popular: false,
      options: [
        {
          id: "color",
          name: "Fabric Color",
          required: false,
          choices: [
            { label: "Natural Ecru", priceDelta: 0, default: true },
            { label: "Vintage Navy", priceDelta: 0 }
          ]
        }
      ]
    },
    {
      id: 14,
      code: "PRD-TEC-03",
      name: "Minimalist Wireless Fast Charging Pad",
      price: 28.00,
      unit: "box",
      category_id: 6,
      biller_id: 4,
      details: "15W Qi-certified fast charging pad with aluminium base and soft fabric top.",
      image: "https://images.unsplash.com/photo-1622445262464-84b14e3295b6?w=500&h=500&fit=crop",
      in_stock: 22,
      badge: "Tech Essential",
      popular: true,
      options: [
        {
          id: "cable",
          name: "Included Cable",
          required: false,
          choices: [
            { label: "USB-C to USB-C (1.5m)", priceDelta: 0, default: true },
            { label: "Braided 2m Cable (+3.00)", priceDelta: 3.00 }
          ]
        }
      ]
    }
  ]
};

simpleData.default = simpleData;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = simpleData;
}

export default simpleData;
