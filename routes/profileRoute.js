const express = require("express");

const router = express.Router();

const {
  createProfileValidator,
  unAssignProfileValidator,
  deleteProfileValidator

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
router.post("/", createProfileValidator, createNewProfile);

// Route for getting all profiles
router.get("/", getAllProfiles);

// Route for getting profiles by id
router.get("/:doctor_id", getProfilesByDoctorId);

router.route("/updateProfile/:_id")
  .put(updateProfile)
router.route("/unAssignProfile/:_id")
  .put(unAssignProfileValidator, unAssignProfile)
// Route for updating and deleting a profile by _id
router.route("/:_id")
  .put(assignProfile)
  .delete(deleteProfileValidator, deleteProfile);

module.exports = router;
