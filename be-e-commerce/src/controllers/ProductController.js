const { array } = require('joi');
const ProductService = require('../services/ProductService');
const validationSchema = require('../utils/validationSchema');

const ratingProduct = async (req, res) => {
  try {
    const userId = req.params?.userId;
    const productId = req.params?.productId;
    const starts = req.body?.starts;
    const { error } = validationSchema.ratingSchemaValidation({
      userId,
      productId,
      starts,
    });
    if (error) return res.status(401).json({ error: true, message: error.details[0].message });

    const response = await ProductService.ratingProduct({
      productId,
      userId,
      starts,
    });
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const newImages = req.files.map(
      (file) => process.env.BASE_URL + '/uploads/products/' + file.filename.replace(/\s/g, ''),
    );

    let images = new Array();
    images = images.concat(newImages);

    const data = {
      ...req.body,
      image: images,
    };
    const { error } = validationSchema.createProductSchemaBodyValidation(data);
    if (error) {
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const response = await ProductService.createProduct(data);
    return res.status(201).json({
      status: 'success',
      statusCode: 201,
      message: 'Thêm sản phẩm thành công',
      data: response,
    });
  } catch (e) {
    console.log(e);
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Vui lòng cung cấp productId',
      });
    }

    const newImages = req.files.map(
      (file) => process.env.BASE_URL + '/uploads/product/' + file.filename.replace(/\s/g, ''),
    );

    const images = [].concat(newImages);

    const data = {
      ...req.body,
      image: images,
    };
    const { error } = validationSchema.createProductSchemaBodyValidation(data);
    if (error) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: error.details[0].message,
      });
    }

    const response = await ProductService.updateProduct(productId, data);

    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Vui lòng cung cấp productId',
      });
    }
    const response = await ProductService.getDetailsProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The productId is required',
      });
    }
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Vui lòng cung cấp danh sách productId',
      });
    }
    const response = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const filters = {};
    const { name, productTypes, page = 1, pageSize = 10 } = req.query;

    if (name) {
      filters.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive name search
    }
    if (productTypes) {
      const typeArray = productTypes.split(','); // Convert comma-separated types to an array
      filters.type = { $in: typeArray };
    }

    const response = await ProductService.getAllProduct(filters, page, pageSize);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

const getAllType = async (req, res) => {
  try {
    const response = await ProductService.getAllType();
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteMany,
  getAllType,
  ratingProduct,
};
