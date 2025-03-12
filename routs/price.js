const express = require('express');
const sequelize = require('sequelize');
const { QueryTypes, literal } = require('sequelize');

const router = express.Router();
const {
  price,
  port,
  carrier,
  vessel,
  price_history,
  charge,
} = require('../models'); // import models
const { auth } = require('../middlewares/auth');
const { charge_type } = require('../constants/charges-type');
const { loadQuery } = require('../services/LoadQuery');
const db = require('../models/index');
const { LEVELS } = require('../constants/user-role');

router.post('/:id/edit', auth(LEVELS.admin), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      departureDate,
      arrivalDate,
      priceFirst,
      priceSecond,
      priceThird,
      priceFourth,
      priceDate,
    } = req.body;

    const oldPriceObj = await price.findOne({
      where: {
        id,
      },
    });
    if (!oldPriceObj) {
      return res.json({
        status: false,
        clientErrMsg: 'price not found',
      });
    }

    const priceHistoryObj = await price_history.create({
      priceId: id,
      priceFirst: oldPriceObj.priceFirst,
      priceSecond: oldPriceObj.priceSecond,
      priceThird: oldPriceObj.priceThird,
      priceFourth: oldPriceObj.priceFourth,
      priceDate: oldPriceObj.priceDate,
      createdById: req.userId,
      updatedById: req.userId,
    });

    const priceObj = await price.update(
      {
        departureDate,
        arrivalDate,
        priceFirst,
        priceSecond,
        priceThird,
        priceFourth,
        priceDate,
        createdById: req.userId,
        updatedById: req.userId,
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
      .send({ status: false, clientErrMsg: 'updating route failed' });
  }
});

router.post('/:id/delete', auth(LEVELS.admin), async (req, res) => {
  try {
    const { id } = req.params;
    const d = await price.destroy({
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
    return res
      .status(500)
      .send({ status: false, clientErrMsg: 'delete route failed' });
  }
});

router.post('/create', auth(LEVELS.admin), async (req, res) => {
  try {
    const {
      carrier,
      vessel,
      voyage,
      pol,
      pod,
      etd,
      eta,
      priceFirst,
      priceSecond,
      priceThird,
      priceFourth,
      priceDate,
    } = req.body;
    const priceObj = await price.create({
      carrierId: carrier,
      vesselId: vessel,
      voyage,
      pol,
      pod,
      departureDate: etd,
      arrivalDate: eta,
      priceFirst,
      priceSecond,
      priceThird,
      priceFourth,
      priceDate,
      created_by_id: req.userId,
      updated_by_id: req.userId,
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

router.get('/list', auth(LEVELS.admin), async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);

    const count = await price.count({});
    const list = await price.findAll({
      offset: (page - 1) * pageSize,
      limit: pageSize,
      include: [
        {
          model: carrier,
        },
        {
          model: vessel,
        },
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
      data: { routes: list, totalCount: count },
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post('/search', auth(LEVELS.user), async (req, res) => {
  try {
    console.log('now search');
    const { payload } = req.body;
    const searchQuery = loadQuery('search');
    const fromDate = new Date(payload.calendarDate);
    const to = new Date(payload.calendarDate);
    const toDate = new Date(to.setDate(to.getDate() + payload.weeks * 7));
    const weightKg = payload.weightAmountKg;
    const weightCbm = payload.weightAmountCbm;
    const weightOrCbm = +(weightCbm > weightKg ? weightCbm : weightKg);
    let amountTitle;
    let amountSymbol;
    if (weightCbm > weightKg) {
      amountTitle = 'Cbm';
      amountSymbol = 'M³';
    } else {
      amountTitle = 'Weight';
      amountSymbol = 'MT';
    }

    await charge
      .findOne({
        attributes: [
          [
            literal(
              `sum(CASE WHEN typeId = ${charge_type.CALCULATED} THEN price * ${weightOrCbm} ELSE price END)`,
            ),
            'sum',
          ],
        ],
      })
      .then((result) => {
        const chargePrice =
          result && result.dataValues && result.dataValues.sum
            ? result.dataValues.sum
            : 0;
        db.sequelize
          .query(searchQuery, {
            replacements: {
              fromDate,
              toDate,
              pol: payload.pol,
              pod: payload.pod,
              amount: weightOrCbm,
              sum: chargePrice,
              amountTitle,
              amountSymbol,
              weight: weightKg,
              cbm: weightCbm,
            },
            type: QueryTypes.SELECT,
          })
          .then((list) => {
            if (list.length) {
              const lowestPrice = list.reduce((prev, curr) =>
                prev.price < curr.price ? prev : curr,
              );
              lowestPrice.isLowPrice = true;
            }
            return res.json({ status: true, data: list });
          });
      });
  } catch (err) {
    return res.json({ status: false });
  }
});

router.get('/pol', auth(LEVELS.user), async (req, res) => {
  try {
    const list = await price.findAll({
      attributes: ['pol'],
      include: [
        {
          model: port,
          as: 'polObj',
        },
      ],
      group: ['pol'],
    });
    return res.json({
      status: true,
      data: { list },
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get('/pod', auth(LEVELS.user), async (req, res) => {
  try {
    const list = await price.findAll({
      attributes: ['pod'],
      include: [
        {
          model: port,
          as: 'podObj',
        },
      ],
      group: ['pod'],
    });
    return res.json({
      status: true,
      data: { list },
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
