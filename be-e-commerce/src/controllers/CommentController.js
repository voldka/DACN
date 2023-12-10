const validationSchema = require('../utils/validationSchema');
const CommentService = require('../services/CommentService');
const createComment = async (req, res) => {
  try {
    const newImages = req.files.map(
      (file) => process.env.BASE_URL + '/uploads/comments/' + file.filename.replace(/\s/g, ''),
    );
    let images = new Array();
    images = images.concat(newImages);
    let userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'The userId is required',
      });
    }
    const data = {
      ...req.body,
      user: userId,
      images: images,
    };

    const { error } = validationSchema.commentSchemaValidation(data);
    if (error) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: error.details[0].message,
      });
    }

    const response = await CommentService.createComment(data);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
const updateComment = async (req, res) => {
  try {
    const id = req.params?.commemntId;
    const userId = req.params?.userId;
    if (!id || !userId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'The commentId and userId is required',
      });
    }

    const newImages = req.files.map(
      (file) => process.env.BASE_URL + '/uploads/comments/' + file.filename.replace(/\s/g, ''),
    );
    let images = new Array();
    images = images.concat(newImages);
    const data = {
      ...req.body,
      user: userId,
      images: images,
    };
    const { error } = validationSchema.commentSchemaValidation(data);
    if (error) return res.status(401).json({ error: true, message: error.details[0].message });

    const response = await CommentService.updateComment(id, data);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commemntId;
    const userId = req.params.userId;
    if (!commentId || !userId) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The commemntId and userId is required',
      });
    }
    const response = await CommentService.deleteComment(commentId, userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
const getCommentOfUser = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const userId = req.params?.userId;
    if (!userId) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The userId is required',
      });
    }
    const response = await CommentService.getCommentOfUser(
      userId,
      Number(limit) || null,
      Number(page) || 0,
      sort,
      filter,
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
const getCommentsOfProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const productId = req.params?.productId;
    if (!productId) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The productId is required',
      });
    }
    const response = await CommentService.getCommentsOfProduct(
      productId,
      Number(limit) || null,
      Number(page) || 0,
      sort,
      filter,
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getCommentOfUser,
  getCommentsOfProduct,
};
