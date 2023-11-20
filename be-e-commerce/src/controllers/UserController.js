const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");
const validationSchema = require("../utils/validationSchema");
const User = require("../models/UserModel");

const resetPasswordUser = async (req, res) => {
  try {
    const { error } = validationSchema.resetPasswordSchemaBodyValidation(
      req.body
    );
    if (error)
      return res
        .status(401)
        .json({ error: true, message: error.details[0].message });
    //chua bat loi
    let data = {
      userId: req.params.userId,
      token: req.params.token,
      password: req.body.password,
    };

    const response = await UserService.resetPasswordUser(data);

    if (response.status == "OK") {
      return res.status(200).json(response);
    } else {
      return res.status(401).json(response);
    }
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
const forgotPasswordUser = async (req, res) => {
  try {
    const { error } = validationSchema.forgotPassworSchemaBodyValidation(
      req.body
    );
    if (error)
      return res
        .status(401)
        .json({ error: true, message: error.details[0].message });

    const response = await UserService.forgotPasswordUser(req.body);
    if (response.status == "OK") {
      return res.status(200).json(response);
    } else {
      return res.status(401).json(response);
    }
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
const changePasswordUser = async (req, res) => {
  try {
    const { error } = validationSchema.changePasswordSchemaBodyValidation(
      req.body
    );
    if (error)
      return res
        .status(401)
        .json({ error: true, message: error.details[0].message });

    const response = await UserService.changePasswordUser(req.body);
    if (response.status == "OK") {
      return res.status(200).json(response);
    } else {
      return res.status(401).json(response);
    }
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { error } = validationSchema.signUpBodyValidation(req.body);
    if (error)
      return res
        .status(401)
        .json({ error: true, message: error.details[0].message });

    const response = await UserService.createUser(req.body);
    if (response.status == "OK") {
      return res.status(200).json(response);
    } else {
      return res.status(401).json(response);
    }
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { error } = validationSchema.logInBodyValidation(req.body);
    if (error)
      return res
        .status(401)
        .json({ error: true, message: error.details[0].message });
    const response = await UserService.loginUser(req.body);
    const { refresh_token, ...newReponse } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    if (response.status == "OK") {
      return res.status(200).json({ ...newReponse });
    } else {
      return res.status(401).json(response);
    }
  } catch (e) {
    return res.status(401).json({
      message: e,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    
    const imagePath = process.env.BASE_URL + '/uploads/users/' + req.file.filename;
    const data = {
      ...req.body, // Copy all properties from req.body
      avatar: imagePath,
      //  {
      //   // data: fs.readFileSync(path.join("./uploads/" + req.file.filename)),
      //   // contentType: "image/png",
      // },
    };

    const { error } = validationSchema.updateProfileBodyValidation(data);
    if (error)
      return res
        .status(300)
        .json({ error: true, message: error.details[0].message });

    const response = await UserService.updateUser(userId, data);
    
    if (response.status == "OK") {
      return res.status(200).json(response);
    } else {
      return res.status(401).json(response);
    }
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.deleteUser(userId);
    if (response.status == "OK") {
      return res.status(200).json(response);
    } else {
      return res.status(401).json(response);
    }
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
      return res.status(200).json({
        status: "ERR",
        message: "The ids is required",
      });
    }
    const response = await UserService.deleteManyUser(ids);
    if (response.status == "OK") {
      return res.status(200).json(response);
    } else {
      return res.status(401).json(response);
    }
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    if (response.status == "OK") {
      return res.status(200).json(response);
    } else {
      return res.status(401).json(response);
    }
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.getDetailsUser(userId);
    if (response.status == "OK") {
      return res.status(200).json(response);
    } else {
      return res.status(401).json(response);
    }
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    let refreshToken = req.cookies.refresh_token;
    // let token = req.headers.token.split(" ")[1];
    if (!refreshToken) {
      return res.status(401).json({
        status: "ERR",
        message: "The Refresh Token is required",
      });
    }
    const { refresh_token, ...response } =
      await JwtService.refreshTokenJwtService(refreshToken);

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    if (response.status == "OK") {
      return res.status(200).json(response);
    } else {
      return res.status(401).json(response);
    }
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    if (req.cookies && req.cookies.refresh_token) {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(200).json({
          status: "ERR",  
          message: "The userId is required",
        });
      }
      const response = await UserService.logoutUser(userId);
      if (response.status == "OK") {
        res.clearCookie("refresh_token");
        return res.status(200).json(response);
      } else {
        return res.status(401).json(response);
      }
    } else {
      return res.status(200).json({
        status: "OK",
        message: "dont have refresh_token",
      });
    }
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  refreshToken,
  logoutUser,
  deleteMany,
  changePasswordUser,
  forgotPasswordUser,
  resetPasswordUser,
};
