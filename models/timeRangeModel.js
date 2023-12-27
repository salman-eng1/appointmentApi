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
      }
  });

  const Slots = mongoose.model("Slot", timeRangeSchema);
  module.exports = {
    validateTimeFormat,
    timeRangeSchema,
    Slots
  };