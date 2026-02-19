const mongoose = require("mongoose");
const companySchema = new mongoose.Schema({
  CompanyName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  CompanySize: {
    type: String,
  },
  Industry: {
    type: String,
  },
  Website: {
    type: String,
  },
  ContactPerson: {
    type: String,
  },
  Password: {
    type: String,
    required: true,
  },
  ConPassword: {
    type: String,
    required: true,
  },
  verificationStatus: {
    type: String,
    default: 'Pending',
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  Location: {
    type: String,
    default: 'Not specified',
  },
});
const companyModel = mongoose.model("company", companySchema);

module.exports = companyModel;

