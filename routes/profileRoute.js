const express = require("express");
const doctorRoute=require("./doctorRoute")
const router = express.Router();

const {
  createProfileValidator,
  AssignProfileValidator,
  unAssignProfileValidator,
  deleteProfileValidator,
  updateProfileValidator
} = require("../utils/validators/profileValidator");
const {
  createNewProfile,
  getAllProfiles,

  updateProfile,
  assignProfile,
  deleteProfile,
  unAssignProfile
} = require("../controllers/profileController");

router.route("/")
.get(getAllProfiles)
.post(createProfileValidator, createNewProfile)

router.route("/:profile_id")
.put(updateProfileValidator,updateProfile)
.delete(deleteProfileValidator, deleteProfile);

// Route for getting all profiles
router.use("/doctor", doctorRoute);



router.route("/unAssignProfile/:profile_id")
  .put(unAssignProfileValidator, unAssignProfile)
// Route for updating and deleting a profile by _id
router.route("/assign/:profile_id")
  .put(AssignProfileValidator,assignProfile)

module.exports = router;
