const Jobfair = require("../models/Jobfair");
const VacCenter = require("../models/VacCenter");

//@desc     Get all jobfairs
//@routs    GET/api/v1/jobfairs
//@access   Public
exports.getJobfairs = async (req, res, next) => {
  let query;

  //Copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  //Loop over remove fields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  console.log(reqQuery);

  //Create query string
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  console.log(queryStr);

  query = Jobfair.find(JSON.parse(queryStr)).populate("appointments");

  //Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    const total = await Jobfair.countDocuments();
    query = query.skip(startIndex).limit(limit);
    //Execute query
    const jobfairs = await query;

    //Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
    res.status(200).json({
      success: true,
      count: jobfairs.length,
      pagination,
      data: jobfairs,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Get one jobfairs
//@routs    GET/api/v1/jobfairs/:id
//@access   Public
exports.getJobfair = async (req, res, next) => {
  try {
    const jobfair = await Jobfair.findById(req.params.id);

    if (!jobfair) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: jobfair });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Create single jobfairs
//@routs    POST/api/v1/jobfairs
//@access   Private
exports.createJobfair = async (req, res, next) => {
  const jobfair = await Jobfair.create(req.body);
  res.status(201).json({
    success: true,
    data: jobfair,
  });
};

//@desc     Update single jobfairs
//@routs    PUT/api/v1/jobfairs/:id
//@access   Private
exports.updateJobfair = async (req, res, next) => {
  try {
    const jobfair = await Jobfair.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!jobfair) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: jobfair });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Delete single jobfairs
//@routs    DELETE/api/v1/jobfairs
//@access   Private
exports.deleteJobfair = async (req, res, next) => {
  try {
    const jobfair = await Jobfair.findById(req.params.id);

    if (!jobfair) {
      return res.status(400).json({ success: false });
    }

    await jobfair.deleteOne();

    jobfair.deleteOne();
    res.status(200).json({ success: true, data: jobfair });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Get vaccine centers
//@routs    GET/api/v1/jobfairs/vacCenters/
//@access   Public

exports.getVacCenters = (req, res, next) => {
  VacCenter.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Vaccine Centers.",
      });
    else res.send(data);
  });
};
