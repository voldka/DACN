const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");
const SendEmail = require("../utils/SendEmail");

const findAllProductUserBought = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orders = await Order.find({ user: userId });
      const orderCount = orders.length;
      if (orderCount==0) {
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

        const uniqueOrderItems = new Set();
        orders.forEach((order) => {
          order.orderItems.forEach((item) => {
            uniqueOrderItems.add(item);
          });
        });
        if (!uniqueOrderItems) {
          resolve({
            status: "OK",
            message: `complete`,
            data: {
              total: null,
              pageCurrent: null,
              totalPage: null,
              userData: null,
              productData: uniqueOrderItems,
              orderData: null,
            },
            access_token: null,
            refresh_token: null,
          });
        }
        resolve({
          status: "ERR",
          message: `fail`,
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

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      user,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      isPaid,
      paidAt,
      email,
    } = newOrder;

    try {
      //tim san pham khong du
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOne(
          //tim san pham va so luong san phan pham
          {
            _id: order.product,
            countInStock: { $gte: order.amount },
          }
        );
        if (productData) {
          return {
            status: "OK",
            message: "SUCCESS",
          };
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);

      const newData = results && results.filter((item) => item.id);
      if (newData.length) {
        const arrId = [];
        newData.forEach((item) => {
          arrId.push(item.id);
        });
        resolve({
          status: "OK",
          message: `San pham voi id: ${arrId.join(",")} khong du hang`,
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
      } else {
        const promisesupdate = orderItems.map(async (order) => {
          const productUpdateData = await Product.findOneAndUpdate(
            {
              _id: order.product,
              countInStock: { $gte: order.amount },
            },
            {
              $inc: {
                countInStock: -order.amount,
                selled: +order.amount,
              },
            },
            { new: true }
          );
          return {
            status: "OK",
            message: "SUCCESS",
          };
        });
        const resultsUpdate = await Promise.all(promisesupdate);

        const createdOrder = await Order.create({
          orderItems,
          shippingAddress: {
            fullName,
            address,
            city,
            phone,
          },
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
          user: user,
          isPaid,
          paidAt,
        });
        if (createdOrder) {
          await SendEmail.sendEmailCreateOrder(email, orderItems);
          resolve({
            status: "OK",
            message: "success",
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
      }
    } catch (e) {
      //   console.log('e', e)
      reject(e);
    }
  });
};

//did not tested
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
          orderData: null,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//all order of user

const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id,
      }).sort({ createdAt: -1, updatedAt: -1 });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
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
      resolve({
        status: "OK",
        message: "SUCCESSS",
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: null,
          productData: null,
          orderData: order,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (e) {
      // console.log('e', e)
      reject(e);
    }
  });
};

const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
      });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
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
      resolve({
        status: "OK",
        message: "SUCCESSS",
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: null,
          productData: null,
          orderData: order,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (e) {
      // console.log('e', e)
      reject(e);
    }
  });
};

const cancelOrderDetails = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = [];
      const promises = data.map(async (order) => {
        // tang so luong ca hang trong
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            selled: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: +order.amount,
              selled: -order.amount,
            },
          },
          { new: true }
        );
        //xoa san pham trong don hang
        if (productData) {
          order = await Order.findByIdAndDelete(id);
          if (order === null) {
            resolve({
              status: "ERR",
              message: "The order is not defined",
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
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results && results[0] && results[0].id;

      if (newData) {
        resolve({
          status: "ERR",
          message: `San pham voi id: ${newData} khong ton tai`,
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
      resolve({
        status: "OK",
        message: `Complete`,
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: null,
          productData: null,
          orderData: order,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//all order for admin to manage
const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find().sort({
        createdAt: -1,
        updatedAt: -1,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: null,
          productData: null,
          orderData: allOrder,
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
  createOrder,
  getAllOrderDetails,
  getOrderDetails,
  cancelOrderDetails,
  getAllOrder,
  findAllProductUserBought,
};
