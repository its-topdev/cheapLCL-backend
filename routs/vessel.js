const express = require('express');
const { vessel } = require('../models');
// import models
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { LEVELS } = require('../constants/user-role');

// router.get("/list", auth(LEVELS.admin), async (req, res) => {
router.get('/list', async (req, res) => {
  try {
    const list = await vessel.findAll();
    return res.json({
      status: true,
      data: { vessels: list },
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
