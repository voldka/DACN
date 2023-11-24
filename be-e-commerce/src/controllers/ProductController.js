const { array } = require("joi");
const ProductService = require("../services/ProductService");
const validationSchema = require("../utils/validationSchema");

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
    if (error)
      return res
        .status(401)
        .json({ error: true, message: error.details[0].message });

    const response = await ProductService.ratingProduct({
      productId,
      userId,
      starts,
    });
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      message: e.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    // let name ="";
    // name = req.body?.name.replace(/\s/g, "")

    // const imagePath = process.env.BASE_URL + '/uploads/product/' + req.file.filename;
    const newImages = req.files.map(
      (file) =>
        process.env.BASE_URL +
        "/uploads/product/" +
        file.filename.replace(/\s/g, "")
    );

    let images = new Array();
    images = images.concat(newImages);

    const data = {
      ...req.body, // Copy all properties from req.body
      image: images,
      //  {
      //   // data: fs.readFileSync(path.join("./uploads/" + req.file.filename)),
      //   // contentType: "image/png",
      // },
    };
    //sai logic b1 tao object = req, b2 validation,..
    const { error } = validationSchema.createProductSchemaBodyValidation(data);
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

    const response = await ProductService.createProduct(data);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
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

    const newImages = req.files.map(
      (file) =>
        process.env.BASE_URL +
        "/uploads/product/" +
        file.filename.replace(/\s/g, "")
    );

    let images = new Array();
    images = images.concat(newImages);

    const data = {
      ...req.body, // Copy all properties from req.body
      image: images,
      //  {
      //   // data: fs.readFileSync(path.join("./uploads/" + req.file.filename)),
      //   // contentType: "image/png",
      // },
    };
    const { error } = validationSchema.createProductSchemaBodyValidation(data);
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

    const response = await ProductService.updateProduct(productId, data);

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
  ratingProduct,
};
