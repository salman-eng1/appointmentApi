const moment=require('moment');

exports.convertDateToTimeString=(date) =>{
    const format = "hh:mm A";
    return moment(date).format(format);
  }


exports.convertTimeStringToDate=(dateString, timeString) =>{
    const format = "hh:mm A";
    const combinedDateTimeString = `${dateString} ${timeString}`; // Using a dummy date for formatting
    const dateObject = moment(
      combinedDateTimeString,
      `YYYY-MM-DD ${format}`,
      true
    ).toLocaleString();
    return dateObject;
  }