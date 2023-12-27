const Slots = require("../models/timeRangeModel");
const SharedRepository = require("../repositories/sharedRepository");
const sharedRepository = new SharedRepository(Slots);
  

  exports.createTime=  (time) =>{
    try {
        const newTime =  sharedRepository.create(time);
        return newTime;
    } catch (err) {
        console.log("DB Error >> Cannot Create Time", err);
    }
}

  exports.getTimeById=(timeId) =>{
    try {
        const time =  sharedRepository.findById(timeId);
        return time;
    } catch (err) {
        console.log("DB Error >> Cannot get time", err);
    }
}

  exports.getAllTimes= () =>{
    try {
        const times =  sharedRepository.findAll();
        if (times) {
            return times
        }
    } catch (err) {
        console.log("DB Error >> Cannot get times", err);
    }
}

  exports.deleteTime=(timeId) =>{
    try {
        const time =  sharedRepository.findByIdAndDelete(
            timeId
        );

        return time;
    } catch (err) {
        console.log("DB Error >> Cannot delete time", err);
    }
}

 exports.updateTime= (timeId, newData)=> {
    try {
        const time =  sharedRepository.findByIdAndUpdate(
            timeId,
            newData
        );
        return time;
    } catch (err) {
        console.log("DB Error >> Cannot Update time", err);
    }
}

    exports.getTimeByKey=  (key)=> {
    try {
        const time =  sharedRepository.findOne(key);
        return time; // Return true if key is unique, false if it already exists
    } catch (err) {
        // Handle database error, log, or throw an exception if needed
        console.log(`Database error while getting time by ${key}`, err);
    }
}

  exports.getTimesByKey=(key) =>{
    try {
        const time =  sharedRepository.find(key);
        return time; // Return true if key is unique, false if it already exists
    } catch (err) {
        // Handle database error, log, or throw an exception if needed
        console.log(`Database error while getting times`, err);
    }
}
