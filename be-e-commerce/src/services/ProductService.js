const Product = require('../models/ProductModel');
const Order = require('../models/OrderProduct');
const RatingList = require('../models/RatingList');

const hasProductId = (productsSet, productId) => {
  let stringProduct;
  for (let product of productsSet) {
    stringProduct = product.product.toString();
    if (stringProduct == productId) {
      return true;
    }
  }
  return false;
};
const ratingProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { productId, userId, starts } = data;
      const flagRatingList = await RatingList.find({
        user: userId,
        product: productId,
      });
      if (flagRatingList.length === 0) {
        // tim list order của user
        const orders = await Order.find({ user: userId });
        const orderCount = orders.length;
        //set products user đã mua
        let products = new Set();
        orders.forEach((order) => {
          order.orderItems.forEach((item) => {
            products.add(item);
          });
        });

        let count = products.size;
        if (!count) {
          resolve({
            status: 'ERR',
            message: `Nguoi dung voi id: ${userId} chua tung mua hang`,
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

        // let setProduct = new Set();
        // setProduct = products.productData;

        if (hasProductId(products, productId)) {
          let product = await getDetailsProduct(productId);
          if (product.status == 'ERR') {
            resolve({
              status: 'ERR',
              message: `khong the tim thay product voi id: ${productId}`,
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
          let productInDb = product.data.productData;
          productInDb.countRating = productInDb.countRating + 1;
          productInDb.rating =
            (productInDb.rating * (productInDb.countRating - 1) + starts) / productInDb.countRating;
          const productAfterUpdate = await Product.findByIdAndUpdate(productInDb.id, productInDb, {
            new: true,
          });

          await RatingList.create({
            user: userId,
            product: productId,
          });
          // let productAfterUpdate = await updateProduct(productInDb.id, productInDb);
          resolve({
            status: 'OK',
            message: `Complete`,
            data: {
              total: null,
              pageCurrent: null,
              totalPage: null,

              userData: null,
              productData: productAfterUpdate,
              orderData: null,
              carouselData: null,
              commentData: null,
            },
            access_token: null,
            refresh_token: null,
          });
        } else {
          resolve({
            status: 'ERR',
            message: `Nguoi dung voi id: ${userId} khong dc danh gia san pham chua tung thuc hien giao dich`,
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
      } else {
        resolve({
          status: 'ERR',
          message: `Nguoi dung voi id: ${userId} da danh gia san pham id: ${productId}`,
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
    } catch (error) {
      reject(error);
    }
  });
};

const createProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        name: data.name,
      });
      if (checkProduct !== null) {
        return reject({
          status: 'error',
          statusCode: 400,
          message: 'Tên sản phẩm đã tồn tại',
        });
      }
      const newProduct = await Product.create(data);
      return resolve(newProduct);
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
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

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
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
          productData: updatedProduct,
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

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
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

      await Product.findByIdAndDelete(id);
      resolve({
        status: 'OK',
        message: 'Delete product Thành công',
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

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });
      resolve({
        status: 'OK',
        message: 'Delete product Thành công',
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

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(id).populate('type');
      if (!product) {
        return reject({
          status: 'error',
          statusCode: 404,
          message: `Không tìm thấy sản phẩm có ID: ${id}`,
        });
      }
      return resolve(product);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (filter, page, pageSize) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments(filter);
      const allProducts = await Product.find(filter)
        .populate('type')
        .limit(parseInt(pageSize, 10))
        .skip((page - 1) * pageSize)
        .sort({ createdAt: -1, updatedAt: -1 });

      resolve({
        status: 'OK',
        message: 'Thành công',
        data: {
          total: totalProduct,
          pageCurrent: Number(page),
          totalPage: Math.ceil(totalProduct / pageSize),
          productData: allProducts,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      return resolve([]);
    } catch (e) {
      return reject(e);
    }
  });
};

const getRelevantProducts = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        return reject({
          status: 'error',
          statusCode: 404,
          message: `Không tìm thấy sản phẩm có ID: ${id}`,
        });
      }

      const productType = product.type;

      const revelations = await Product.find({
        _id: { $ne: productId }, // Exclude the current product
        type: productType,
      }).limit(10);

      return resolve(revelations);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllType,
  ratingProduct,
  getRelevantProducts,
};
