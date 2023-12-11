const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

//validation process will get the id from the request as calrified in the following rule

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("invalid brand id"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("brand required")
    .isLength({ min: 3 })
    .withMessage("Too short brand name")
    .isLength({ max: 32 })
    .withMessage("Too long brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true; //if the validation is passed
    }),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("invalid brand id"),
  body("name").optional().custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true; //if the validation is passed
  }),
  validatorMiddleware,
];
exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("invalid brand id"),
  validatorMiddleware,
];
