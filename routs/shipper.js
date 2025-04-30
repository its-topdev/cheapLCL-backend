const express = require('express');
const { shipper, contact, user, country, port } = require('../models');
// import models
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { LEVELS } = require('../constants/user-role');

router.get('/user-shippers', auth(LEVELS.user), async (req, res) => {
  try {
    const list = await shipper.findAll({
      where: {
        userId: req.userId,
      },
    });
    return res.json({
      status: true,
      data: { shippers: list },
    });
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
    });
  }
});

router.get('/list', auth(LEVELS.user), async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10);
    const pageSize = parseInt(req.query.pageSize, 10);
    const list = await contact.findAll({
      include: [
        {
          model: shipper,
          as: 'shipperObj',
          include: [
            {
              model: user,
              as: 'userObj',
            },
            {
              model: country,
              as: 'countryObj',
            },
            {
              model: port,
              as: 'cityObj',
            },
          ],
        },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['id', 'DESC']],
    });
    const total = await contact.count();
    const filteredList = list.filter(
      (item) => item.shipperObj.userObj !== null,
    );
    const shippers = filteredList.map((item) => ({
      id: item.id === null ? 0 : item.id,
      username: item.shipperObj.userObj.name,
      usercompany: item.shipperObj.userObj.company,
      // userEmail: item.shipperObj.userObj.email,
      shipperName: item.shipperObj.name === null ? '' : item.shipperObj.name,
      address: item.shipperObj.address === null ? '' : item.shipperObj.address,
      country:
        item.shipperObj.countryObj.name === null
          ? ''
          : item.shipperObj.countryObj.name,
      city:
        item.shipperObj.cityObj.name === null
          ? ''
          : item.shipperObj.cityObj.name,
      zip: item.shipperObj.zip === null ? '' : item.shipperObj.zip,
      contactName: item.name === null ? '' : item.name,
      contactEmail: item.email === null ? '' : item.email,
      contactPhone: item.phone === null ? '' : item.phone,
    }));

    return res.json({
      status: true,
      data: { shippers, total },
    });
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
    });
  }
});
router.post('/create', auth(LEVELS.user), async (req, res) => {
  try {
    const {
      name,
      address,
      country,
      city,
      zip,
      contactName,
      contactPhone,
      contactEmail,
      contacts,
    } = req.body;
    const shipperObj = await shipper.create({
      userId: req.userId,
      name,
      address,
      countryId: country,
      cityId: city,
      zip,
      createdById: req.userId,
      updatedById: req.userId,
    });

    if (shipperObj) {
      await contact.create({
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        shipperId: shipperObj.id,
        createdById: req.userId,
        updatedById: req.userId,
      });
      contacts.forEach((element) => {
        contact.create({
          name: element.name,
          email: element.email,
          phone: element.phone,
          shipperId: shipperObj.id,
          createdById: req.userId,
          updatedById: req.userId,
        });
      });
    }

    return res.json({
      status: true,
      data: shipperObj,
    });
  } catch (err) {
    return res.json({
      status: false,
    });
  }
});

module.exports = router;
