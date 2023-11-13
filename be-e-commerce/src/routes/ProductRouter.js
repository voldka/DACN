const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

const { authMiddleWare } = require("../middleware/authMiddleware");



// put the HTML file containing your form in a directory named "public" (relative to where this script is located)
// app.get("/", express.static(path.join(__dirname, "./public")));


router.post(
  "/create",
  authMiddleWare,
  ProductController.createProduct
);
router.put(
  "/update/:productId",
  authMiddleWare,
  // upload.single("image"),
  ProductController.updateProduct
);
router.delete(
  "/delete/:productId",
  authMiddleWare,
  ProductController.deleteProduct
);
router.post("/delete-many", authMiddleWare, ProductController.deleteMany);

router.get("/get-details/:productId", ProductController.getDetailsProduct);
router.get("/get-all", ProductController.getAllProduct);
router.get("/get-all-type", ProductController.getAllType);

module.exports = router;
