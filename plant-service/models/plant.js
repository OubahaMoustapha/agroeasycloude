const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantSchema = new Schema({
  titre:           { type: String, required: true },
  info_plantation: { type: String, required: true },
  info_materiaux:  { type: String, required: true },
  info_arrosage:   { type: String, required: true },
  info_climat:     { type: String, required: true },
});



const Plant         = mongoose.model('plants', plantSchema);

module.exports = { Plant };