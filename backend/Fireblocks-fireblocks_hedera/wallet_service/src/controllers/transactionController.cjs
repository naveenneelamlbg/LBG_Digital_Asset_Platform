const custodialWalletService = require('../services/custodialWalletService.cjs');

exports.signTransaction = async (req, res) => {
  
  const transactionBytes = new Uint8Array([req.body.transactionData]);

  try {
    const signature = await custodialWalletService.signTransaction(transactionBytes);
    res.json({ signature });
  } catch (error) {
    console.error('Error signing transaction:', error);
    res.status(500).json({ error: 'Error signing transaction' });
  }
};
