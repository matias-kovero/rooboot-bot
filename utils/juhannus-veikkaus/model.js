const mongoose = require("mongoose");

const jvSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required : true,
    dropDups: true,
  },
  traffic: Number,
  waters: Number,
  other: Number,
});

const jvModel = mongoose.model("juhannusVeikkaus", jvSchema);

module.exports = jvModel;
