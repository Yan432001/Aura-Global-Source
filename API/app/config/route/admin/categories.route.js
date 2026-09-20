const {
  getCategories,
  addCategories,
  updateCategories,
  deleteCategories
} = require("../../../controller/admin/categories.controller");
const  { token_key_login } = require("../../../controller/admin/auth.controller");
module.exports = (app) => {
  app.get("/api/categories", token_key_login(), getCategories);
  app.post("/api/categories", token_key_login(), addCategories);
  app.put("/api/categories/", token_key_login(), updateCategories);
  app.delete("/api/categories", token_key_login(), deleteCategories);
};
