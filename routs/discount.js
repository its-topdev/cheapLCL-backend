const express = require('express');
const { discount } = require('../models');

const router = express.Router();
const { auth } = require('../middlewares/auth');
const { LEVELS } = require('../constants/user-role');

router.post('/:id/edit', auth(LEVELS.admin), async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, fixedDiscount, weeklyDiscount } = req.body;

    const discountObj = await discount.update(
      {
        startDate,
        endDate,
        fixedDiscount,
        weeklyDiscount,
        updatedAt: new Date(),
      },
      {
        where: {
          id,
        },
      },
    );

    return res.json({
      status: true,
      data: discountObj,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ status: false, clientErrMsg: 'updating discount failed' });
  }
});

router.post('/:id/delete', auth(LEVELS.admin), async (req, res) => {
  try {
    const { id } = req.params;
    const d = await discount.destroy({
      where: {
        id,
      },
    });

    return res.json({
      status: true,
      data: d,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, error: 'discount' });
  }
});

router.post('/create', auth(LEVELS.admin), async (req, res) => {
  try {
    const { startDate, endDate, fixedDiscount, weeklyDiscount } = req.body;
    const discountObj = await discount.create({
      startDate,
      endDate,
      fixedDiscount,
      weeklyDiscount,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return res.json({
      status: true,
      data: discountObj,
    });
  } catch (err) {
    return res.json({
      status: false,
    });
  }
});

router.get('/list', auth(LEVELS.user), async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);

    if (!page || !pageSize) {
      const list = await discount.findAll({
        order: [['id', 'DESC']],
      });
      return res.json({
        status: true,
        data: { discounts: list },
      });
    }
    const count = await discount.count({});
    const list = await discount.findAll({
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['id', 'DESC']],
    });
    return res.json({
      status: true,
      data: { discounts: list, totalCount: count },
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
