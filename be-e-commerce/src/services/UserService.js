const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/SendEmail.js");
const RefreshToken = require("../models/RefreshToken");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
const { resolve } = require("path");
const { rejects } = require("assert");
const AccessToken = require("../models/AccessToken");

//ok
const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password } = newUser;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        resolve({
          status: "ERR",
          message: "The email is already",
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
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hash = await bcrypt.hash(password, salt);

      const createdUser = await User.create({
        name,
        email,
        password: hash,
      });
      if (createdUser) {
        resolve({
          status: "OK",
          message: "CREATE Thành công",
          data: {
            total: null,
            pageCurrent: null,
            totalPage: null,
            userData: createdUser,
            productData: null,
            orderData: null,
            carouselData: null,
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

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;

    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "Không tìm thấy",
          data: {
            total: null,
            pageCurrent: null,
            totalPage: null,
            userData: checkUser,
            productData: null,
            orderData: null,
            carouselData: null,
            commentData: null,
          },
          access_token: null,
          refresh_token: null,
        });
      }

      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "Mật khẩu không chính xác",
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

      const access_token = await genneralAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      const refresh_token = await genneralRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });

      let id = checkUser._id;
      await RefreshToken.find({ userId: id }).deleteMany().exec();

      let rs = new RefreshToken({
        userId: checkUser._id,
        token: refresh_token,
      }).save();
      resolve({
        status: "OK",
        message: "Thành công",
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: { id: checkUser.id },
          productData: null,
          orderData: null,
          carouselData: null,
          commentData: null,
        },
        access_token: access_token,
        refresh_token: refresh_token,
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
          status: "ERR",
          message: "Đã đăng xuất",
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
        status: "OK",
        message: "Thành công",
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
          status: "ERR",
          message: "Không tìm thấy",
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
        status: "OK",
        message: "Thành công",
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
          status: "ERR",
          message: "Không tìm thấy",
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
        status: "OK",
        message: "Thành công",
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
        status: "OK",
        message: "Thành công",
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
        status: "OK",
        message: "Thành công",
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
          status: "ERR",
          message: "Không tìm thấy",
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
        status: "OK",
        message: "Thành công",
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
          status: "ERR",
          message: "Không tìm thấy",
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

      const comparePassword = bcrypt.compareSync(
        oldPassword,
        checkUser.password
      );

      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "Mật khẩu không chính xác",
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
            status: "OK",
            message: "Cập nhật Thành công",
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
  return new Promise(async (resolve, rejects) => {
    try {
      const user = await User.findOne({ email: data.email }); //1
      if (!user) {
        //2
        resolve({
          status: "ERR",
          message: "Email của tài khoản không tồn tại",
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

      let token = await AccessToken.findOne({ userId: user._id }); //4
      if (!token) {
        //5
        const access_token = await genneralAccessToken({
          id: user.id,
          isAdmin: user.isAdmin,
        }); //6
        token = await new AccessToken({
          userId: user._id,
          token: access_token,
        }).save(); //7
      }

      const link = `${process.env.BASE_URL}/api/user/password-reset/${user._id}/${token.token}`; //8
      await sendEmail.sendResetPasswordEmail(
        user.email,
        "Password reset",
        link
      ); //9
      resolve({
        status: "OK",
        message: "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn",
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
const resetPasswordUser = async (data) => {
  return new Promise(async (resolve, rejects) => {
    try {
      const user = await User.findById(data.userId); //1
      if (!user)
        //2
        resolve({
          status: "ERR",
          message: "Liên kết không tồn tại hoặc đã hết hạn",
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
          status: "ERR",
          message: "Liên kết không tồn tại hoặc đã hết hạn",
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
        status: "OK",
        message: "Đặt lại mật khẩu Thành công",
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
