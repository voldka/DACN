const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../middleware/authMiddleware");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.resolve(__dirname, "../", "../", "public", "uploads", "users")
    );
  },
  filename: function (req, file, cb) {
    cb(
      null,
      req.params?.userId +
        "-" +
        file.fieldname +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage, limits: 4 * 1024 * 1024 });

router.get("/get-by-rating", userController.forgotPasswordUser);

router.post("/forgot-password", userController.forgotPasswordUser);

router.post("/password-reset/:userId/:token", userController.resetPasswordUser);

router.post("/change-password", userController.changePasswordUser);
router.post("/sign-up", userController.createUser);
router.post("/sign-in", userController.loginUser);
router.get("/log-out/:userId",authUserMiddleWare, userController.logoutUser);

router.put(
  "/update-user/:userId",
  authUserMiddleWare,
  upload.single("avatar"),
  userController.updateUser
);
router.get(
  "/get-details/:userId",
  authUserMiddleWare,
  userController.getDetailsUser
);
router.post("/refresh-token", userController.refreshToken);

router.get("/getAll", authMiddleWare, userController.getAllUser);
router.delete(
  "/delete-user/:userId",
  authMiddleWare,
  userController.deleteUser
);
router.post("/delete-many", authMiddleWare, userController.deleteMany);

module.exports = router;
