
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { user, verification, confirmationToken, userStatus } = require('../models'); // import models
const { auth } = require("../middlewares/auth");
const { parameters } = require("../config/params")
const { sendEmail } = require("../services/Email");
const { templates } = require("../constants/email-templates");

const { sendVerification } = require("../services/Verification");
const { user_status } = require("../constants/user-status");
const { LEVELS } = require("../constants/user-role");

passwordEncryption = async(password) => {
  hashPass = bcrypt.hash(password, 10);
  return hashPass;
}

router.post("/send-verification", async (req, res) => {
  const { email, name } = req.body;
  try {
    result = await sendVerification(email, name);
    return res.json({
      status: true,
      data: {}
    });
  } catch (err) {
    return res.json({
      status: false,
    });
  }

});

// router.post("/:id/update-status", auth(LEVELS.admin), async (req, res) => {
router.post("/:id/update-status", async (req, res) => {
  try {
    const { status } = req.body;
    const id = req.params.id;
    if (!id || !status) {
      return res.json({
        status: 0,
        error: 'missing parameters'
      });
    }
    let userObj = await user.findOne({
      where: {
        id: id
      }
    });
    if (!userObj) {
      return res.json({
        status: false,
        clientErrMsg: 'user not found'
      });
    }
    userObj.user_status = status;
    await userObj.save();
    if(status == user_status.CONFIRMED) {
      let params =  [{"name": "LINK", "content": parameters.loginUrl}, {"name": "USERNAME", "content": userObj.email}, 
      {"name": "NAME", "content": userObj.name}];
      const email = userObj.email;
      let to = [{email: email}];
      await sendEmail(templates.approve_user, to, "Your CheapLCL Account is Approved and Ready!", params);
    }
    return res.json({
      status: true,
      data: {}
    });
  } catch (err) {
    return res.json({
      status: false,
    });
  }
})

router.post("/verification", async (req, res) => {
  const { email, code } = req.body;
  let u = await verification.findOne({
    where: {
      email: email
    },
    order: [
      ['createdAt', 'DESC']],
  });
  if (!u || u.code != code) {
    return res.json({
      status: false,
      clientErrMsg: 'Invalid verification code'
    });
  } else {
    var diff = Math.abs(new Date() - u.createdAt);
    var diffInMinutes = Math.floor((diff / 1000) / 60);
    if (diffInMinutes > 5) {
      return res.json({
        status: 0,
        clientErrMsg: 'The verification code has expired'
      });
    }
    let us = await user.findOne({
      where: {
        email: email
      }
    });
    us.user_status = user_status.VERIFIED;

    await us.save();

    return res.json({
      status: true,
      data: {}
    });
  }

});

router.post("/update-password", async (req, res) => {
  const { token, password } = req.body;
  let tokenObj = await confirmationToken.findOne({
    where: {
      token: token
    },
    order: [
      ['createdAt', 'DESC']],
  });
  if (!tokenObj) {
    return res.json({
      status: 0,
      error: 'Permission Error'
    });
  }
  var diff = Math.abs(new Date() - tokenObj.createdAt);
  var diffInMinutes = Math.floor((diff / 1000) / 60);
  if (diffInMinutes > 5) {
    return res.json({
      status: 0,
      error: 'The verification code has expired'
    });
  }
  // hashPass = await bcrypt.hash(password, 10);
  const hashPass = await passwordEncryption(password);
  let userObj = await user.findOne({
    where: {
      id: tokenObj.user
    },
  });
  userObj.password = hashPass;
  await userObj.save();
  return res.json({
    status: 1,
    data: {}
  });


})


router.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;
    let userObj = await user.findOne({
      where: {
        email: email
      }
    });
    if (!userObj) {
      return res.json({
        status: false,
        clientErrMsg: 'email not found'
      });    
    }
    if (userObj.user_status != user_status.CONFIRMED) {
      return res.json({
        status: false,
        clientErrMsg: 'email not confirmed yet'
      }); 
    }
    let token = await userObj.createToken();
    const r = await confirmationToken.create({ user: userObj.id, token });
    let url = parameters.frontUrl + parameters.resetPass + '?token=' + token;

    let params = [{ "name": "NAME", "content": userObj.name}, {"name": "LINK", "content": url }];
    let to = [{ email: email }]
    const response = await sendEmail(templates.reset_pass_template, to, "Password Reset Requested for Your CheapLCL Account", params);
    return res.json({
      status: true,
      data: 'success :)'
    });
  } catch (err) {
    return res.json({
      status: false,
    });
  }




});


