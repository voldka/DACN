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
const createProductSchemaBodyValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().required().label("name"),
    image: Joi.string().required().label("image"),
    type: Joi.string().required().label("type"),
    price: Joi.number().min(0).required().label("price"),
    countInStock: Joi.number().min(0).required().label("countInStock"),
    rating: Joi.number().min(0).max(5).required().label("rating"),

    description: Joi.string().label("description"),
    discount: Joi.number().min(0).max(99).label("discount"),
    selled: Joi.number().min(0).label("selled"),
  });
  return schema.validate(body);
};
const updateProductSchemaBodyValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().label("name"),
    image: Joi.string().label("image"),
    type: Joi.string().label("type"),
    price: Joi.number().min(0).label("price"),
    countInStock: Joi.number().min(0).label("countInStock"),
    rating: Joi.number().min(0).max(5).label("rating"),

    description: Joi.string().label("description"),
    discount: Joi.number().min(0).max(99).label("discount"),
    selled: Joi.number().min(0).label("selled"),
  });
  return schema.validate(body);
};
module.exports = {
  signUpBodyValidation,
  logInBodyValidation,
  refreshTokenBodyValidation,
  updateProfileBodyValidation,
  createProductSchemaBodyValidation,
  updateProductSchemaBodyValidation,
};
