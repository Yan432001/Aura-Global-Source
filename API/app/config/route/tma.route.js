const express = require("express");
const router = express.Router();
const storeController = require("../../controller/tma/store.controller");
const orderController = require("../../controller/tma/order.controller");

router.get("/store/:slug", storeController.getStoreDetails);
router.post("/checkout", orderController.createOrder);

module.exports = router;