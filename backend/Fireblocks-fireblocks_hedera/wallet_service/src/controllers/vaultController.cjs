const fireblocksService = require('../services/custodialWalletService.cjs');

exports.createVault = async (req, res) => {
  try {
    const vault = await fireblocksService.createVault(req.body.vaultName);
    res.json(vault);
  } catch (error) {
    console.error('Error creating vault:', error);
    res.status(500).json({ error: 'Error creating vault' });
  }
};

exports.getVaultPagedAccounts = async (req, res) => {
  const { limit } = req.query;

  try {
    const vaults = await fireblocksService.getVaultPagedAccounts(limit);
    res.json(vaults);
  } catch (error) {
    console.error('Error retrieving vault accounts:', error);
    res.status(500).json({ error: 'Error retrieving vault accounts' });
  }
};

exports.transferToken = async (req, res) => {
  
  try {
    const vaults = await fireblocksService.transferToken(req.body.assetId, req.body.amount, req.body.srcId, req.body.destId);
    res.json(vaults);
  } catch (error) {
    console.error('Error retrieving vault accounts:', error);
    res.status(500).json({ error: 'Error retrieving vault accounts' });
  }
};

exports.getVaultAddress = async (req, res) => {
  
  try {
    const address = await fireblocksService.getAddress(req.body.assetId);
    res.json(address);
  } catch (error) {
    console.error('Error retrieving vault accounts:', error);
    res.status(500).json({ error: 'Error retrieving vault accounts' });
  }
};
