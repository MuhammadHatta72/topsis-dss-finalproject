const mongoose = require("mongoose");

const MatrixValueSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  id_alternative: {
    type: String,
    required: true,
  },
  id_criteria: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const MatrixValue = mongoose.model("Matrix_Value", MatrixValueSchema);

module.exports = MatrixValue;
