const express = require("express");

const router = express.Router();

const {
  createAppointmentValidator,


} = require("../utils/validators/appointmentValidatorCp");
const {

  createAppointment, 
  getAvailableslotsForDoctorPerDay

} = require("../controllers/appointmentController");
router.post("/:patient_id", createAppointmentValidator,createAppointment);
router.get("/:doctor_Id", getAvailableslotsForDoctorPerDay);


module.exports = router;
