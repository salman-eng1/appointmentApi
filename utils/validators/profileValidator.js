const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const {
  getProfileByKey,
  getProfileById,
  getProfilesByDoctorId,
} = require("../../services/profileService");
const ApiError = require("../apiError");

exports.unAssignProfileValidator = [
  check("profile_id").notEmpty().withMessage("profile id is required"),
  check("clinic_id")
    .notEmpty()
    .withMessage("clinic id is required")
    .custom(async (val, { req }) => {
      const profile = await getProfileById(req.body.profile_id);
      const isSubArray = val.every((value) =>
        profile.clinic_id.includes(value)
      );
      if (!isSubArray) {
        throw new Error("some of the clinic ids is not existed");
      }
      return true;
    }),
  validatorMiddleware,
];

// exports.AssignProfileValidator = [
//   check("profile_id")
//     .notEmpty()
//     .withMessage("profile id is required"),
//   check("clinic_id")
//     .notEmpty()
//     .withMessage("clinic id is required")
//     .custom(async (val, { req }) => {

//       const profile = await getProfileByKey({doctor_id:req.params.doctor_id, clinic_id: {$in: val}})
//       const isSubArray = val.every(value => profile.clinic_id.includes(value));
//       if (!isSubArray) {
//         throw new Error("some of the clinic ids is not existed");
//       }
//       return true
//     })
//   , validatorMiddleware
// ]

exports.createProfileValidator = [
  check("profile_name")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("profile required")
    .custom(async (val, { req }) => {
      const profile = await getProfileByKey({
        profile_name: val,
        doctor_id: req.params.doctor_id,
      });
      if (profile) {
        throw new Error("profile already exists");
      }
      req.body.slug = slugify(val);
      return true;
    }),

  check("doctor_id").notEmpty().withMessage("doctor id is required"),

  check("clinic_id").optional(),
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
  check("sub_slots")
    .notEmpty()
    .withMessage("sub_slots must be provided")
    .custom(async (val,{req}) => {
      if (val % 2 !== 0)
        throw new Error("number of sub slots must be divisable by 2");
   else{
    const slots=req.body.slots
    let subSlots=req.body.sub_slots;
    const increasingVal = 60 / subSlots;
 slots.forEach(element => {
  const date1 = new Date(`1970-01-01 ${element.start}`);
  const date2 = new Date(`1970-01-01 ${element.end}`);
  const minutesDifference = (date2 - date1) / (1000 * 60);
if (minutesDifference % increasingVal !==0){
  throw new Error(`The slot ${element.start}-${element.end} cannot be devided into ${subSlots} sub slots` )
}
  console.log(minutesDifference)
});
      return true;
       }    }
    ),
  validatorMiddleware,
];
exports.updateProfileValidator = [
  check("profile_id")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("profile required")
    .custom(async (val, { req }) => {
      const profile = await getProfileById(val);
      if (profile.doctor_id === req.params.doctor_id) {
        if (profile.profile_name === req.body.profile_name) {
          throw new Error("profile already exists");
        } else {
          req.body.slug = slugify(val);
          return true;
        }
      } else {
        throw new Error("you don't have permission to access this profile");
      }
    }),
  check("profile_id").notEmpty().withMessage("profile id is required"),
  // .custom(async (val, { req }) => {

  //   const profile=await getProfileById(val)
  //   if (!profile.doctor_id === req.body.doctor_id){
  //     return next(new ApiError("the profile id is not assoiciated with this account"))
  //   }
  //   req.body.slug = slugify(val);
  //   return true;
  // }),
  check("clinic_id").notEmpty().withMessage("clinic id is required"),
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
  validatorMiddleware,
];

exports.deleteProfileValidator = [
  check("profile_id")
    .isMongoId()
    .withMessage("Invalid")

    .custom(async (val, { req }) => {
      console.log(val);
      const profile = await getProfileById(val);
      if (!profile) {
        throw new Error("profile is not exist");
      } else if (profile.clinic_id !== "") {
        throw new Error("profile is being used by clinic");
      } else if (profile.doctor_id !== req.params.doctor_id) {
        throw new Error("you don't have permission to delete this profile");
      } else {
        return true;
      }
    }),
  validatorMiddleware,
];
