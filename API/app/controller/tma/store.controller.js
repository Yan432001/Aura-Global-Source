const db = require("../../config/utill/connection");

exports.getStoreDetails = async (req, res) => {
  try {
    const { slug } = req.params;

    const [stores] = await db.query(
      "SELECT id, name, company, logo_url, telegram_chat_id FROM aura_companies WHERE store_slug = ? AND group_name = 'biller' LIMIT 1",
      [slug]
    );

    if (stores.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }
    const store = stores[0];

    const [products] = await db.query(
      `SELECT p.id, p.code, p.name, p.price, p.image, c.name AS category_name, b.name AS brand_name 
       FROM aura_products p
       LEFT JOIN aura_categories c ON p.category_id = c.id
       LEFT JOIN aura_brands b ON p.brand_id = b.id
       ORDER BY p.id DESC LIMIT 50`
    );

    const [categories] = await db.query("SELECT id, code, name FROM aura_categories LIMIT 20");

    return res.json({
      store: {
        id: store.id,
        name: store.company || store.name,
        slug,
        logoUrl: store.logo_url
      },
      categories,
      products
    });
  } catch (error) {
    console.error("Error fetching store:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};