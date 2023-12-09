const fs = require('fs');
const express = require('express');
const router = express.Router();
const CarouselController = require('../controllers/CarouselController');

const { authMiddleWare } = require('../middleware/authMiddleware');

const multer = require('multer');
const path = require('path');
const generateFilename = require('../utils/generateFilename');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = path.resolve(__dirname, '../', '../', 'public', 'uploads', 'carousels');
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const filename = generateFilename();
    cb(null, filename + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post('/create', authMiddleWare, upload.array('images'), CarouselController.createCarousel);
router.put(
  '/update/:CarouselId',
  authMiddleWare,
  upload.array('images'),
  CarouselController.updateCarousel,
);
router.delete('/delete/:CarouselId', authMiddleWare, CarouselController.deleteCarousel);
router.post('/delete-many', authMiddleWare, CarouselController.deleteMany);

router.get('/get-details/:CarouselId', CarouselController.getDetailsCarousel);
router.get('/get-all', CarouselController.getAllCarousel);

module.exports = router;
