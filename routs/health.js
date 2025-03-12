const express = require('express');

const router = express.Router();
const { sequelize } = require('../models');

router.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: 'OK',
      message: 'Database connection successful',
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
    });
  }
});

module.exports = router;
