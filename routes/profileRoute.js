const express = require("express");

const router = express.Router();

const {
  createProfileValidator,
  unAssignProfileValidator
    //   deleteUserValidator,
  //   createUserValidator,
  //   changeUserPasswordValidator,
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

router.route("/updateProfile/:profile_id")
  .put(updateProfile)
  router.route("/unAssignProfile/:profile_id")
  .put(unAssignProfileValidator,unAssignProfile)
// Route for updating and deleting a profile by profile_id
router.route("/:profile_id")
  .put(assignProfile)
  .delete(deleteProfile);

module.exports = router;
