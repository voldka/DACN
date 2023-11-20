const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const multer = require('multer');
const { authMiddleWare } = require("../middleware/authMiddleware");
const path = require("path")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../', '../', 'public', 'uploads', 'products'));
  },
  filename: function (req, file, cb) {
    let name ="";
    name = req.body?.name.replace(/\s/g, "")
    cb(
      null,
    name + "-" + file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
// put the HTML file containing your form in a directory named "public" (relative to where this script is located)
// app.get("/", express.static(path.join(__dirname, "./public")));


router.post(
  "/create",
  authMiddleWare,
  upload.array('images'),
  ProductController.createProduct
);
router.put(
  "/update/:productId",
  authMiddleWare,
  upload.array('images'),
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
