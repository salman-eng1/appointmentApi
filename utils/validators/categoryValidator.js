const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

//validation process will get the id from the request as calrified in the following rule

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true; //if the validation is passed
    }),
  validatorMiddleware,
];
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  body("name").optional().custom((val, { req }) => {
    req.body.slug = slugify(val);

    return true; //if the validation is passed
  }),
  validatorMiddleware,
];
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  validatorMiddleware,
];
