const express = require("express");

const router = express.Router();

const {
  createProfileValidator,
  unAssignProfileValidator,
  deleteProfileValidator,
  updateProfileValidator
} = require("../utils/validators/profileValidator");
const {
  getProfilesByDoctorId,
  createNewProfile,
  getAllProfiles,

  updateProfile,
  assignProfile,
  deleteProfile,
  unAssignProfile
} = require("../controllers/profileController");

router.get("/", getAllProfiles);

router.route("/:doctor_id")
.post(createProfileValidator, createNewProfile)
.get(getProfilesByDoctorId)
.put(updateProfileValidator,updateProfile)
.delete(deleteProfileValidator, deleteProfile);

// Route for getting all profiles
router.get("/", getAllProfiles);

// Route for getting profiles by id


router.route("/unAssignProfile/:doctor_id")
  .put(unAssignProfileValidator, unAssignProfile)
// Route for updating and deleting a profile by _id
router.route("/assign/:doctor_id")
  .put(assignProfile)

module.exports = router;
