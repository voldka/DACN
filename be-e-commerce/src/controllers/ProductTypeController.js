const ProductTypeService = require('../services/ProductTypeService');

const ProductTypeController = {
  create: async (req, res, next) => {
    try {
      const existedType = await ProductTypeService.getByName(req.body.name);
      if (existedType) {
        return res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'Loại sản phẩm này đã tồn tại',
        });
      }
      const newType = await ProductTypeService.create({
        name: req.body.name,
        imageUrl: `${process.env.BASE_URL}/uploads/product_types/${req.file.filename}`,
      });
      return res.status(201).json({
        status: 'OK',
        message: 'Thành công',
        statusCode: 200,
        data: {
          _id: newType._id,
          name: newType.name,
          imageUrl: newType.imageUrl,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: error.message,
      });
    }
  },

  getAll: async (req, res, next) => {
    try {
      const types = await ProductTypeService.getAll();
      return res.status(200).json({
        statusCode: 200,
        status: 'OK',
        message: 'Thành công',
        data: types,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: error.message,
      });
    }
  },

  update: async (req, res, next) => {
    try {
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: error.message,
      });
    }
  },
};

module.exports = ProductTypeController;
