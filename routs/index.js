const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  res.json({
    msg: "from indexx !!!",
    fronUrl: process.env.FRONT_URL,
  });
});
module.exports = router;

router.get("/webSchedule", (req, res) => {
  console.log(req.query);
  res.json({
    status: true,
    data: {
      success: false,
      errorCode: "NoVoyage",
      errorMsg: "No voyages were found matching the search criteria",
    },
  });
});
