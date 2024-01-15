const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const {decoded}=require("../jwt")

const {
  getProfileByKey,
  getProfileById,
  getProfilesByDoctorId,
} = require("../../services/profileService");
const ApiError = require("../apiError");


exports.unAssignProfileValidator = [
  check("clinic_id")
    .notEmpty()
    .withMessage("clinic id is required"),
    check("profile_id").notEmpty().withMessage("profile id is required")
    .custom(async (val, { req }) => {
      const token=req.headers.authorization.split(" ")[1]
      const payload =await  decoded(token)
      req.payload=payload
      const  doctor_id  = payload.user_id
     const  profile_id  = val
     try{
      const profile = await getProfileByKey({ _id: profile_id })
      if (!profile) {
        throw new Error("There is no profile for this id", 400)
  
      } else if (profile.doctor_id !== doctor_id) {
        throw new Error("you dont have permission to access this profile", 400)
      }
      else {      
        if (profile.clinic_id !== payload.clinic_id && profile.active === true){
            throw new Error("clinic is not exsisted", 400)
          }
    }
    return true;
     }catch (err){
throw new Error(err)
     }

    }),
  validatorMiddleware,
];

exports.AssignProfileValidator = [
  check("profile_id").notEmpty().withMessage("profile id is required"),
  check("clinic_id")
    .notEmpty()
    .withMessage("clinic id is required")
    .custom(async (val, { req }) => {
      const token=req.headers.authorization.split(" ")[1]
      const payload =await  decoded(token)
      req.payload=payload
      const  doctor_id  = payload.user_id
      const { profile_id } = req.params //doctor id must be replaced with the one in token
      const profile = await getProfileByKey({ _id: profile_id, doctor_id:doctor_id })
  
      //profile.doctor_id must be replaced with the one in the token
      if (!profile) {
        throw new Error("There is no profile with this id", 400)
  
      } else if (profile.doctor_id !== doctor_id) {
        throw new Error("you dont have permission to access this profile", 400)
      }
      else {      
          if (profile.clinic_id === val) {
            throw new Error("profile is already assigned to this clinic", 400)
          }else if (profile.clinic_id !== val && profile.active === true){
            throw new Error("Profile is reserved by another clinic, please release the profile first", 400)
          }
    }
    return true;

  }),
  validatorMiddleware,
];

exports.createProfileValidator = [
  check("profile_name")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("profile required")
    .custom(async (val, { req }) => {
      const token=req.headers.authorization.split(" ")[1]
      const payload =await  decoded(token)
      req.payload=payload
      const profile = await getProfileByKey({
        profile_name: val,
        doctor_id: payload.user_id,
      });
      if (profile) {
        throw new Error("profile already exists");
      }
      req.body.slug = slugify(val);
      return true;
    }),


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
    .notEmpty().withMessage("profile id is required")
    .custom(async (val, { req }) => {
      const token=req.headers.authorization.split(" ")[1]
      const payload =await  decoded(token)
      req.payload=payload
      const profile = await getProfileById(val);
      if (profile.doctor_id === payload.user_id) {
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
  check("appointmets_per_slot")
    .isNumeric()
    .withMessage("appointmets_per_slot must be a number"),
  check("slots")
    .isArray()
    .withMessage("slots must be an array of objects"),
    check("sub_slots")
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
});
      return true;
       }    }
    ),
  validatorMiddleware,
];

exports.deleteProfileValidator = [
  check("profile_id")
    .isMongoId()
    .withMessage("Invalid")

    .custom(async (val, { req }) => {
      const token=req.headers.authorization.split(" ")[1]
      const payload =await  decoded(token)
      req.payload=payload
      const profile = await getProfileById(val);
      if (!profile) {
        throw new Error("profile is not exist");
      } else if (profile.clinic_id !== "") {
        throw new Error("profile is being used by clinic");
      } else if (profile.doctor_id !== payload.user_id) {
        throw new Error("you don't have permission to delete this profile");
      } else {
        return true;
      }
    }),
  validatorMiddleware,
];
