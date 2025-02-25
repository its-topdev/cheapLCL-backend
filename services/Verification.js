const { verification } = require("../models"); // import models
const { templates } = require("../constants/email-templates");
const { sendEmail } = require("../services/Email");

exports.sendVerification = async (email, name) => {
  try {
    let code = Math.floor(Math.random() * 90000) + 10000;
    const v = await verification.create({ email, code });
    let params = [{ name: "CODE", content: code }];
    let to = [{ email: email, name: name }];
    let res = await sendEmail(
      templates.verify_email_template,
      to,
      "Welcome to CheapLCL! Confirm Your Email to Get Started",
      params
    );
    return res;
  } catch (err) {
    return false;
  }
};
