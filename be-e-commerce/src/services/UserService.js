const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const sendEmail = require('../utils/SendEmail.js');
const AccessToken = require('../models/AccessToken');
const RefreshToken = require('../models/RefreshToken');
const { generateAccessToken, generateRefreshToken } = require('./JwtService');
const generateRandomPassword = require('../utils/generatePassword.js');

const createUser = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        email: payload.email,
      });
      if (checkUser) {
        return reject({
          status: 'error',
          statusCode: 400,
          message: 'Email đã có người khác sử dụng. Vui lòng sử dụng email khác',
        });
      }
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hash = await bcrypt.hash(payload.password, salt);

      const createdUser = await User.create({
        name: payload.name,
        email: payload.email,
        password: hash,
        phone: payload.phone,
        address: payload.address,
      });

      const accessToken = await generateAccessToken({
        id: createdUser._id,
        isAdmin: createdUser.isAdmin,
      });
      const refreshToken = await generateRefreshToken({
        id: createdUser._id,
        isAdmin: createdUser.isAdmin,
      });

      await RefreshToken.find({ userId: createdUser._id }).deleteMany().exec();
      await RefreshToken.create({ userId: createdUser._id, token: refreshToken });

      resolve({
        status: 'OK',
        message: 'Thành công',
        statusCode: 200,
        data: {
          id: createdUser._id,
          name: createdUser.name,
          city: createdUser.city,
          email: createdUser.email,
          phone: createdUser.phone,
          avatar: createdUser.avatar,
          access_token: accessToken,
          address: createdUser.address,
          isAdmin: createdUser.isAdmin,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = async (userLogin) => {
  const { email, password } = userLogin;
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ email });
      if (!checkUser) {
        return reject({
          statusCode: 404,
          status: 'error',
          message: 'Email hoặc mật khẩu không chính xác',
        });
      }

      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      if (!comparePassword) {
        return reject({
          statusCode: 404,
          status: 'error',
          message: 'Email hoặc mật khẩu không chính xác',
        });
      }

      const accessToken = await generateAccessToken({
        id: checkUser._id,
        isAdmin: checkUser.isAdmin,
      });
      const refreshToken = await generateRefreshToken({
        id: checkUser._id,
        isAdmin: checkUser.isAdmin,
      });

      await RefreshToken.find({ userId: checkUser._id }).deleteMany().exec();
      await RefreshToken.create({ userId: checkUser._id, token: refreshToken });

      resolve({
        status: 'OK',
        message: 'Thành công',
        statusCode: 200,
        data: {
          id: checkUser._id,
          name: checkUser.name,
          city: checkUser.city,
          email: checkUser.email,
          phone: checkUser.phone,
          avatar: checkUser.avatar,
          access_token: accessToken,
          address: checkUser.address,
          isAdmin: checkUser.isAdmin,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

const logoutUser = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await RefreshToken.findOne({
        userId: id,
      });
      if (checkUser === null) {
        resolve({
          status: 'ERR',
          message: 'Đã đăng xuất',
          data: {
            total: null,
            pageCurrent: null,
            totalPage: null,
            userData: { id: id },
            productData: null,
            orderData: null,
            carouselData: null,
            commentData: null,
          },
          access_token: null,
          refresh_token: null,
        });
      }
      await RefreshToken.find({ userId: id }).deleteMany().exec();
      resolve({
        status: 'OK',
        message: 'Thành công',
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: { id: id },
          productData: null,
          orderData: null,
          carouselData: null,
          commentData: null,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
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

      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: 'OK',
        message: 'Thành công',
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: updatedUser,
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

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
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

      await User.findByIdAndDelete(id);
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

const deleteManyUser = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({ _id: ids });
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

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find().sort({ createdAt: -1, updatedAt: -1 });
      resolve({
        status: 'OK',
        message: 'Thành công',
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: allUser,
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

const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: id,
      });
      if (user === null) {
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
          userData: user,
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
const changePasswordUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, oldPassword, newPassword } = data;

      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser === null) {
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

      const comparePassword = bcrypt.compareSync(oldPassword, checkUser.password);

      if (!comparePassword) {
        resolve({
          status: 'ERR',
          message: 'Mật khẩu không chính xác',
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
      } else {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const password = await bcrypt.hash(newPassword, salt);

        console.log(checkUser.password);
        checkUser.password = password;
        console.log(checkUser.password);

        const rs = await User.updateOne({ email: checkUser.email }, checkUser);
        let checkUser1 = await User.findOne({
          email: email,
        });
        console.log(checkUser1.password);

        if (rs) {
          resolve({
            status: 'OK',
            message: 'Cập nhật Thành công',
            data: {
              total: null,
              pageCurrent: null,
              totalPage: null,
              userData: rs,
              productData: null,
              orderData: null,
              carouselData: null,
              commentData: null,
            },
            access_token: null,
            refresh_token: null,
          });
        }
      }
    } catch (error) {
      reject(e);
    }
  });
};
const forgotPasswordUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: data.email });
      if (!user) {
        return reject({
          status: 'error',
          statusCode: 404,
          message: `Không tìm thấy người dùng có email: ${data.email}`,
        });
      }
      const subject = 'Khôi phục lại mật khẩu';
      const newPassword = generateRandomPassword();
      const text = `Mật khẩu mới của bạn là: ${newPassword}`;

      const salt = await bcrypt.genSalt(Number(process.env.SALT)); //7
      const hash = await bcrypt.hash(newPassword, salt); //8

      await Promise.all([
        User.findByIdAndUpdate(user._id, { password: hash }),
        sendEmail.sendResetPasswordEmail(user.email, subject, text),
      ]);
      return resolve();
    } catch (error) {
      reject(error);
    }
  });
};
const resetPasswordUser = async (data) => {
  return new Promise(async (resolve, rejects) => {
    try {
      const user = await User.findById(data.userId); //1
      if (!user)
        //2
        resolve({
          status: 'ERR',
          message: 'Liên kết không tồn tại hoặc đã hết hạn',
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

      const token = await AccessToken.findOne({
        //4
        userId: user._id,
        token: data.token,
      });
      if (!token)
        resolve({
          status: 'ERR',
          message: 'Liên kết không tồn tại hoặc đã hết hạn',
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
      //5

      const salt = await bcrypt.genSalt(Number(process.env.SALT)); //7
      const hash = await bcrypt.hash(data.password, salt); //8
      user.password = hash;

      await user.save(); //9
      await token.delete(); //10
      resolve({
        status: 'OK',
        message: 'Đặt lại mật khẩu Thành công',
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
    } catch (error) {
      rejects(error);
    }
  });
};
module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  deleteManyUser,
  changePasswordUser,
  forgotPasswordUser,
  resetPasswordUser,
  logoutUser,
};
