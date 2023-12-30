const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Profile=require('../models/profileModel')
const {getAllProfiles,createProfile,removeFromClinicIdArray,getProfileByKey,getProfilesById,updateProfile,deleteProfile}=require("../services/profileService")

exports.createNewProfile = asyncHandler(async (req, res, next) => {
    //doctor id will be provided by token
    // and clinic id and start,end work period will be provided by sending http request to clinic service
const doctor_id=req.params.doctor_id

    const {
        profile_name,
        clinic_id,
        clinicWorkPeriod,
        appointmets_per_slot,
        expired,
        cancel_period,
        slots
    } = req.body;
    await createProfile({
        profile_name: profile_name,
        doctor_id: doctor_id,
        clinic_id: clinic_id,
        clinicWorkPeriod: clinicWorkPeriod,
        appointmets_per_slot: appointmets_per_slot,
        expired: expired,
        cancel_period: cancel_period,
        slots: slots
    }).then((response) => {
        res.status(201).json({ data: response });
    })
        .catch((err) => {
            res.status(400).json({ error: "failed to create appointment profile", err });
        })
})





exports.updateProfile = asyncHandler(async (req, res, next) => {
    const doctor_id = req.params.doctor_id
    //doctor id will be provided by token
    // and clinic id and start,end work period will be provided by sending http request to clinic service
    const {
        profile_name,
        profile_id,
        clinicWorkPeriod,
        appointmets_per_slot,
        cancel_period,
        slots
    } = req.body;
    try{
    const newprofile={
        profile_name: profile_name,
        clinicWorkPeriod: clinicWorkPeriod,
        appointmets_per_slot: appointmets_per_slot,
        cancel_period: cancel_period,
        slots: slots}
  const response= await updateProfile(profile_id, newprofile)
    res.status(201).json({ data: response });

    }
        catch(err){
            console.log(err)
            res.status(400).json({ error: "failed to update appointment profile",  err: `${err}` });
        }
})


exports.getProfilesByDoctorId = asyncHandler(async (req, res, next) => {
    try{

    const doctor_id = req.params.doctor_id;
        const profiles=await getProfilesById({ doctor_id: doctor_id })
    
        if(profiles.length > 0){
            console.log("hi")

            res.status(200).json({ data: profiles });
     }
    else{
        res.status(403).json({ error: "There are no profiles associated with this account" });
    }
}
        catch(err){
            res.status(403).json({ error: "can't get profiles"});
        }
    })
    


exports.getAllProfiles = asyncHandler(async (req, res, next) => {
    await getAllProfiles().then((response) => {
        if (response.length > 0) {
            res.status(200).json({ data: response });
        } else {
            res.status(403).json({ data: "there are no profile" });
        }
    }).catch((err) => {
        console.log("error getting all profiles", err)
    })
})



exports.deleteProfile = asyncHandler(async (req, res, next) => {
    try {
       const profile= await deleteProfile(req.body.profile_id)

            res.status(200).json({ data: `${profile.profile_name} has been deleted successfully` });

        
    }catch(err){
        console.log("error deleting profile", err)
    
}
})


// set all profiles associated with the clinic id to false
// set the target profile to true
exports.assignProfile = asyncHandler(async (req, res, next) => {

    const { doctor_id } = req.params

    const { profile_id, clinic_id } = req.body //doctor id must be replaced with the one in token
    const profile = await getProfileByKey({ _id: profile_id, doctor_id:doctor_id })

    //profile.doctor_id must be replaced with the one in the token
    if (!profile) {
        next(new ApiError("There is no profile with this id", 400))

    } else if (profile.doctor_id !== doctor_id) {
        return res.status(400).json({ data: `There is no profile for doctor Id: ${doctor_id}` })
    }

    else {
        const nonExistentClinicIds = clinic_id.filter(id => !profile.clinic_id.includes(id));
    
        if (nonExistentClinicIds.length === 0) {
            return res.status(400).json({ error: "Profile is already assigned to all these clinics" });
        }
    
        const updatedClinicIds = [...profile.clinic_id, ...nonExistentClinicIds];
    
        await updateProfile(profile_id, { clinic_id: updatedClinicIds,active: true });
    
        res.status(200).json({ data: `Profile has been assigned to the specified clinics:[ ${nonExistentClinicIds} ]` });
    }

})

exports.unAssignProfile= asyncHandler(async (req, res, next) => {
    const { profile_id } = req.body
const clinicToRemove=req.body.clinic_id
    const { doctor_id } = req.params //doctor id must be replaced with the one in token
    const profile = await removeFromClinicIdArray(profile_id,
        clinicToRemove,
)
if (profile.clinic_id.length <= 0){
    await updateProfile(profile_id, {active: false})
}
res.status(200).json({ data: profile })
})
