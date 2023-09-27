const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../middleware/authMiddleware");

router.get("/get-by-rating", userController.forgotPasswordUser);
router.post("/forgot-password", userController.forgotPasswordUser);
router.post("/password-reset/:userId/:token", userController.resetPasswordUser);
router.post("/change-password", userController.changePasswordUser);
router.post("/sign-up", userController.createUser);
router.post("/sign-in", userController.loginUser);
router.post("/log-out", userController.logoutUser);
router.put(
  "/update-user/:userId",
  authUserMiddleWare,
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
