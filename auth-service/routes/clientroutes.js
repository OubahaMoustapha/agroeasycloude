const express = require('express');
const router = express.Router();
const {
  loginClient,logoutClient ,getClients, createClient, updateClient, deleteClient,getClientProfile
} = require('../controllers/clientcontroller');

const { verifyAdmin ,verifyClient} = require('../middlewares/verifytoken');

router.post('/login', loginClient);
router.post('/logout', verifyClient,logoutClient);
router.get('/me', verifyClient, getClientProfile);

router.get('/', verifyAdmin, getClients);
router.post('/', createClient);
router.put('/:id', verifyAdmin, updateClient);
router.delete('/:id', verifyAdmin, deleteClient);

module.exports = router;
