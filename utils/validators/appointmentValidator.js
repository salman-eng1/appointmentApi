const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const appointementService=require("../../services/appointementService")
const {convertTimeStringToDate}=require("../../controllers/timeConverter")

exports.createAppointmentValidator = [
    check('patient_id').notEmpty().withMessage('patient id is required')
    .custom(async (val, { req }) => {
        // Assuming you have the start and end times available in the request or somewhere else
        const {appointment_Date,appointment_Time} = req.body; // Adjust the field accordingly
const appointment_start=convertTimeStringToDate(appointment_Date,appointment_Time.start)
const appointment_end=convertTimeStringToDate(appointment_Date,appointment_Time.end)
        // Adjust the conditions based on your schema
        const appointments = await appointementService.getAppointmentsByKey({
            'doctor_id': req.body.doctor_id,
            'appointment_start': { $gte: appointment_start },
            'appointment_end': { $lte:  appointment_end }

        });
        for(let i=0; i < appointments.length; i++) {
            if (appointments[i].patient_id === req.params.patient_id) {
                throw new Error('There is already an appointment within the specified time range.',409 );
            }
        }
        const appointments_per_slot=appointments[0]?.profile.appointmets_per_slot || 1;

        if (appointments_per_slot <= appointments.length){
            throw new Error('The slot has been filled, please use different slot',409 );
        }




        return true;
    })

    , validatorMiddleware
  ];