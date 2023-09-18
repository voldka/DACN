const Joi = require("joi");

const passwordComplexity = require("joi-password-complexity");
//ok
const signUpBodyValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().required().label("name"),
    email: Joi.string().email().required().label("email"),
    password: passwordComplexity().required().label("password"),
  });
  return schema.validate(body);
};
const logInBodyValidation = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("email"),
    password: Joi.string().required().label("password"),
  });
  return schema.validate(body);
};

const refreshTokenBodyValidation = (body) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required().label("refreshToken"),
  });
  return schema.validate(body);
};
const updateProfileBodyValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().label("name"),
    phone: Joi.string()
      .regex(/^\d{10}$/)
      .label("phone"),
    address: Joi.string().label("address"),
    avatar: Joi.string().label("avatar"),
    city: Joi.string().label("city"),
  });
  return schema.validate(body);
};

module.exports = {
  signUpBodyValidation,
  logInBodyValidation,
  refreshTokenBodyValidation,
  updateProfileBodyValidation,
};
