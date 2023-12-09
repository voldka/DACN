const fs = require('fs');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const path = require('path');
const multer = require('multer');
const generateFilename = require('../utils/generateFilename');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = path.resolve(__dirname, '../', '../', 'public', 'uploads', 'users');
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const filename = generateFilename();
    cb(null, filename + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage, limits: 4 * 1024 * 1024 });

router.post('/password-reset/:userId/:token', userController.resetPasswordUser);
router.post('/forgot-password', userController.forgotPasswordUser);
router.post('/change-password', userController.changePasswordUser);
router.post('/sign-up', userController.createUser);
router.post('/sign-in', userController.loginUser);
router.get('/log-out/:userId', userController.logoutUser);

router.put('/update-user/:userId', upload.single('avatar'), userController.updateUser);
router.get('/get-details/:userId', userController.getDetailsUser);
router.post('/refresh-token', userController.refreshToken);

router.get('/get-by-rating', userController.forgotPasswordUser);
router.get('/getAll', userController.getAllUser);
router.delete('/delete-user/:userId', userController.deleteUser);
router.post('/delete-many', userController.deleteMany);

module.exports = router;
