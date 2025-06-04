const express = require('express');
const transactionController = require('../controllers/transactionController.cjs');

const router = express.Router();

router.post('/sign-transaction', transactionController.signTransaction);

module.exports = router;
