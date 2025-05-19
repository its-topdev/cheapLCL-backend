const express = require('express');
const { shipper, contact, user, country, port } = require('../models');
// import models
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { LEVELS } = require('../constants/user-role');

router.get('/user-shippers', auth(LEVELS.user), async (req, res) => {
  try {
    const currentUser = await user.findOne({
      where: {
        id: req.userId,
      },
    });
    const currentUserCompany = currentUser ? currentUser.company : null;

    const list = await shipper.findAll({
      include: [
        {
          model: user,
          as: 'userObj',
        },
      ],
    });

    const filteredList = list.filter(
      (item) => item.userObj && item.userObj.company === currentUserCompany,
    );

    return res.json({
      status: true,
      data: { shippers: filteredList },
    });
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
    });
  }
});
router.post('/:id/edit', auth(LEVELS.admin), async (req, res) => {
  try {
    const { id } = req.params;

    const shipperData = req.body;

    const shipperObj = await shipper.update(
      {
        name: shipperData.name,
        address: shipperData.address,
        countryId: shipperData.country,
        cityId: shipperData.city,
        zip: shipperData.zip,
        updatedAt: new Date(),
      },
      {
        where: {
          id,
        },
      },
    );
    await contact.update(
      {
        name: shipperData.contactName,
        email: shipperData.contactEmail,
        phone: shipperData.contactPhone,
        updatedAt: new Date(),
      },
      {
        where: {
          shipperId: id,
        },
      },
    );

    return res.json({
      status: true,
      data: shipperObj,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, clientErrMsg: 'updating shipper failed' });
  }
});
router.post('/:id/delete', auth(LEVELS.admin), async (req, res) => {
  try {
    const { id } = req.params;
    const shipperObj = await shipper.destroy({
      where: {
        id,
      },
    });
    await contact.destroy({
      where: {
        shipperId: id,
      },
    });

    return res.json({
      status: true,
      data: shipperObj,
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: 'shipper' });
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
          order: [['id', 'DESC']],
        },
      ],
      order: [['id', 'DESC']],
    });

    const currentUser = await user.findOne({
      where: {
        id: req.userId,
      },
    });
    const currentUserCompany = currentUser ? currentUser.company : null;

    let filteredList = list.filter((item) => item.shipperObj !== null);
    filteredList = filteredList.filter((item) => item.shipperObj.userObj !== null);
    if (req.query.list_type === 'shippers') {
      filteredList = filteredList.filter(
        (item) => item.shipperObj.userObj.company === currentUserCompany,
      );
    }
    const total = filteredList.length;
    const offset = (page - 1) * pageSize;
    const shippers = filteredList.slice(offset, offset + pageSize).map((item) => ({
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
      country: countryId,
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
      countryId,
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
