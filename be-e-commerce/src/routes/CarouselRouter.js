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

router.get('/', CarouselController.getAllCarousel);
router.post('/create', upload.single('image'), CarouselController.createCarousel);
router.put('/update/:carouselId', upload.single('image'), CarouselController.updateCarousel);
router.delete('/delete/:carouselId', CarouselController.deleteCarousel);

module.exports = router;
