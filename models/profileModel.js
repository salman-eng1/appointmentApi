const mongoose = require("mongoose");
const {timeRangeSchema } = require("./timeRangeModel");


const profileSchema = mongoose.Schema(
  {
    
  profile_name: {
    type: String,
    required: [true, "profile required"],
    min: [3, "Too short profile name"],
    max: [32, "Too long profile name"],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  doctor_id: {
    type: String,
    required: [true, 'doctor id is required']
  },
  clinic_id: {
    type: String,
  },
  clinicWorkPeriod: {
    type: timeRangeSchema,
    required: true,
  },

  appointmets_per_slot: {
    type: Number,
    required: [true, 'number of appointments per slot is required'],
    min: [1, "minimum number of appointments is 1"],
    max: [10, "maximum number of appointments slots is 10"]
  },
  sub_slots: {
    type: Number,
    required: [true, 'number of sub slots is required'],
    min: [1, "minimum number of sub slots is 1"],
    max: [6, "maximum number of sub slots is 10"],
  },
  expired: {
    type: Date,
    required: [true, 'profile expiration date is required']
  },
  cancel_period: {
    type: Number,
    required: [true, 'cancel period is required']

  },
  slots: [timeRangeSchema],

  active: {
    type: Boolean,
    default: false
  }


}, { timestamps: true }

)


module.exports = mongoose.model('Profile', profileSchema);





