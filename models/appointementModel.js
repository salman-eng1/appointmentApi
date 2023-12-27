const mongoose=require("mongoose")
const {timeRangeSchema } = require("./timeRangeModel");


const appointementSchema=mongoose.Schema({
    profile: {
        type: mongoose.Schema.ObjectId,
        ref: 'Profile',
        required: true,
      },
    doctor_id: {
        type: String,
        required: [true, 'doctor id is required']
    },
    clinic_id: {
        type: String,
        required: [true, 'clinic id is required']
    },
    patient_id: {
        type: String,
        required: [true, 'patient id is required']
    },
    appointment_start: {
        type: Date,
        required: [true, 'appointment start is required'],
    },
    appointment_end:{
        type: Date,
        required: [true, 'appointment end is required'],
    },
    // appointment_time: {
    //     type: timeRangeSchema,
    //     required: [true, 'appointment time is required']
    // },
    appointment_status: {
        type: String,
        default: "pending",
        enum: ['pending', 'confirmed', 'cancelled']
    },
    appointment_reason: {
        type: String,
    }
}, { timestamps: true })


module.exports = mongoose.model('Appointement', appointementSchema);


