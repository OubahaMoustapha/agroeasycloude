const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  nom:         { type: String, required: true },
  image:       { type: String, required: true },
  stock:       { type: Number, required: true },
  description: { type: String, required: true },
  prix:        { type: Number, required: true },
  id_categorie:{ type: mongoose.Schema.Types.ObjectId, ref: 'categories', required: true }
}, { timestamps: true });

const categorySchema = new Schema({
  nom:   { type: String, required: true },
  image: { type: String }
}, { timestamps: true });


const Product  = mongoose.model('products', productSchema);
const Category = mongoose.model('categories', categorySchema);

module.exports = { Product, Category };