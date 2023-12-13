const OrderService = require('../services/OrderService');
const validationSchema = require('../utils/validationSchema');

const createOrder = async (req, res) => {
  try {
    const { error } = validationSchema.createOrderSchemaBodyValidation(req.body);
    if (error) return res.status(401).json({ error: true, message: error.details[0].message });

    const response = await OrderService.createOrder(req.body);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllOrderDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The userId is required',
      });
    }

    const response = await OrderService.getAllOrderDetails(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The orderId is required',
      });
    }

    const response = await OrderService.getOrderDetails(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const cancelOrderDetails = async (req, res) => {
  try {
    const data = req.body.orderItems;
    const orderId = req.body.orderId;
    if (!orderId) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The orderId is required',
      });
    }
    const response = await OrderService.cancelOrderDetails(orderId, data);

    return res.status(200).json(response);
  } catch (e) {
    // console.log(e)
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const data = await OrderService.getAllOrder();
    return res.status(200).json(data);
  } catch (e) {
    // console.log(e)
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrderDetails,
  getDetailsOrder,
  cancelOrderDetails,
  getAllOrder,
};
