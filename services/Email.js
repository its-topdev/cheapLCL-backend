const { config } = require('../config/secret');
const { parameters } = require('../config/params');
const mandrill = require('node-mandrill')(config.mandrillKey);

exports.sendEmail = (tempalte, to, subject, params) => {
  try {
    if (process.env.NODE_ENV != 'production') {
      to = parameters.developersEmailsTo.map((item) => ({ email: item }));
    }
    mandrill(
      '/messages/send-template',
      {
        template_name: tempalte,
        template_content: [],
        message: {
          to,
          from_email: parameters.noReplyEmail,
          global_merge_vars: params,
          subject,
        },
      },
      (error, response) => {
        if (error) {
          console.log(JSON.stringify(error));
          return false;
        }
        return true;
      },
    );
  } catch (error) {
    return false;
  }
};
