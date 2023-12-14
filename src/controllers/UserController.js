const UserService = require('../services/UserService');
const JwtService = require('../services/JwtService');
const validationSchema = require('../utils/validationSchema');

const resetPasswordUser = async (req, res) => {
  try {
    const { error } = validationSchema.resetPasswordSchemaBodyValidation(req.body);
    if (error) {
      return res.status(401).json({ error: true, message: error.details[0].message });
    }
    const data = {
      userId: req.params.userId,
      token: req.params.token,
      password: req.body.password,
    };

    const response = await UserService.resetPasswordUser(data);

    if (response.status == 'OK') {
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
    const { error } = validationSchema.forgotPasswordSchemaBodyValidation(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: error.details[0].message,
      });
    }

    await UserService.forgotPasswordUser(req.body);
    return res.status(204).send();
  } catch (error) {
    return res.status(error.statusCode || 500).json(error);
  }
};

const changePasswordUser = async (req, res) => {
  try {
    const { error } = validationSchema.changePasswordSchemaBodyValidation(req.body);
    if (error) return res.status(401).json({ error: true, message: error.details[0].message });

    const response = await UserService.changePasswordUser(req.body);
    if (response.status == 'OK') {
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
    if (error) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: error.details[0].message,
      });
    }

    const response = await UserService.createUser(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.statusCode || 500).json(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { error } = validationSchema.logInBodyValidation(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: error.details[0].message,
      });
    }

    const response = await UserService.loginUser(req.body);
    const { refresh_token, ...results } = response;
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
    });

    if (response.status == 'OK') {
      return res.status(200).json({ ...results });
    } else {
      return res.status(401).json(response);
    }
  } catch (e) {
    return res.status(e.statusCode || 500).json(e);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Vui lòng cung cấp userId',
      });
    }

    const data = {
      ...req.body,
    };

    if (req.file) {
      data.avatar = process.env.BASE_URL + '/uploads/users/' + req.file.filename;
    }

    const { error } = validationSchema.updateProfileBodyValidation(data);
    if (error) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: error.details[0].message,
      });
    }

    const response = await UserService.updateUser(userId, data);
    response.id = response._id.toString();
    return res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'Cập nhật thành công',
      data: response,
    });
  } catch (e) {
    console.log(e);
    return res.status(e.statusCode || 500).json(e);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Vui lòng cung cấp userId',
      });
    }
    await UserService.deleteUser(userId);
    return res.status(204).send();
  } catch (e) {
    return res.status(e.statusCode || 500).json(e);
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The ids is required',
      });
    }
    const response = await UserService.deleteManyUser(ids);
    if (response.status == 'OK') {
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
    const user = await UserService.getAllUsers();
    return res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'Thành công',
      data: user,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: e.message,
    });
  }
};

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId || isNaN(+userId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Id người dùng không hợp lệ',
      });
    }
    const response = await UserService.getDetailsUser(userId);
    if (response.status == 'OK') {
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
    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Không tìm thấy refreshToken đính kèm',
      });
    }
    const { refresh_token, ...response } = await JwtService.refreshTokenJwtService(refreshToken);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
    });

    if (response.status == 'OK') {
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
      if (!userId || isNaN(+userId)) {
        return res.status(400).json({
          status: 'error',
          message: 'Id người dùng không hợp lệ',
        });
      }
      const response = await UserService.logoutUser(userId);
      if (response.status == 'OK') {
        res.clearCookie('refresh_token');
        return res.status(200).json(response);
      } else {
        return res.status(401).json(response);
      }
    } else {
      return res.status(200).json({
        status: 'OK',
        message: 'dont have refresh_token',
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
