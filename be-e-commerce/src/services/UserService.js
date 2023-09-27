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
          message: "CREATE SUCCESS",
          data: createdUser,
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
          message: "The user is not defined",
        });
      }

      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "The password or user is incorrect",
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
        message: "SUCCESS",
        access_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
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
          message: "The user is not defined",
        });
      }

      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedUser,
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
          message: "The user is not defined",
        });
      }

      await User.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete user success",
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
        message: "Delete user success",
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
        message: "Success",
        data: allUser,
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
          message: "The user is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCESS",
        data: user,
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
          message: "The user is not defined",
        });
      }

      const comparePassword = bcrypt.compareSync(
        oldPassword,
        checkUser.password
      );

      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "The password or user is incorre6ct",
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
            message: "UPDATE SUCCESS",
            data: rs,
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
      const user = await User.findOne({ email: data.email });
      if (!user) {
        resolve({
          status: "ERR",
          message: "user with given email doesn't exist",
        });
      }

      let token = await AccessToken.findOne({ userId: user._id });
      if (!token) {
        const access_token = await genneralAccessToken({
          id: user.id,
          isAdmin: user.isAdmin,
        });
        token = await new AccessToken({
          userId: user._id,
          token: access_token,
        }).save();
      }

      const link = `${process.env.BASE_URL}/api/user/password-reset/${user._id}/${token.token}`;
      await sendEmail.sendResetPasswordEmail(
        user.email,
        "Password reset",
        link
      );
      resolve({
        status: "OK",
        message: "password reset link sent to your email account",
      });
    } catch (error) {
      rejects(error);
    }
  });
};
const resetPasswordUser = async (data) => {
  return new Promise(async (resolve, rejects) => {
    try {
      const user = await User.findById(data.userId);
      if (!user)
        return resolve({
          status: "ERR",
          message: "Invalid link or expired",
        });

      const token = await AccessToken.findOne({
        userId: user._id,
        token: data.token,
      });
      if (!token)
        return resolve({
          status: "ERR",
          message: "Invalid link or expired",
        });

      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hash = await bcrypt.hash(data.password, salt);
      user.password = hash;

      await user.save();
      await token.delete();

      return resolve({
        status: "OK",
        message: "password reset sucessfully.",
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
};
