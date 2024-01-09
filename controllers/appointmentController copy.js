const {getAppointmentsByKey,getAppointmentByKey,createAppointment,updateAppointment,deleteAppointment} = require("../services/appointementService");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Appointment = require("../models/appointementModel");
const moment = require("moment");
const {
  convertDateToTimeString,
  convertTimeStringToDate,
} = require("./timeConverter");
const { getProfileById, getProfileByKey } = require("../services/profileService");

exports.createAppointment = async (req, res) => {
  try {
    const patient_id = req.params.patient_id;
    const {
      profile,
      doctor_Id,
      clinic_Id,
      appointment_Date,
      appointment_Time,
      appointment_Reason,
    } = req.body;

    const appointment = await createAppointment({
      profile,
      patient_id,
      doctor_id: doctor_Id,
      clinic_id: clinic_Id,
      appointment_start: convertTimeStringToDate(
        appointment_Date,
        appointment_Time.start
      ),
      appointment_end: convertTimeStringToDate(
        appointment_Date,
        appointment_Time.end
      ),
      appointment_reason: appointment_Reason,
    });

    res.status(200).json({
      data: appointment,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "Can't create appointment",
    });
  }
};


exports.getAvailableslotsForDoctorPerDay = asyncHandler(
  async (req, res) => {
    try {
      const { doctor_Id } = req.params;
      const clinic_Id=req.body.clinic_Id
      const inputDate = req.body.date;
      const date = new Date(`${inputDate}T00:00:00.000Z`);
      const nextDay = new Date(date);

      date.setUTCHours(0, 0, 0, 0);
      nextDay.setUTCDate(date.getUTCDate() + 1);


      // Fetch appointments for the specified doctor and date range
      const response = await getAppointmentsByKey({
        doctor_id: doctor_Id,
        appointment_start: {
          $gte: date,
          $lte: nextDay,
        },
      });
         const profile=await getProfileByKey({doctor_id:doctor_Id})
      // Extract relevant information from the response
      const appointmets_per_slot =profile.appointmets_per_slot;
        const subSlots =profile.sub_slots;
      const increasingVal = 60 / subSlots;
      const availableSlots =profile.slots;
      const finalResponse = [];

if (response.length ===0){

  for (let index = 0; index < availableSlots.length; index++) {
    const item = availableSlots[index];
    const startTime = moment(item.start, "hh:mm A");
    const endTime = moment(item.end, "hh:mm A");
    const object = {};
    const newSlots = [];  
      
    // Generate newSlots based on the available time slots
    for (let i = 0; i < subSlots; i++) {
      const newStartTime = startTime.clone().add(i * increasingVal, "minutes");  // Use i to calculate newStartTime
      const newEndString = newStartTime.clone().add(increasingVal, "minutes");
  
      const startTimeString = newStartTime.format("hh:mm A");
      const endTimeString = newEndString.format("hh:mm A");
      const resultTimingString = `${startTimeString} - ${endTimeString}`;
  
      // Check if the appointment is not fully booked
   
        newSlots.push(resultTimingString);
      }
    
  
    if (newSlots.length === 0) {
      continue;
    }
  
    // Build the final response object
    const mainSlot = `${startTime.format("hh:mm A")} - ${endTime.format("hh:mm A")}`;
    object[`slot${index}`] = {
      parentSlot: mainSlot,
      subSlots: newSlots,
    };
    finalResponse.push(object);
  }

}else{
      // Create a set of unique appointment start times
      const uniqueAppointmentsSet = new Set(
        response.map((item) => convertDateToTimeString(item.appointment_start))
      );

      // Create a map to store the count of each unique appointment start time
      const appointmentCounts = new Map();
      
      // Calculate the counts based on the unique appointment start times
      uniqueAppointmentsSet.forEach((appointment) => {
        const count = response.filter(
          (item) => convertDateToTimeString(item.appointment_start) === appointment
        ).length;
        appointmentCounts.set(appointment, count);
      });


      
await generateSubSlots(appointmets_per_slot,subSlots,increasingVal,availableSlots,appointmentCounts,finalResponse)
}
      res.json({ data: finalResponse });
    } catch (error) {
      res.status(500).json({ error: "Please use the format yyyy:mm:dd." });
    }
  }
);




 generateSubSlots=(appointmets_per_slot,subSlots,increasingVal,availableSlots,appointmentCounts,finalResponse)=>
 {
  

for (let index = 0; index < availableSlots.length; index++) {
  const item = availableSlots[index];
  const startTime = moment(item.start, "hh:mm A");
  const endTime = moment(item.end, "hh:mm A");
  const object = {};
  const newSlots = [];  
  // Generate newSlots based on the available time slots
  for (let i = 0; i < subSlots; i++) {
    const newStartTime = startTime.clone().add(i * increasingVal, "minutes");  // Use i to calculate newStartTime
    const newEndString = newStartTime.clone().add(increasingVal, "minutes");

    const startTimeString = newStartTime.format("hh:mm A");

    const endTimeString = newEndString.format("hh:mm A");
    const resultTimingString = `${startTimeString} - ${endTimeString}`;
    // Check if the appointment is not fully booked
    if (!(appointmentCounts.get(`${startTimeString}`) >= appointmets_per_slot)) {
      newSlots.push(resultTimingString);
    }else {
    continue;
    }
  }

  if (newSlots.length === 0) {
    continue;
  }

  // Build the final response object
  const mainSlot = `${startTime.format("hh:mm A")} - ${endTime.format("hh:mm A")}`;
  object[`slot${index}`] = {
    parentSlot: mainSlot,
    subSlots: newSlots,
  };
  finalResponse.push(object);
  
}
 }