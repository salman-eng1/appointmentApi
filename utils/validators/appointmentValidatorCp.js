const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const {getAppointmentsByKey} = require("../../services/appointementService");
const { convertTimeStringToDate } = require("../../controllers/timeConverter");
const Appointment=require("../../models/appointementModel")
exports.createAppointmentValidator = [
  check("patient_id")
    .notEmpty()
    .withMessage("patient id is required")
    .custom(async (val, { req }) => {
      // Assuming you have the start and end times available in the request or somewhere else
      const { appointment_Date, appointment_Time } = req.body; // Adjust the field accordingly
      const appointment_start = new Date(
        convertTimeStringToDate(appointment_Date, appointment_Time.start)
      );
      const appointment_end = new Date(
        convertTimeStringToDate(appointment_Date, appointment_Time.end)
      );
      // Adjust the conditions based on your schema
      const appointments = await getAppointmentsByKey({ appointment_start: { $eq: appointment_start },appointment_end: { $eq: appointment_end } });
      
      // const appointments = await Appointment.find({ appointment_start: { $eq: appointment_start },appointment_end: { $eq: appointment_end } });
      
      console.log(appointments.length);
      let count = 0;

      appointments.forEach((element) => {
        if (
          element.patient_id === val &&
          element.appointment_status === "pending"
        ) {
          throw new Error(
            "There is already an appointment within the specified time range.",
            409
          );
        } else if (element.doctor_id === req.body.doctor_Id) {
          count += 1;
        }
      });
      const appointments_per_slot =
        appointments[0]?.profile.appointmets_per_slot || 1;
      if (appointments_per_slot <= count) {
        throw new Error(
          "The slot has been filled, please use different slot",
          409
        );
      }

      return true;
    }),

  validatorMiddleware,
];
