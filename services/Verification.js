const { verification } = require('../models'); // import models
const { templates } = require('../constants/email-templates');
const { sendEmail } = require('./Email');

exports.sendVerification = async (email, name) => {
  try {
    const code = Math.floor(Math.random() * 90000) + 10000;
    const v = await verification.create({ email, code });
    const params = [{ name: 'CODE', content: code }];
    const to = [{ email, name }];
    const res = await sendEmail(
      templates.verify_email_template,
      to,
      'Welcome to CheapLCL! Confirm Your Email to Get Started',
      params,
    );
    return res;
  } catch (err) {
    return false;
  }
};
