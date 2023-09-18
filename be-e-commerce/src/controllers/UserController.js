const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");
const validationSchema = require("../utils/validationSchema");

//ok
const createUser = async (req, res) => {
  try {
    const { error } = validationSchema.signUpBodyValidation(req.body);
    if (error)
      return res
        .status(300)
        .json({ error: true, message: error.details[0].message });

    const response = await UserService.createUser(req.body);
    return response.status == "OK"
      ? res.status(200).json(response)
      : res.status(300).json({
          status: "INFO",
          message: "The email is already",
        });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
//ok
const loginUser = async (req, res) => {
  try {
    const { error } = validationSchema.logInBodyValidation(req.body);
    if (error)
      return res
        .status(300)
        .json({ error: true, message: error.details[0].message });
    const response = await UserService.loginUser(req.body);
    const { refresh_token, ...newReponse } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    return res.status(200).json({ ...newReponse });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
//ok
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    const data = req.body;
    const { error } = validationSchema.updateProfileBodyValidation(data);
    if (error)
      return res
        .status(300)
        .json({ error: true, message: error.details[0].message });

    const response = await UserService.updateUser(userId, data);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
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
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
//ok
const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
//ok
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
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
//ok
const logoutUser = async (req, res) => {
  try {
    if (req.cookies && req.cookies.refresh_token) {
      res.clearCookie("refresh_token");
      return res.status(200).json({
        status: "OK",
        message: "Logout successfully",
      });
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
};
