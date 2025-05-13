const connectDB = require('../db');
const { ObjectId } = require('mongodb');

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  try {
    if (ObjectId.isValid(id)) {
      return String(new ObjectId(id)) === id;
    }
    return false;
  } catch (err) {
    return false;
  }
};

// ✅ Create Product
exports.createProduct = async (req, res, next) => {
  try {
    const db = await connectDB();
    const image = req.file ? `/images/${req.file.filename}` : '';

    const product = {
      nom: req.body.nom,
      image: image,
      stock: req.body.stock,
      description: req.body.description,
      prix: req.body.prix,
    };

    const result = await db.collection('products').insertOne(product);
    res.status(201).json({ _id: result.insertedId, ...product });
  } catch (err) {
    next(err);
  }
};

// ✅ Get All Products
exports.getAllProducts = async (req, res, next) => {
  try {
    const db = await connectDB();
    const products = await db.collection('products').find().toArray();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// ✅ Get One Product
exports.getProductById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID de produit invalide' });
    }

    const db = await connectDB();
    const product = await db.collection('products').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// ✅ Update Product
exports.updateProduct = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID de produit invalide' });
    }

    const db = await connectDB();
    const updateData = {
      nom: req.body.nom,
      stock: req.body.stock,
      description: req.body.description,
      prix: req.body.prix,
    };

    if (req.file) {
      updateData.image = `/images/${req.file.filename}`;
    }

    const result = await db.collection('products').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    res.json(result.value);
  } catch (err) {
    next(err);
  }
};

// ✅ Delete Product
exports.deleteProduct = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID de produit invalide' });
    }

    const db = await connectDB();
    const result = await db.collection('products').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    next(err);
  }
};