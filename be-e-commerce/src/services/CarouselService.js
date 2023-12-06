const CarouselModel = require('../models/CarouselModel');

const createCarousel = (newCarousel) => {
  return new Promise(async (resolve, reject) => {
    const { name, description, link } = newCarousel;
    try {
      const checkCarousel = await CarouselModel.findOne({
        name: name,
      });
      if (checkCarousel !== null) {
        resolve({
          status: 'ERR',
          message: 'Đã tồn tại giá trị trường name tương tự',
          data: {
            total: null,
            pageCurrent: null,
            totalPage: null,
            userData: null,
            productData: null,
            orderData: null,
            carouselData: null,
            commentData: null,
          },
          access_token: null,
          refresh_token: null,
        });
      }
      const newCarousel = await CarouselModel.create({
        name,
        description,
        link,
      });
      if (newCarousel) {
        resolve({
          status: 'OK',
          message: 'Thành công',
          data: {
            total: null,
            pageCurrent: null,
            totalPage: null,
            userData: null,
            productData: null,
            orderData: null,
            carouselData: newCarousel,
            commentData: null,
          },
          access_token: null,
          refresh_token: null,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateCarousel = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCarousel = await CarouselModel.findOne({
        _id: id,
      });
      if (checkCarousel === null) {
        resolve({
          status: 'ERR',
          message: 'Không tìm thấy',
          data: {
            total: null,
            pageCurrent: null,
            totalPage: null,
            userData: null,
            productData: null,
            orderData: null,
            carouselData: null,
            commentData: null,
          },
          access_token: null,
          refresh_token: null,
        });
      }

      const updatedCarousel = await CarouselModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: 'OK',
        message: 'Thành công',
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: null,
          productData: null,
          orderData: null,
          carouselData: updatedCarousel,
          commentData: null,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCarousel = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCarousel = await CarouselModel.findOne({
        _id: id,
      });
      if (checkCarousel === null) {
        resolve({
          status: 'ERR',
          message: 'Không tìm thấy',
          data: {
            total: null,
            pageCurrent: null,
            totalPage: null,
            userData: null,
            productData: null,
            orderData: null,
            carouselData: null,
            commentData: null,
          },
          access_token: null,
          refresh_token: null,
        });
      }

      await CarouselModel.findByIdAndDelete(id);
      resolve({
        status: 'OK',
        message: 'Xóa thành công',
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: null,
          productData: null,
          orderData: null,
          carouselData: null,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyCarousel = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await CarouselModel.deleteMany({ _id: ids });
      resolve({
        status: 'OK',
        message: 'Xóa thành công',
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: null,
          productData: null,
          orderData: null,
          carouselData: null,
          commentData: null,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsCarousel = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const Carousel = await CarouselModel.findOne({
        _id: id,
      });
      if (Carousel === null) {
        resolve({
          status: 'ERR',
          message: 'Không tìm thấy',
          data: {
            total: null,
            pageCurrent: null,
            totalPage: null,
            userData: null,
            productData: null,
            orderData: null,
            carouselData: null,
            commentData: null,
          },
          access_token: null,
          refresh_token: null,
        });
      }
      resolve({
        status: 'OK',
        message: 'Thành công',
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: null,
          productData: null,
          orderData: null,
          carouselData: Carousel,
          commentData: null,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllCarousel = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalCarousel = await CarouselModel.count();
      let allCarousel = [];
      if (filter) {
        const label = filter[0];
        const allObjectFilter = await CarouselModel.find({
          [label]: { $regex: filter[1] },
        })
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: 'OK',
          message: 'Thành công',
          data: {
            total: totalCarousel,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalCarousel / limit),
            userData: null,
            productData: null,
            orderData: null,
            carouselData: allObjectFilter,
            commentData: null,
          },
          access_token: null,
          refresh_token: null,
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allCarouselSort = await CarouselModel.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: 'OK',
          message: 'Thành công',
          data: {
            total: totalCarousel,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalCarousel / limit),
            userData: null,
            productData: null,
            orderData: null,
            carouselData: allCarouselSort,
            commentData: null,
          },
          access_token: null,
          refresh_token: null,
        });
      }
      if (!limit) {
        allCarousel = await CarouselModel.find().sort({
          createdAt: -1,
          updatedAt: -1,
        });
      } else {
        allCarousel = await CarouselModel.find()
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
      }
      resolve({
        status: 'OK',
        message: 'Thành công',
        data: {
          total: totalCarousel,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalCarousel / limit),
          userData: null,
          productData: null,
          orderData: null,
          carouselData: allCarousel,
          commentData: null,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//   const getAllType = () => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const allType = await CarouselModel.distinct("type");
//         resolve({
//           status: "OK",
//           message: "Thành công",
//           data: allType,
//         });
//       } catch (e) {
//         reject(e);
//       }
//     });
//   };

module.exports = {
  createCarousel,
  updateCarousel,
  getDetailsCarousel,
  deleteCarousel,
  getAllCarousel,
  deleteManyCarousel,
  // getAllType,
};