router.post("/register", async (req, res) => {
  const { name, email, company, phone, role } = req.body;
  let { password } = req.body;
  try {
    password = await passwordEncryption(password);
    let status = user_status.CREATED;
    const u = await user.create({ name, email, password, company, phone, role, user_status: status });
    result = await sendVerification(email, name);
    return res.json({
      status: true,
      data: u
    });
  } catch (err) {
    if (user.isEmailExist(email)) {
      return res.json({
        status: false,
        clientErrMsg: 'Email allready exist'
      });
    }
    return res.status(500).json({
      status: false,
    });    


  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let u = await user.findOne({
    where: {
      email: email
    }
  });
  if (!u) {
    return res.status(401).json({ clientErrMsg: "User not found" })
  } else {
    let validPassword = await bcrypt.compare(password, u.password);
    if (!validPassword) {
      return res.status(401).json({ clientErrMsg: "User and password not match" })
    }
    if (u.user_status != user_status.CONFIRMED) {
      return res.status(401).json({ clientErrMsg: "You will be able to login the system after the administrator approves your user." })
    }
    let token = await u.createToken();
    return res.json({
      status: true,
      data: { name: u.name, role: u.role, token: token }
  });
    // return res.json({ name: u.name, role: u.role, token: token });
  }

});

// router.get('/list', auth(LEVELS.admin), async (req, res) => {
router.get('/list', async (req, res) => {
  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.pageSize);

  const count = await user.count({});

  const u = await user.findAll({
    offset: (page - 1) * pageSize,
    limit: pageSize,
    include: [
      {
          model: userStatus
      }
    ],
    order: [['id', 'DESC']],
  });
  if (!u) {
    return res.status(401).json({ msg: "Not Users" })
  }
  return res.json({
    status: true,
    data: { users: u, totalCount: count }
});
});

// router.post("/:id/edit", auth(LEVELS.admin), async (req, res) => {
router.post("/:id/edit", async (req, res) => {
  try {
      const id = req.params.id;
      const { name, email, company, phone, role, password } = req.body;
      let payload;
      if (password) {
        const hashPass = await passwordEncryption(password);
        payload = { name, email, company, phone, role, password: hashPass };
      } else {
        payload = { name, email, company, phone, role };
      }
      
      const userObj = await user.update(payload , { 
          where: {
              id: id
          }
      });

      return res.json({
          status: true,
          data: userObj
      });
  }
  catch (error) {
      console.log(error);
      //error.original.message
      return res.status(500).send({ status:false,  clientErrMsg: 'updating user failed' });
  }
});

// router.post("/:id/delete", auth(LEVELS.admin), async (req, res) => {
router.post("/:id/delete", async (req, res) => {
  try {
      const id = req.params.id;
      const userObj = await user.findOne({
        where: {
          id: id
        }
      });
      const deletedEmail = `${userObj.email}_deleted_${Date.now()}`
      userObj.email = deletedEmail;
      await userObj.destroy();

      return res.json({
          status: true,
          data: userObj
      });
  }
  catch (error) {
      console.log('Error in user/:id/delete: '+error);
      return res.status(500).send({ status:false,  error: 'delete user failed' });
  }
});

// router.post("/create", auth(LEVELS.admin), async (req, res) => {
router.post("/create", async (req, res) => {
  const { name, email, company, phone, role, password } = req.body;
  try {
      const hashPass = await passwordEncryption(password);
      const userObj = await user.create({ name, email, company, phone, role, password: hashPass, user_status: user_status.VERIFIED });
      return res.json({
          status: true,
          data: userObj
      });
  } catch (err) {
    if (user.isEmailExist(email)) {
      return res.json({
        status: false,
        clientErrMsg: 'Email allready exist'
      });
    } 
      return res.json({
          status: false,
          clientErrMsg: 'fail to create user'
      })
  }

});

module.exports = router;