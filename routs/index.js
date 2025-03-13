const express = require('express');

const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
  res.json({
    msg: 'from indexx !!!',
    fronUrl: process.env.FRONT_URL,
  });
});
module.exports = router;
