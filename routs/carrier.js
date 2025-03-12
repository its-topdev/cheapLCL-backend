const express = require('express');
const { carrier } = require('../models');
// import models
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { LEVELS } = require('../constants/user-role');

// router.get("/list", auth(LEVELS.user), async (req, res) => {
router.get('/list', async (req, res) => {
  try {
    const list = await carrier.findAll();
    return res.json({
      status: true,
      data: { carriers: list },
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
