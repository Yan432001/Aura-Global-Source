const { getProducts, addProducts, updateProducts, deleteProducts } = require("../../../controller/admin/products.controller")

module.exports = (app) => {
    app.get("/api/products", getProducts);
    app.post("/api/products", addProducts);
    app.get("/api/products", updateProducts);
    app.get("/api/products", deleteProducts);
}   