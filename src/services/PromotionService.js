const Promotions = require('../models/PromotionModel');

module.exports = {
  getAll: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const currentDate = new Date();
        const promotions = await Promotions.find().sort([['createdAt', 'desc']]);
        const promotionsWithValidity = promotions.map((promotion) => ({
          ...promotion.toObject(),
          isValid: promotion.expiredDate > currentDate,
        }));
        return resolve(promotionsWithValidity);
      } catch (error) {
        return reject(error);
      }
    });
  },
  create: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { title } = data;

        const existingPromotion = await Promotions.findOne({
          title: { $regex: new RegExp(title, 'i') },
        });

        if (existingPromotion) {
          return reject({
            status: 'error',
            statusCode: 400,
            message: 'Tiêu đề đã tồn tại. Vui lòng chọn một tiêu đề khác.',
          });
        }

        const newPromotion = await Promotions.create(data);
        return resolve(newPromotion);
      } catch (error) {
        return reject(error);
      }
    });
  },

  update: (id, changes) => {
    return new Promise(async (resolve, reject) => {
      try {
        const [currentPromo, existedPromo] = await Promise.all([
          Promotions.findById(id),
          Promotions.findOne({ title: { $regex: new RegExp('^' + changes.name + '$', 'i') } }),
        ]);
        if (!currentPromo) {
          return reject({
            status: 'error',
            statusCode: 404,
            message: `Không tìm thấy loại sản phẩm có ID: ${id}`,
          });
        }
        if (existedPromo && existedPromo._id.toString() !== id) {
          return reject({
            status: 'error',
            statusCode: 404,
            message: `Khuyến mãi đã tồn tại`,
          });
        }

        const updatedPromo = await Promotions.findByIdAndUpdate(id, changes, {
          new: true,
        }).select({ __v: 0, updatedAt: 0 });
        return resolve(updatedPromo);
      } catch (error) {
        return reject(error);
      }
    });
  },

  remove: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const promotion = await Promotions.findById(id);
        if (!promotion) {
          return reject({
            status: 'error',
            statusCode: 404,
            message: `Không tìm thấy khuyến mãi có ID: ${id}`,
          });
        }
        await Promotions.deleteOne({ _id: id });
        resolve(null);
      } catch (error) {
        return reject(error);
      }
    });
  },
};
