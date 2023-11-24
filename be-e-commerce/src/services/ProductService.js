const Product = require("../models/ProductModel");
const Order = require("../models/OrderProduct");
const RatingList = require("../models/RatingList");
const multer = require("multer");
var fs = require("fs");
var path = require("path");
const OderService = require("../services/OrderService");
const { set } = require("mongoose");
const mongoose = require("mongoose");

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
      // const userObjectId = mongoose.Types.ObjectId(userId); // Thay 'userIdString' bằng giá trị ObjectId của user
      // const productObjectId = mongoose.Types.ObjectId(productId);
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
            status: "ERR",
            message: `Nguoi dung voi id: ${userId} chua tung mua hang`,
            data: {
              total: null,
              pageCurrent: null,
              totalPage: null,
              userData: null,
              productData: null,
              orderData: null,
            },
            access_token: null,
            refresh_token: null,
          });
        }

        // let setProduct = new Set();
        // setProduct = products.productData;

        if (hasProductId(products, productId)) {
          let product = await getDetailsProduct(productId);
          if (product.status == "ERR") {
            resolve({
              status: "ERR",
              message: `khong the tim thay product voi id: ${productId}`,
              data: {
                total: null,
                pageCurrent: null,
                totalPage: null,
                userData: null,
                productData: null,
                orderData: null,
              },
              access_token: null,
              refresh_token: null,
            });
          }
          let productInDb = product.data.productData;
          productInDb.countRating = productInDb.countRating + 1;
          productInDb.rating =
            (productInDb.rating * (productInDb.countRating - 1) + starts) /
            productInDb.countRating;
          const productAfterUpdate = await Product.findByIdAndUpdate(
            productInDb.id,
            productInDb,
            {
              new: true,
            }
          );
         
          await RatingList.create({
            user: userId,
            product: productId
          });
          // let productAfterUpdate = await updateProduct(productInDb.id, productInDb);
          resolve({
            status: "OK",
            message: `Complete`,
            data: {
              total: null,
              pageCurrent: null,
              totalPage: null,
              userData: null,
              productData: productAfterUpdate,
              orderData: null,
            },
            access_token: null,
            refresh_token: null,
          });
        } else {
          resolve({
            status: "ERR",
            message: `Nguoi dung voi id: ${userId} khong dc danh gia san pham chua tung thuc hien giao dich`,
            data: {
              total: null,
              pageCurrent: null,
              totalPage: null,
              userData: null,
              productData: null,
              orderData: null,
            },
            access_token: null,
            refresh_token: null,
          });
        }
      }else{
        resolve({
          status: "ERR",
          message: `Nguoi dung voi id: ${userId} da danh gia san pham id: ${productId}`,
          data: {
            total: null,
            pageCurrent: null,
            totalPage: null,
            userData: null,
            productData: null,
            orderData: null,
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

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      image,
      type,
      countInStock,
      price,
      rating,
      description,
      discount,
    } = newProduct;
    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "ERR",
          message: "The name of product is already",
          data: {
            total: null,
            pageCurrent: null,
            totalPage: null,
            userData: null,
            productData: null,
          },
          access_token: null,
          refresh_token: null,
        });
      }
      const newProduct = await Product.create({
        name,
        image,
        type,
        countInStock,
        price,
        rating,
        description,
        discount,
      });
      if (newProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: {
            total: null,
            pageCurrent: null,
            totalPage: null,
            userData: null,
            productData: newProduct,
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

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
          data: {
            total: null,
            pageCurrent: null,
            totalPage: null,
            userData: null,
            productData: null,
          },
          access_token: null,
          refresh_token: null,
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: null,
          productData: updatedProduct,
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
          status: "ERR",
          message: "The product is not defined",
          data: {
            total: null,
            pageCurrent: null,
            totalPage: null,
            userData: null,
            productData: null,
          },
          access_token: null,
          refresh_token: null,
        });
      }

      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete product success",
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: null,
          productData: null,
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
        status: "OK",
        message: "Delete product success",
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: null,
          productData: null,
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
      const product = await Product.findOne({
        _id: id,
      });
      if (product === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
          data: {
            total: null,
            pageCurrent: null,
            totalPage: null,
            userData: null,
            productData: null,
          },
          access_token: null,
          refresh_token: null,
        });
      }
      resolve({
        status: "OK",
        message: "Complete",
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: null,
          productData: product,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.count();
      let allProduct = [];
      if (filter) {
        const label = filter[0];
        const allObjectFilter = await Product.find({
          [label]: { $regex: filter[1] },
        })
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: "OK",
          message: "Success",
          data: {
            total: totalProduct,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalProduct / limit),
            userData: null,
            productData: allObjectFilter,
          },
          access_token: null,
          refresh_token: null,
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allProductSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: "OK",
          message: "Success",
          data: {
            total: totalProduct,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalProduct / limit),
            userData: null,
            productData: allProductSort,
          },
          access_token: null,
          refresh_token: null,
        });
      }
      if (!limit) {
        allProduct = await Product.find().sort({
          createdAt: -1,
          updatedAt: -1,
        });
      } else {
        allProduct = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
      }
      resolve({
        status: "OK",
        message: "Success",
        data: {
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit),
          userData: null,
          productData: allProduct,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct("type");
      resolve({
        status: "OK",
        message: "Success",
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: null,
          productData: allType,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (e) {
      reject(e);
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
};
