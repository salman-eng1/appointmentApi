const Appointment = require("../models/appointementModel");
const SharedRepository = require("../repositories/sharedRepository");

const sharedRepository = new SharedRepository(Appointment);
  

  exports.createAppointment=  (appointment) =>{
    try {
        const newAppointment =  sharedRepository.create(appointment);
        return newAppointment;
    } catch (err) {
        console.log("DB Error >> Cannot Create appointment", err);
    }
}

  exports.getAppointmentById=(appointmentId) =>{
    try {
        const appointment =  sharedRepository.findById(appointmentId);
        return appointment;
    } catch (err) {
        console.log("DB Error >> Cannot get appointment", err);
    }
}

  exports.getAllAppointments= () =>{
    try {
        const appointments =  sharedRepository.findAll();
        if (appointments) {
            return appointments
        }
    } catch (err) {
        console.log("DB Error >> Cannot get appointments", err);
    }
}

  exports.deleteAppointment=(appointmentId) =>{
    try {
        const appointment =  sharedRepository.findByIdAndDelete(
            appointmentId
        );

        return appointment;
    } catch (err) {
        console.log("DB Error >> Cannot delete appointment", err);
    }
}

 exports.updateAppointment= (appointmentId, newData)=> {
    try {
        const appointment =  sharedRepository.findByIdAndUpdate(
            appointmentId,
            newData
        );
        return appointment;
    } catch (err) {
        console.log("DB Error >> Cannot Update appointment", err);
    }
}

    exports.getAppointmentByKey=  (key)=> {
    try {
        const appointment =  sharedRepository.findOne(key);
        return appointment; // Return true if key is unique, false if it already exists
    } catch (err) {
        // Handle database error, log, or throw an exception if needed
        console.log(`Database error while getting appointment by ${key}`, err);
    }
}

  exports.getAppointmentsByKey=(key) =>{
    try {
        const appointment =  sharedRepository.findAndPopulate(key);
        return appointment; // Return true if key is unique, false if it already exists
    } catch (err) {
        // Handle database error, log, or throw an exception if needed
        console.log(`Database error while getting appointments`, err);
    }
}

exports.removeFromClinicIdArray=(appointment_id,clinicIdsToRemove)=>{
    try{
    const updatedClinicsArr= sharedRepository.removeItemsFromArr(
        appointment_id ,
        { clinic_id: { $in: clinicIdsToRemove } }
        
      );
return updatedClinicsArr
    }catch{
        console.log(`clinic is not removed successfully`)
    }}