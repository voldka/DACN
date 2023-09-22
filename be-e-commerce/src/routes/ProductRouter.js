const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post("/create", authMiddleWare, ProductController.createProduct);
router.put("/update/:id", authMiddleWare, ProductController.updateProduct);
router.delete("/delete/:id", authMiddleWare, ProductController.deleteProduct);
router.post("/delete-many", authMiddleWare, ProductController.deleteMany);

router.get("/get-details/:id", ProductController.getDetailsProduct);
router.get("/get-all", ProductController.getAllProduct);
router.get("/get-all-type", ProductController.getAllType);

router.post(
  "/uploadfile",
  upload.single("myFile"),
  ProductController.uploadfile
);
router.post(
  "/uploadmultiple",
  upload.array("myFiles", 12),
  ProductController.uploadmultiple
);

module.exports = router;
