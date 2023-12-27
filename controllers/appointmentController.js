const appointmentService = require("../services/appointementService")
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Appointment = require('../models/appointementModel')
const moment = require('moment');


function convertDateToTimeString(date) {
    const format = 'hh:mm A';
    return moment(date).format(format);
}


function convertTimeStringToDate(dateString, timeString) {
    const format = 'hh:mm A';
    const combinedDateTimeString = `${dateString} ${timeString}`; // Using a dummy date for formatting
    const dateObject = moment(combinedDateTimeString, `YYYY-MM-DD ${format}`, true).toLocaleString();
    return dateObject;
}
exports.createAppointment = asyncHandler(async (req, res, next) => {
    const patient_id = req.params.patient_id
    const { profile, doctor_Id, clinic_Id, appointment_Date, appointment_Time, appointment_Reason } = req.body


    const appointment = await appointmentService.createAppointment({
        profile: profile,
        patient_id: patient_id,
        doctor_id: doctor_Id,
        clinic_id: clinic_Id,
        appointment_start: convertTimeStringToDate(appointment_Date, appointment_Time.start),
        appointment_end: convertTimeStringToDate(appointment_Date, appointment_Time.end),

        appointment_reason: appointment_Reason
    }).then((response) => {
        res.status(200).json({
            data: response
        })
    }).catch((err) => {
        console.log(err)
        res.status(400).json({
            message: "can't create appointment"
        })
    })
})
exports.getAvailableslotsForDoctorPerDay = asyncHandler(async (req, res, next) => {
    const { doctor_id } = req.params;
    const inputDate = req.body.date; // Assuming the date is in the request body
    const date = new Date(`${inputDate}T00:00:00.000Z`);
    const nextDay = new Date(date);
    const arrayOfAppointments=[]
    const appointmentCounts = new Map();

    date.setUTCHours(0, 0, 0, 0);
    nextDay.setUTCDate(date.getUTCDate() + 1);


    const appointments = await appointmentService.getAppointmentsByKey({
        doctor_id: doctor_id,
        appointment_start: {
            $gte: date,
            $lt: nextDay
        }
    }).then(async (response) => {
        const appointmets_per_slot = response[0].profile.appointmets_per_slot
        const increasingVal = 60 / appointmets_per_slot;
        const availableSlots = response[0].profile.slots
        const finalRespose = []
        availableSlots.forEach((item, index) => {
            const startTime = moment(item.start, 'hh:mm A');
            const endTime = moment(item.end, 'hh:mm A');
            let temp = 0
            const object = {}
            const newSlots = [];



            for (let i = 0; i < appointmets_per_slot; i++) {
                const newStartTime = startTime.clone().add(temp, 'minutes');
                const newEndString = newStartTime.clone().add(increasingVal, 'minutes');

                const startTimeString = newStartTime.format('hh:mm A');
                const endTimeString = newEndString.format('hh:mm A');

                const resultTimingString = `${startTimeString} - ${endTimeString}`;
                temp += increasingVal


                newSlots.push(resultTimingString)

            }
            mainSlot = `${startTime.format('hh:mm A')} - ${endTime.format('hh:mm A')}`
            object[`slot${index}`] = {
                parentSlot: mainSlot,
                subSlots: newSlots
            }
            finalRespose.push(object)
        }
        )

       const numReservedAppointments= response.forEach((item) => {
           const start= convertDateToTimeString(item.appointment_start);
           const end= convertDateToTimeString(item.appointment_end);
arrayOfAppointments.push(start)
        });

        
        arrayOfAppointments.forEach(appointment => {
            appointmentCounts.set(appointment, (appointmentCounts.get(appointment) || 0) + 1);
        });
        for (const [appointment, count] of appointmentCounts) {
            // if (count >= appointmets_per_slot){
            //     finalRespose.
            // }
            console.log(`${appointment}: ${count} times`);
        }

        res.json({ data: finalRespose });
    }).catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'please use format yyyy:mm:dd' });
    });

});
