const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

//validation process will get the id from the request as calrified in the following rule

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subCategory id"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory required")
    .isLength({ min: 2 })
    .withMessage("Too short subCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name"),
  check("category")
    .notEmpty()
    .withMessage("subCategory must belong to parent category")
    .isMongoId()
    .withMessage("invalid category id")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true; //if the validation is passed
    }),
  validatorMiddleware,
];
exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subCategory id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true; //if the validation is passed
  }),

  validatorMiddleware,
];
exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subCategory id format"),
  validatorMiddleware,
];
