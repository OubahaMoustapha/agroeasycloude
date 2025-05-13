const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  nom:      { type: String, required: true },
  prenom:   { type: String, required: true },
  adresse:  { type: String, required: true },
  cin:      { type: String, required: true },
  tel:      { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token:    { type: String }

});

const adminSchema = new Schema({
  nom:           { type: String, required: true },
  penom:         { type: String, required: true },
  login:         { type: String, required: true, unique: true },
  password:      { type: String, required: true },
  token:         { type: String }

});

const Client = mongoose.model('clients', clientSchema);
const Admin  = mongoose.model('admins', adminSchema);

module.exports = { Client, Admin };