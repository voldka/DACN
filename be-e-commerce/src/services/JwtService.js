const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const RefreshToken = require('../models/RefreshToken');
dotenv.config();

const generateAccessToken = async (payload) => {
  const access_token = jwt.sign(
    {
      ...payload,
    },
    process.env.ACCESS_TOKEN_PRIVATE_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
  );

  return access_token;
};

const generateRefreshToken = async (payload) => {
  const refresh_token = jwt.sign(
    {
      ...payload,
    },
    process.env.REFRESH_TOKEN_PRIVATE_KEY,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION },
  );
  return refresh_token;
};

const refreshTokenJwtService = (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN_PRIVATE_KEY, async (err, user) => {
        if (err) {
          resolve({
            status: 'error',
            message: 'Lỗi Xác thực',
          });
        }
        const access_token = await generateAccessToken({
          id: user?.id,
          isAdmin: user?.isAdmin,
        });

        await RefreshToken.find({ userId: user?.id }).deleteMany();
        const refresh_token = await generateRefreshToken({
          id: user?.id,
          isAdmin: user?.isAdmin,
        });
        let rs = new RefreshToken({
          userId: user?.id,
          token: refresh_token,
        }).save();

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
          },
          access_token,
          refresh_token,
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  refreshTokenJwtService,
};
