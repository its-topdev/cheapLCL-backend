const express = require('express');
const { country } = require('../models');
// import models
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { LEVELS } = require('../constants/user-role');

// router.get("/",auth(LEVELS.user), async(req,res) =>{
router.get('/', async (req, res) => {
  try {
    const list = await country.findAll();
    return res.json({
      status: true,
      data: { countries: list },
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
