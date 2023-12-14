const mongoose = require("mongoose");

const CriteriaSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name_criteria: {
    type: String,
    required: true,
  },
  weight_criteria: {
    type: Number,
    required: true,
  },
  type_criteria: {
    type: String,
    required: true,
  },
});

const Criteria = mongoose.model("Criteria", CriteriaSchema);

module.exports = Criteria;
