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

router.get('/webSchedule', async (req, res) => {
  try {
    const response = await axios.get(
      `https://csp.wships.com/wships/app/webSchedule?pol=${req.query.pol}&pod=${req.query.pod}`,
    );
    res.json({
      status: true,
      data: response.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      errorCode: 'FetchError',
      clientErrMsg: 'Failed to fetch data from the third-party API',
    });
  }
});
