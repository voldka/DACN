const express = require("express");
const router = express.Router();
const CarouselController = require("../controllers/CarouselController");

const { authMiddleWare } = require("../middleware/authMiddleware");
const { upload } = require("../controllers/CarouselController");

router.post(
  "/create",
  //   authMiddleWare,
  // upload.single("image"),
  CarouselController.createCarousel
);
router.put(
  "/update/:CarouselId",
  //   authMiddleWare,
  // upload.single("image"),
  CarouselController.updateCarousel
);
router.delete(
  "/delete/:CarouselId",
  //   authMiddleWare,
  CarouselController.deleteCarousel
);
router.post(
  "/delete-many",
  //  authMiddleWare,
  CarouselController.deleteMany
);

router.get("/get-details/:CarouselId", CarouselController.getDetailsCarousel);
router.get("/get-all", CarouselController.getAllCarousel);
// router.get("/get-all-type", CarouselController.getAllType);

module.exports = router;
