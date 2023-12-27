const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const appointementService=require("../../services/appointementService")
const moment = require('moment');



function convertTimeStringToDate(dateString,timeString) {
    const format = 'hh:mm A';
    const combinedDateTimeString = `${dateString} ${timeString}`; // Using a dummy date for formatting
    const dateObject = moment(combinedDateTimeString, `YYYY-MM-DD ${format}`,true).toDate();
    return dateObject;
  }

exports.createAppointmentValidator = [
    check('patient_id').notEmpty().withMessage('patient id is required')
    .custom(async (val, { req }) => {
        // Assuming you have the start and end times available in the request or somewhere else
        const {appointment_Date,appointment_Time} = req.body; // Adjust the field accordingly
const appointment_start=convertTimeStringToDate(appointment_Date,appointment_Time.start)
const appointment_end=convertTimeStringToDate(appointment_Date,appointment_Time.end)
        // Adjust the conditions based on your schema
        const appointments = await appointementService.getAppointmentsByKey({
            'patient_id': val,
            'appointment_start': { $gte: appointment_start },
            'appointment_end': { $lte:  appointment_end }

        });
        if (appointments.length > 0) {
            throw new Error('There is already an appointment within the specified time range.',409 );
        }

        return true;
    })

    , validatorMiddleware
  ];