const express = require("express");
const router = express.Router();
router.get("/", (req,res) => {
    res.json({
      msg: 'from indexx !!!', fronUrl: process.env.FRONT_URL
    })
  });
  module.exports = router;