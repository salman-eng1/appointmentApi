const mongoose = require("mongoose");


function validateTimeFormat(time) {
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/;

  return regex.test(time);
}


const timeRangeSchema = new mongoose.Schema({
  start: {
    type: String,
    required: [true, "start time is required"],
    validate: {
      validator: validateTimeFormat,
      message: "Invalid start time format. Use hh:mm AM/PM",
    },
  },
  end: {
    type: String,
    required: [true, "end time is required"],
    validate: {
      validator: validateTimeFormat,
      message: "Invalid end time format. Use hh:mm AM/PM",
    },
  },
});



const profileSchema = mongoose.Schema({
  profile_name: {
    type: String,
    required: [true, "profile required"],
    // minlength: [3, "Too short profile name"],
    // maxlength: [32, "Too long profile name"],
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
    minlength: [1, "minimum number of slots is 1"],
    maxlength: [5, "maximum number of slots is 5"]
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





// const timeFormat =new mongoose.Schema({
  
//   hour: {
//       type: Number, required: true, min: 0, max: 23
//   },
//   minute: {
//       type: Number, required: true, min: 0, max: 59
//   },
//   state:{
//     type: String,
//     enum: ["AM","PM"],
//     required: true,
  
// }
// })


// function timeToString(h, m, s) {
//   if (h < 10) h = '0' + h;
//   if (m < 10) h = '0' + h;
//   if (s < 10) h = '0' + h;
//   return h + ':' + m + ':' + s;
// }