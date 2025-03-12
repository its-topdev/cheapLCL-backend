const express = require('express');

const router = express.Router();
const { user } = require('../models'); // import models
const { parameters } = require('../config/params');
const { sendEmail } = require('../services/Email');
const { templates } = require('../constants/email-templates');
const { auth } = require('../middlewares/auth');
const { LEVELS } = require('../constants/user-role');

// router.post("/reach-us", auth(LEVELS.user),  async(req,res) =>{
router.post('/reach-us', async (req, res) => {
  const { message } = req.body;
  try {
    const userObj = await user.findOne({
      where: {
        id: req.userId,
      },
    });
    let username;
    let useremail;
    if (userObj) {
      username = userObj.name;
      useremail = userObj.email;
    }
    const params = [
      { name: 'USER_NAME', content: username },
      { name: 'USER_EMAIL', content: useremail },
      { name: 'MESSAGE', content: message },
    ];
    const to = parameters.managersEmailsTo.map((item) => ({ email: item }));
    const response = await sendEmail(
      templates.reach_us_template,
      to,
      'message from reach-us',
      params,
    );
    return res.json({
      status: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
