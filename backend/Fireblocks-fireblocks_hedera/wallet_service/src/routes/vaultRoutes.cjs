const express = require('express');
const vaultController = require('../controllers/vaultController.cjs');

const router = express.Router();

router.post('/create', vaultController.createVault);
router.get('/accounts', vaultController.getVaultPagedAccounts);
router.post('/transfer', vaultController.transferToken);
router.get('/vaultaddress', vaultController.getVaultAddress);

module.exports = router;
