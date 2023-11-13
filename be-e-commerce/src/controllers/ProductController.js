const ProductService = require("../services/ProductService");
const validationSchema = require("../utils/validationSchema");



const createProduct = async (req, res) => {
  try {
    //sai logic b1 tao object = req, b2 validation,..
    const { error } = validationSchema.createProductSchemaBodyValidation(
      req.body
    );
    if (error)
      return res
        .status(401)
        .json({ error: true, message: error.details[0].message });

    // const imagePath = req.file.path;
    // const obj = {
    //   ...req.body, // Copy all properties from req.body
    //   image: imagePath,
    //   //  {
    //   //   // data: fs.readFileSync(path.join("./uploads/" + req.file.filename)),
    //   //   // contentType: "image/png",
    //   // },
    // };

    const response = await ProductService.createProduct(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    const { error } = validationSchema.createProductSchemaBodyValidation(
      req.body
    );
    if (error)
      return res
        .status(401)
        .json({ error: true, message: error.details[0].message });

    // const obj = {
    //   ...req.body, // Copy all properties from req.body
    //   image: {
    //     data: fs.readFileSync(path.join("./uploads/" + req.file.filename)),
    //     contentType: "image/png",
    //   },
    // };

    const response = await ProductService.updateProduct(productId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
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
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "The ids is required",
      });
    }
    const response = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await ProductService.getAllProduct(
      Number(limit) || null,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllType = async (req, res) => {
  try {
    const response = await ProductService.getAllType();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
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
};
