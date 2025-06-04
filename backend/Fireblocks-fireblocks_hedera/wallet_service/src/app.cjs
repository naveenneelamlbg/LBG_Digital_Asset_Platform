const express = require('express');
const transactionRoutes = require('./routes/transactionRoutes.cjs');
const vaultRoutes = require('./routes/vaultRoutes.cjs');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
app.use(express.json());

app.use('/api/transactions', transactionRoutes);
app.use('/api/vaults', vaultRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
