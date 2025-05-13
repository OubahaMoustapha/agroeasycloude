const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/upload');

// CRUD Routes
const { verifyAdmin, verifyClient } = require('../middlewares/verifytoken');
router.get('/', verifyAdmin, productController.getAllProducts);
router.post('/', verifyAdmin, upload.single('image'), productController.createProduct);
router.put('/:id', verifyAdmin, upload.single('image'), productController.updateProduct);
router.delete('/:id', verifyAdmin, productController.deleteProduct);

router.get('/client', verifyClient, productController.getAllProducts);
module.exports = router;
