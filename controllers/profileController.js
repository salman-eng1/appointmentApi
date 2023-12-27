const profileService = require("../services/profileService")
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Profile=require('../models/profileModel')

exports.createNewProfile = asyncHandler(async (req, res, next) => {
    //doctor id will be provided by token
    // and clinic id and start,end work period will be provided by sending http request to clinic service
    const {
        profile_name,
        doctor_id,
        clinic_id,
        clinicWorkPeriod,
        appointmets_per_slot,
        expired,
        cancel_period,
        slots
    } = req.body;
    await profileService.createProfile({
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
    const profile_id = req.params.profile_id
    //doctor id will be provided by token
    // and clinic id and start,end work period will be provided by sending http request to clinic service
    const {
        profile_name,
        doctor_id,
        clinic_id,
        clinicWorkPeriod,
        appointmets_per_slot,
        expired,
        cancel_period,
        slots
    } = req.body;
    await profileService.updateProfile(profile_id, {
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
            res.status(400).json({ error: "failed to update appointment profile", err });
        })
})


exports.getProfilesByDoctorId = asyncHandler(async (req, res, next) => {
    const { doctor_id } = req.params;
    await profileService.getProfilesById({ doctor_id: doctor_id }).then((response) => {
        console.log(response)
        res.status(200).json({ data: response });
    })
        .catch((err) => {
            res.status(403).json({ error: "There are no profiles associated with this account" });
        })
})



exports.getAllProfiles = asyncHandler(async (req, res, next) => {
    await profileService.getAllProfiles().then((response) => {
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
    await profileService.deleteProfile(req.params.profile_id).then((response) => {
        if (response) {
            res.status(200).json({ data: `${response.profile_name} has been deleted successfully` });
        } else {
            res.status(403).json({ data: `profile is not existed` });
        }
    }).catch((err) => {
        console.log("error deleting profile", err)
    })
})


// set all profiles associated with the clinic id to false
// set the target profile to true
exports.assignProfile = asyncHandler(async (req, res, next) => {

    const { profile_id } = req.params

    const { doctor_id, clinic_id } = req.body //doctor id must be replaced with the one in token
    const profile = await profileService.getProfileByKey({ _id: profile_id })


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
    
        await profileService.updateProfile(profile_id, { clinic_id: updatedClinicIds });
    
        res.status(200).json({ data: `Profile has been assigned to the specified clinics:[ ${nonExistentClinicIds} ]` });
    }

})

exports.unAssignProfile= asyncHandler(async (req, res, next) => {

    const { profile_id } = req.params
const clinicToRemove=req.body.clinic_id
    const { doctor_id } = req.body //doctor id must be replaced with the one in token
    const profile = await profileService.removeFromClinicIdArray(profile_id,
        clinicToRemove,
)
res.status(200).json({ data: profile })
})
