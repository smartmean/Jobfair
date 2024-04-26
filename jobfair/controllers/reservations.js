const Reservation = require("../models/Reservation");
const Company = require("../models/Company");

//@desc     Get all reservations
//@route    Get /api/v1/reservations
//@access   Public
exports.getReservations = async (req, res, next) => {
  let query;
  //General user can see only thier reservations!
  if (req.user.role != "admin") {
    query = Reservation.find({ user: req.user.id }).populate({
      path: "company",
      select: "name address website description tel",
    });
  } else {
    //If you are an admin, you can see all!
    if (req.params.companyId) {
      console.log(req.params.companyId);
      query = Reservation.find({ company: req.params.companyId }).populate({
        path: "company",
        select: "name address website description tel",
      });
    } else
      query = Reservation.find().populate({
        path: "company",
        select: "name address website description tel",
      });
  }
  try {
    const reservations = await query;

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.log(err.stack);
    return res.status(500).json({
      success: false,
      message: "Cannot find Reservation",
    });
  }
};

//@desc     Get single reservation
//@route    Get /api/v1/reservations/:id
//@access   Public
exports.getReservation = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const reservation = await Reservation.findById(req.params.id).populate({
      path: "company",
      select: "name description tel",
    });
    console.log(reservation);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: reservation,
    });
    console.log(reservation);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Reservation" });
  }
};

//@desc     Add reservations
//@route    Get /api/v1/companies/:companyId/reservation
//@access   Private
exports.addReservation = async (req, res, next) => {
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
    //Check Reservation date

    const resDate = new Date(req.body.resDate).getTime();
    const startDate = new Date("2022-05-10T00:00:00.000+00:00").getTime();
    const endDate = new Date("2022-05-13T23:59:59.000+00:00").getTime();
    console.log(req.body.resDate);

    if (!(resDate >= startDate && resDate <= endDate)) {
      return res.status(400).json({
        success: false,
        message: "Reservation date must be during May 10th to May 13th, 2022",
      });
    }
    console.log(req.body);

    //add user ID to req.body
    req.body.user = req.user.id;
    //Check for existed reservation
    const existedReservations = await Reservation.find({ user: req.user.id });
    //If the user is not an admin, they can only create 3 reservation.
    if (existedReservations.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `the user with ID ${req.user.id} has already made 3 reservation`,
      });
    }

    const reservation = await Reservation.create(req.body);
    res.status(201).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create Reservation" });
  }
};

//@desc     Update reservations
//@route    Put /api/v1/reservations/:id
//@access   Private
exports.updateReservation = async (req, res, next) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }
    //Make sure user is the reservation owner
    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        Message: `User ${req.user.id} is not authorized to update this reservation`,
      });
    }

    reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Reservation" });
  }
};

//@desc     Delete reservations
//@route    Delete /api/v1/reservations/:id
//@access   Private
exports.deleteReservation = async (req, res, next) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the reservation owner
    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        Message: `User ${req.user.id} is not authorized to delete this reservation`,
      });
    }
    await reservation.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Reservation" });
  }
};
