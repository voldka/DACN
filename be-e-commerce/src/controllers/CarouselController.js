const CarouselService = require('../services/CarouselService');
const validationSchema = require('../utils/validationSchema');

const createCarousel = async (req, res) => {
  try {
    const newImages = req.files.map(
      (file) => process.env.BASE_URL + '/uploads/carousel/' + file.filename.replace(/\s/g, ''),
    );

    let images = new Array();
    images = images.concat(newImages);

    const data = {
      ...req.body, // Copy all properties from req.body
      image: images,
    };
    const { error } = validationSchema.createCarouselSchemaBodyValidation(data);
    if (error) {
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const response = await CarouselService.createCarousel(data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const updateCarousel = async (req, res) => {
  try {
    const CarouselId = req.params.CarouselId;
    if (!CarouselId) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The CarouselId is required',
      });
    }
    const newImages = req.files.map(
      (file) => process.env.BASE_URL + '/uploads/carousel/' + file.filename.replace(/\s/g, ''),
    );

    let images = new Array();
    images = images.concat(newImages);

    const data = {
      ...req.body, // Copy all properties from req.body
    };
    const { error } = validationSchema.createCarouselSchemaBodyValidation(data);
    if (error) {
      return res.status(401).json({ error: true, message: error.details[0].message });
    }

    const response = await CarouselService.updateCarousel(CarouselId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsCarousel = async (req, res) => {
  try {
    const CarouselId = req.params.CarouselId;
    if (!CarouselId) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The CarouselId is required',
      });
    }
    const response = await CarouselService.getDetailsCarousel(CarouselId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteCarousel = async (req, res) => {
  try {
    const CarouselId = req.params.CarouselId;
    if (!CarouselId) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The CarouselId is required',
      });
    }
    const response = await CarouselService.deleteCarousel(CarouselId);
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
      return res.status(400).json({
        status: 'ERR',
        message: 'The ids is required',
      });
    }
    const response = await CarouselService.deleteManyCarousel(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllCarousel = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await CarouselService.getAllCarousel(
      Number(limit) || null,
      Number(page) || 0,
      sort,
      filter,
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createCarousel,
  updateCarousel,
  getDetailsCarousel,
  deleteCarousel,
  getAllCarousel,
  deleteMany,
};
