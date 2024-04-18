const Appointment = require("../models/Appointment");
const Company = require("../models/Company");

//@desc     Get all appointments
//@route    Get /api/v1/appointments
//@access   Public
exports.getAppointments = async (req, res, next) => {
  let query;
  //General user can see only thier appointments!
  if (req.user.role != "admin") {
    query = Appointment.find({ user: req.user.id }).populate({
      path: "company",
      select: "name address website description tel",
    });
  } else {
    //If you are an admin, you can see all!
    if (req.params.companyId) {
      console.log(req.params.companyId);
      query = Appointment.find({ company: req.params.companyId }).populate({
        path: "company",
        select: "name address website description tel",
      });
    } else
      query = Appointment.find().populate({
        path: "company",
        select: "name address website description tel",
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
      path: "company",
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
//@route    Get /api/v1/companies/:companyId/appointment
//@access   Private
exports.addAppointment = async (req, res, next) => {
  try {
    req.body.company = req.params.companyId;

    const company = await Company.findById(req.params.companyId);
    //console.log(req.body.company);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: `No company with the id of ${req.params.companyId}`,
      });
    }
    //Check company date

    const apptDate = new Date(req.body.apptDate).getTime();
    const startDate = new Date("2022-05-10T00:00:00.000+00:00").getTime();
    const endDate = new Date("2022-05-13T23:59:59.000+00:00").getTime();
    console.log(req.body.apptDate);

    if (!(apptDate >= startDate && apptDate <= endDate)) {
      return res.status(400).json({
        success: false,
        message: "Appointment date must be during May 10th to May 13th, 2022",
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
