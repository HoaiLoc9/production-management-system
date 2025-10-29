const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');
const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', assignmentRoutes);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    // sync models (production: use migrations instead)
    await sequelize.sync();
    app.listen(PORT, '0.0.0.0', () => 
  console.log(`Backend running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('DB connect error', err);
  }
})();
