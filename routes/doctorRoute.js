const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  getProfilesByDoctorId,
} = require("../controllers/profileController");

router.route("/")
.get(getProfilesByDoctorId)

module.exports = router;
