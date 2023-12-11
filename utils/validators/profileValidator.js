const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { getProfileByKey, getProfileById } = require("../../services/profileService");



exports.unAssignProfileValidator = [
  check("doctor_id")
    .notEmpty()
    .withMessage("doctor id is required"),
  check("clinic_id")
    .notEmpty()
    .withMessage("clinic id is required")
    .custom(async (val, { req }) => {

      const profile = await getProfileById(req.params.profile_id)
      const isSubArray = val.every(value => profile.clinic_id.includes(value));

      if (!isSubArray) {
        throw new Error("some of the clinic ids is not existed");
      }
      return true
    })
  , validatorMiddleware
]
// exports.getProfilesValidator = [
//   check("doctor_id").isEmpty().withMessage("invalid doctor ID"),
//   validatorMiddleware,
// ];
exports.createProfileValidator = [
  check("profile_name")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("profile required")
    .custom(async (val, { req }) => {

      const profile = await getProfileByKey({ profile_name: val, doctor_id: req.body.doctor_id })
      if (profile) {
        throw new Error("profile already exists");
      }
      req.body.slug = slugify(val);
      return true;
    }),

  check("doctor_id")
    .notEmpty()
    .withMessage("doctor id is required"),

  check("clinic_id")
    .notEmpty()
    .withMessage("clinic id is required"),
  check("appointmets_per_slot")
    .notEmpty()
    .withMessage("appointmets_per_slot  is required")
    .isNumeric()
    .withMessage("appointmets_per_slot must be a number"),
  check("slots")
    .notEmpty()
    .withMessage("slots must not be empty")
    .isArray()
    .withMessage("slots must be an array of objects"),
  //   check("price")
  //     .notEmpty()
  //     .withMessage("Product price is required")
  //     .isNumeric()
  //     .withMessage("Product price must be a number")
  //     .isLength({ max: 32 })
  //     .withMessage("To long price"),
  //   check("priceAfterDiscount")
  //     .optional()
  //     .isNumeric()
  //     .withMessage("Product priceAfterDiscount must be a number")
  //     .toFloat()
  //     .custom((value, { req }) => {
  //       if (req.body.price <= value) {
  //         throw new Error("priceAfterDiscount must be lower than price");
  //       }
  //       return true;
  //     }),

  //   check("colors")
  //     .optional()
  //     .isArray()
  //     .withMessage("availableColors should be array of string"),
  //   check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  //   check("images")
  //     .optional()
  //     .isArray()
  //     .withMessage("images should be array of string"),
  //   check("category")
  //     .notEmpty()
  //     .withMessage("Product must be belong to a category")
  //     .isMongoId() //it checks only if the id is match the mongo id syntax but doesn't check if it's existed
  //     .withMessage("Invalid ID formate")
  //     .custom((categoryId) =>
  //       Category.findById(categoryId).then((category) => {
  //         if (!category) {
  //           return Promise.reject(
  //             new Error(`No category for this id: ${categoryId}`)
  //           );
  //         }
  //       })
  //     ),

  //   check("subCategories")
  //     .optional()
  //     .isMongoId()
  //     .withMessage("Invalid ID formate")
  //     .custom((subCategoryIds) =>
  //       SubCategory.find({ _id: { $exists: true, $in: subCategoryIds } }).then(
  //         //find will return documents
  //         (result) => {
  //           //result length equal
  //           if (result.length < 1 || result.length !== subCategoryIds.length) {
  //             return Promise.reject(new Error("invalid subCategory ids"));
  //           }
  //         }
  //       )
  //     )
  //     .custom((val, { req }) =>
  //       SubCategory.find({ category: req.body.category }).then(
  //         (subcategories) => {
  //           const subCategoriesIdsInDB = [];
  //           subcategories.forEach((subCategory) => {
  //             subCategoriesIdsInDB.push(subCategory._id.toString());
  //           });

  //           const checker = (target, arr) => target.every((v) => arr.includes(v));
  //           if (!checker(val, subCategoriesIdsInDB)) {
  //             return Promise.reject(
  //               new Error("subCategory doesn't belong to category the ID")
  //             );
  //           }
  //         }
  //       )
  //     ),

  //   check("brand").optional().isMongoId().withMessage("Invalid ID formate"),
  //   check("ratingsAverage")
  //     .optional()
  //     .isNumeric()
  //     .withMessage("ratingsAverage must be a number")
  //     .isLength({ min: 1 })
  //     .withMessage("Rating must be above or equal 1.0")
  //     .isLength({ max: 5 })
  //     .withMessage("Rating must be below or equal 5.0"),
  //   check("ratingsQuantity")
  //     .optional()
  //     .isNumeric()
  //     .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];

// exports.getProductValidator = [
//   check("id").isMongoId().withMessage("Invalid ID formate"),
//   validatorMiddleware,
// ];

// exports.updateProductValidator = [
//   check("id").isMongoId().withMessage("Invalid ID formate"),
//   body("title")
//     .optional()
//     .custom((val, { req }) => {
//       req.body.slug = slugify(val);
//       return true;
//     }),
//   validatorMiddleware,
// ];

exports.deleteProfileValidator = [
  check('profile_id').isMongoId().withMessage("Invalid")

    .custom(async (val) => {
      console.log(val)
      const profile = await getProfileById(val)
      if (!profile) {
        throw new Error("profile is not exist");
      } else if (profile.clinic_id.length > 0) {
        throw new Error("profile is being used by one or more clinic")
      }
      else {

        return true;
      }
    })
  , validatorMiddleware
];
