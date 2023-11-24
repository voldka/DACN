const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

const {
  authUserMiddleWare,
  authMiddleWare,
} = require("../middleware/authMiddleware");

router.post("/create", OrderController.createOrder);
router.get(
  "/get-all-order/:userId",
  authUserMiddleWare,
  OrderController.getAllOrderDetails
);
router.get(
  "/get-details-order/:userId/:orderId",
  authUserMiddleWare,
  OrderController.getDetailsOrder
);
router.delete(
  "/cancel-order/:userId",
  authUserMiddleWare,
  OrderController.cancelOrderDetails
);
router.get("/get-all-order", authMiddleWare, OrderController.getAllOrder);

module.exports = router;
