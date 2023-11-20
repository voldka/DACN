const express = require("express");
const router = express.Router();
const CarouselController = require("../controllers/CarouselController");

const { authMiddleWare } = require("../middleware/authMiddleware");

const multer = require('multer');
const path = require("path")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../', '../', 'public', 'uploads', 'carousels'));
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

router.post(
  "/create",
    authMiddleWare,
    upload.array('images'),
  CarouselController.createCarousel
);
router.put(
  "/update/:CarouselId",
    authMiddleWare,
    upload.array('images'),
  CarouselController.updateCarousel
);
router.delete(
  "/delete/:CarouselId",
    authMiddleWare,
  CarouselController.deleteCarousel
);
router.post(
  "/delete-many",
   authMiddleWare,
  CarouselController.deleteMany
);

router.get("/get-details/:CarouselId", CarouselController.getDetailsCarousel);
router.get("/get-all", CarouselController.getAllCarousel);
// router.get("/get-all-type", CarouselController.getAllType);

module.exports = router;
