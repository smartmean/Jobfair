const mongoose = require("mongoose");

const JobfairSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 charactors"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    district: {
      type: String,
      required: [true, "Please add a district"],
    },
    province: {
      type: String,
      required: [true, "Please add a province"],
    },
    postalcode: {
      type: String,
      required: [true, "Please add a postalcode"],
      maxlength: [5, "Postal Code can not be more than 5 digits"],
    },
    tel: {
      type: String,
    },
    region: {
      type: String,
      required: [true, "Please add a region"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//Reverse populate with virtuals
JobfairSchema.virtual("appointments", {
  ref: "Appointment",
  localField: "_id",
  foreignField: "jobfair",
  justOne: false,
});

//Cascade delete appointments when a jobfair is deleted
JobfairSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Appointment being removed from jobfair ${this._id}`);
    await this.model("Appointment").deleteMany({ jobfair: this._id });
    next();
  }
);

module.exports = mongoose.model("Jobfair", JobfairSchema);
