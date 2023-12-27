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
  clinic_id: [{
    type: String,
    required: [true, 'clinic id is required']
  }],
  clinicWorkPeriod: {
    type: timeRangeSchema,
    required: true,
  },

  appointmets_per_slot: {
    type: Number,
    required: [true, 'number of appointments per slot is required'],
    min: [1, "minimum number of slots is 1"],
    max: [5, "maximum number of slots is 5"]
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





