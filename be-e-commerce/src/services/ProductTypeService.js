const ProductTypes = require('../models/ProductType');

module.exports = {
  create: (data) => {
    return ProductTypes.create(data);
  },

  getByName: (name) => {
    return ProductTypes.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });
  },

  getAll: () => {
    return ProductTypes.find()
      .select({ __v: 0, updatedAt: 0 })
      .sort([['createdAt', 'desc']]);
  },

  getById: (id) => {
    return ProductTypes.findById(id).select({ __v: 0, updatedAt: 0 });
  },

  update: (id, changes) => {
    return ProductTypes.findByIdAndUpdate(id, changes, {
      new: true,
    }).select({ __v: 0, updatedAt: 0 });
  },

  delete: (id) => {
    return ProductTypes.deleteOne({ _id: id });
  },
};
