const asyncHandler = require("express-async-handler");
const {decoded}=require("../utils/jwt")
const ApiError = require("../utils/apiError");
const Profile = require("../models/profileModel");
const {
  getAllProfiles,
  createProfile,
  getProfilesById,
  updateProfile,
  deleteProfile,
} = require("../services/profileService");

exports.createNewProfile = asyncHandler(async (req, res, next) => {
  const { user_id, clinic_id, role } = req.payload;
  //doctor id will be provided by token
  // and clinic id and start,end work period will be provided by sending http request to clinic service
  // const user_id=req.params.doctor_id

  const {
    profile_name,
    clinicWorkPeriod,
    appointmets_per_slot,
    sub_slots,
    expired,
    cancel_period,
    slots,
  } = req.body;
  await createProfile({
    profile_name: profile_name,
    doctor_id: user_id,
    clinic_id: clinic_id,
    clinicWorkPeriod: clinicWorkPeriod,
    appointmets_per_slot: appointmets_per_slot,
    sub_slots,
    expired: expired,
    cancel_period: cancel_period,
    slots: slots,
  })
    .then((response) => {
      res.status(201).json({ data: response });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ error: "failed to create appointment profile", err });
    });
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const doctor_id = req.payload.user_id;
  const profile_id = req.params.profile_id;

  // and clinic id and start,end work period will be provided by sending http request to clinic service
  const {
    profile_name,
    clinicWorkPeriod,
    appointmets_per_slot,
    sub_slots,
    cancel_period,
    slots,
  } = req.body;
  try {
    const newprofile = {
      profile_name: profile_name,
      clinicWorkPeriod: clinicWorkPeriod,
      appointmets_per_slot: appointmets_per_slot,
      sub_slots: sub_slots,
      cancel_period: cancel_period,
      slots: slots,
    };
    const response = await updateProfile(profile_id, newprofile);
    res.status(201).json({ data: response });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ error: "failed to update appointment profile", err: `${err}` });
  }
});

exports.getProfilesByDoctorId = asyncHandler(async (req, res, next) => {
  try {
    const token=req.headers.authorization.split(" ")[1]
    const payload =await  decoded(token)
    console.log(payload)
    const doctor_id = payload.user_id;
    const profiles = await getProfilesById({ doctor_id: doctor_id });

    if (profiles.length > 0) {
      res.status(200).json({ data: profiles });
    } else {
      res
        .status(403)
        .json({ error: "There are no profiles associated with this account" });
    }
  } catch (err) {
    console.log(err)
    res.status(403).json({ error: "can't get profiles" });
  }
});

exports.getAllProfiles = asyncHandler(async (req, res, next) => {
  await getAllProfiles()
    .then((response) => {
      if (response.length > 0) {
        res.status(200).json({ data: response });
      } else {
        res.status(403).json({ data: "there are no profile" });
      }
    })
    .catch((err) => {
      console.log("error getting all profiles", err);
    });
});

exports.deleteProfile = asyncHandler(async (req, res, next) => {
  try {
    const profile = await deleteProfile(req.params.profile_id);

    res
      .status(200)
      .json({ data: `${profile.profile_name} has been deleted successfully` });
  } catch (err) {
    console.log("error deleting profile", err);
  }
});

// set all profiles associated with the clinic id to false
// set the target profile to true
exports.assignProfile = asyncHandler(async (req, res, next) => {
  const clinic_id = req.body.clinic_id;

  const { profile_id } = req.params; //doctor id must be replaced with the one in token

  await updateProfile(profile_id, { clinic_id: clinic_id, active: true });

  res
    .status(200)
    .json({
      data: `Profile has been assigned to the specified clinic:[ ${clinic_id} ]`,
    });
});

exports.unAssignProfile = asyncHandler(async (req, res, next) => {
  const profile_id = req.params.profile_id;
  const clinic_id = req.body.clinic_id;
  await updateProfile(profile_id, { clinic_id: "", active: false });
  res
    .status(200)
    .json({ data: `Profile has been dtached from clinic:[ ${clinic_id} ]` });
});
