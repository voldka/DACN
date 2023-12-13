const PromotionService = require('../services/PromotionService');

const getAll = async (req, res) => {
  try {
    const promotions = await PromotionService.getAll();
    return res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'Cập nhật thành công',
      data: promotions,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).json({
      status: 'error',
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    const promotion = await PromotionService.create(req.body);
    return res.status(201).json({
      status: 'success',
      statusCode: 200,
      message: 'Cập nhật thành công',
      data: promotion,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).json({
      status: 'error',
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};
const update = async (req, res) => {
  try {
    const promotionId = req.params.promotionId;
    if (!promotionId) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Vui lòng cung cấp ID của khuyến mãi',
      });
    }
    const response = await PromotionService.update(promotionId, req.body);
    return res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'Cập nhật thành công',
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).json({
      status: 'error',
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const promotionId = req.params.promotionId;
    if (!promotionId) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Vui lòng cung cấp ID của khuyến mãi',
      });
    }
    await PromotionService.remove(promotionId);
    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(e.statusCode || 500).json(error);
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
