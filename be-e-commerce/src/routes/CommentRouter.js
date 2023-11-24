const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const { authUserMiddleWare } = require("../middleware/authMiddleware");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.resolve(__dirname, "../", "../", "public", "uploads", "comments")
    );
  },
  filename: function (req, file, cb) {
    cb(
      null,
      //   req.params?.userId +
      //     "-" +
      //     req.params?.productid +
      //     "-" +
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

router.post(
  "/create/:userId",
  authUserMiddleWare,
  upload.array("images"),
  CommentController.createComment
);
router.patch(
  "/update/:userId/:commemntId",
  authUserMiddleWare,
  upload.array("images"),
  CommentController.updateComment
);
router.delete(
  "/delete/:userId/:commemntId",
  authUserMiddleWare,
  CommentController.deleteComment
);
router.get(
  "/get-comments-of-user/:userId",
  authUserMiddleWare,
  CommentController.getCommentOfUser
);
router.get(
  "/get-comments-of-product/:userId/:productId",
  authUserMiddleWare,
  CommentController.getCommentsOfProduct
);
module.exports = router;
