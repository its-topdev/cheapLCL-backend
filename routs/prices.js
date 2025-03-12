const express = require('express');
const { prices, port } = require('../models');

const router = express.Router();
const { auth } = require('../middlewares/auth');
const { LEVELS } = require('../constants/user-role');

router.post('/:id/edit', auth(LEVELS.admin), async (req, res) => {
  try {
    const { id } = req.params;
    const { pol, pod, price } = req.body;

    const priceObj = await prices.update(
      {
        pol,
        pod,
        price,
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
      data: priceObj,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ status: false, clientErrMsg: 'updating price failed' });
  }
});

router.post('/:id/delete', auth(LEVELS.admin), async (req, res) => {
  try {
    const { id } = req.params;
    const priceObj = await prices.destroy({
      where: {
        id,
      },
    });

    return res.json({
      status: true,
      data: priceObj,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, error: 'price' });
  }
});

router.post('/create', auth(LEVELS.admin), async (req, res) => {
  try {
    const { pol, pod, price } = req.body;
    const priceObj = await prices.create({
      pol,
      pod,
      price,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return res.json({
      status: true,
      data: priceObj,
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
      const list = await prices.findAll({
        include: [
          {
            model: port,
            as: 'polObj',
          },
          {
            model: port,
            as: 'podObj',
          },
        ],
        order: [['id', 'DESC']],
      });
      return res.json({
        status: true,
        data: { prices: list },
      });
    }
    const count = await prices.count({});
    const list = await prices.findAll({
      offset: (page - 1) * pageSize,
      limit: pageSize,
      include: [
        {
          model: port,
          as: 'polObj',
        },
        {
          model: port,
          as: 'podObj',
        },
      ],
      order: [['id', 'DESC']],
    });
    return res.json({
      status: true,
      data: { prices: list, totalCount: count },
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
