const express = require('express');
const cors = require('cors');
const db = require('./models');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', adminRoutes);

// Database sync and server start
const PORT = process.env.PORT || 3001;

db.sequelize.sync().then(() => {
  console.log('Database connection established successfully.');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
}); 