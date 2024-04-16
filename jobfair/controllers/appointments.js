const Appointment = require("../models/Appointment");
const Jobfair = require("../models/Jobfair");

//@desc     Get all appointments
//@route    Get /api/v1/appointments
//@access   Public
exports.getAppointments = async (req, res, next) => {
  let query;
  //General user can see only thier appointments!
  if (req.user.role != "admin") {
    query = Appointment.find({ user: req.user.id }).populate({
      path: "jobfair",
      select: "name province tel",
    });
  } else {
    //If you are an admin, you can see all!
    if (req.params.jobfairId) {
      console.log(req.params.jobfairId);
      query = Appointment.find({ jobfair: req.params.jobfairId }).populate({
        path: "jobfair",
        select: "name province tel",
      });
    } else
      query = Appointment.find().populate({
        path: "jobfair",
        select: "name province tel",
      });
  }
  try {
    const appointments = await query;

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.log(err.stack);
    return res.status(500).json({
      success: false,
      message: "Cannot find Appointment",
    });
  }
};

//@desc     Get single appointment
//@route    Get /api/v1/appointments/:id
//@access   Public
exports.getAppointment = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const appointment = await Appointment.findById(req.params.id).populate({
      path: "jobfair",
      select: "name description tel",
    });
    console.log(appointment);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: appointment,
    });
    console.log(appointment);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Appointment" });
  }
};

//@desc     Add appointments
//@route    Get /api/v1/jobfairs/:jobfairId/appointment
//@access   Private
exports.addAppointment = async (req, res, next) => {
  try {
    req.body.jobfair = req.params.jobfairId;

    const jobfair = await Jobfair.findById(req.params.jobfairId);

    if (!jobfair) {
      return res.status(404).json({
        success: false,
        message: `No jobfair with the id of ${req.params.jobfairId}`,
      });
    }
    console.log(req.body);

    //add user ID to req.body
    req.body.user = req.user.id;
    //Check for existed appointment
    const existedAppointments = await Appointment.find({ user: req.user.id });
    //If the user is not an admin, they can only create 3 appointment.
    if (existedAppointments.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `the user with ID ${req.user.id} has already made 3 appointment`,
      });
    }

    const appointment = await Appointment.create(req.body);
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create Appointment" });
  }
};

//@desc     Update appointments
//@route    Put /api/v1/appointments/:id
//@access   Private
exports.updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment with the id of ${req.params.id}`,
      });
    }
    //Make sure user is the appointment owner
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        Message: `User ${req.user.id} is not authorized to update this appointment`,
      });
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Appointment" });
  }
};

//@desc     Delete appointments
//@route    Delete /api/v1/appointments/:id
//@access   Private
exports.deleteAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the appointment owner
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        Message: `User ${req.user.id} is not authorized to delete this appointment`,
      });
    }
    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Appointment" });
  }
};
