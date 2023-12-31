const express = require("express");

const router = express.Router();

const {
  createAppointmentValidator,


} = require("../utils/validators/appointmentValidator");
const {

  createAppointment, 
  getAvailableslotsForDoctorPerDay

} = require("../controllers/appointmentController");
router.post("/:patient_id", createAppointmentValidator,createAppointment);
router.get("/:doctor_id", getAvailableslotsForDoctorPerDay);


module.exports = router;
