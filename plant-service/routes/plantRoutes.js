const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');
const { verifyAdmin, verifyClient } = require('../middlewares/verifytoken');
router.get('/client', verifyClient, plantController.getAllPlants);
router.get('/client/:id', verifyClient, plantController.getPlantById);
router.get('/', verifyAdmin, plantController.getAllPlants);
router.get('/:id', verifyAdmin, plantController.getPlantById);
router.post('/', verifyAdmin, plantController.createPlant);
router.put('/:id', verifyAdmin, plantController.updatePlant);
router.delete('/:id', verifyAdmin, plantController.deletePlant);



module.exports = router;
