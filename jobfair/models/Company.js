const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
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
    website: {
      type: String,
      required: [true, "Please add a website"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    tel: {
      type: String,
      required: [true, "Please add a telephone number"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//Reverse populate with virtuals
CompanySchema.virtual("reservations", {
  ref: "Reservation",
  localField: "_id",
  foreignField: "company",
  justOne: false,
});

//Cascade delete reservations when a company is deleted
CompanySchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Reservation being removed from company ${this._id}`);
    await this.model("Reservation").deleteMany({ company: this._id });
    next();
  }
);

module.exports = mongoose.model("Company", CompanySchema);
