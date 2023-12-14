const mongoose = require("mongoose");

const AlternativeSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name_alternative: {
    type: String,
    required: true,
  },
});

const Alternative = mongoose.model("Alternative", AlternativeSchema);

module.exports = Alternative;
