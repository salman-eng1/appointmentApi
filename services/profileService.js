const Profile = require("../models/profileModel");
const ApiError = require("../utils/apiError");
const SharedRepository = require("../repositories/sharedRepository");


const sharedRepository = new SharedRepository(Profile);
  

  exports.createProfile=  (profile) =>{
    try {
        const newProfile =  sharedRepository.create(profile);
        return newProfile;
    } catch (err) {
        console.log("DB Error >> Cannot Create Profile", err);
    }
}

  exports.getProfileById=(profileId) =>{
    try {
        const profile =  sharedRepository.findById(profileId);
        return profile;
    } catch (err) {
        console.log("DB Error >> Cannot get Profile", err);
    }
}

  exports.getAllProfiles= () =>{
    try {
        const profiles =  sharedRepository.findAll();
        if (profiles) {
            return profiles
        }
    } catch (err) {
        console.log("DB Error >> Cannot get Profiles", err);
    }
}

  exports.deleteProfile=(profileId) =>{
    try {
        const profile =  sharedRepository.findByIdAndDelete(
            profileId
        );

        return profile;
    } catch (err) {
        console.log("DB Error >> Cannot delete Profile", err);
    }
}

//findById must be replaced because Id is not object id supported by mongoose
 exports.updateProfile= async (profileId, newData)=> {
    try {

        const profile = await sharedRepository.findByIdAndUpdate(
            profileId,
            newData,
        );
        return profile;
    } catch (err) {
        console.log("DB Error >> Cannot Update Profile", err);
    }
}

    exports.getProfileByKey=  (key)=> {
    try {
        const profile =  sharedRepository.findOne(key);
        return profile; // Return true if key is unique, false if it already exists
    } catch (err) {
        // Handle database error, log, or throw an exception if needed
        console.log(`Database error while getting Profile by ${key}`, err);
    }
}

  exports.getProfilesById=(key) =>{
    try {
        const profile =  sharedRepository.find(key);
        return profile; // Return true if key is unique, false if it already exists
    } catch (err) {
        // Handle database error, log, or throw an exception if needed
        console.log(`Database error while getting Profiles`, err);
    }
}

exports.removeFromClinicIdArray=(profile_id,clinicIdsToRemove)=>{
    try{
    const updatedClinicsArr= sharedRepository.removeItemsFromArr(
        profile_id ,
        { clinic_id: { $in: clinicIdsToRemove } }
        
      );
return updatedClinicsArr
    }catch{
        console.log(`clinic is not removed successfully`)
    }}