const express = require('express');
const {
  prices,
  port,
  pricesApplicableTimeframes,
  discount,
} = require('../models');
const axios = require('axios');
const { Op } = require('sequelize');

const router = express.Router();
const { auth } = require('../middlewares/auth');
const { LEVELS } = require('../constants/user-role');
const { excludeDiscountPorts } = require('../constants/discount');

router.post('/:id/edit', auth(LEVELS.admin), async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    const priceObj = await prices.update(
      {
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
    const { startDate, endDate, podObj, polObj, price } = req.body;

    const timeframes = await pricesApplicableTimeframes.create({
      prices_start_date: startDate,
      prices_end_date: endDate,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const priceObj = await prices.create({
      pol: polObj.id,
      pod: podObj.id,
      price,
      applicableTimeId: timeframes.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.json({
      status: true,
      data: priceObj,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      error: err.message,
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
          {
            model: pricesApplicableTimeframes,
            as: 'applicableTimeframes',
          },
        ],
        order: [['id', 'DESC']],
      });

      const priceList = list.map((price) => {
        return {
          id: price.id,
          pol: price.pol,
          pod: price.pod,
          price: price.price,
          polName: price.polObj.name,
          podName: price.podObj.name,
          validFrom: price.applicableTimeframes.prices_start_date,
          validTo: price.applicableTimeframes.prices_end_date,
        };
      });

      return res.json({
        status: true,
        data: { prices: priceList },
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
        {
          model: pricesApplicableTimeframes,
          as: 'applicableTimeframes',
        },
      ],
      order: [['id', 'DESC']],
    });

    const priceList = list.map((price) => {
      return {
        id: price.id,
        pol: price.pol,
        pod: price.pod,
        price: price.price,
        polName: price.polObj.name,
        podName: price.podObj.name,
        validFrom: price.applicableTimeframes.prices_start_date,
        validTo: price.applicableTimeframes.prices_end_date,
      };
    });

    return res.json({
      status: true,
      data: { prices: priceList, totalCount: count },
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get('/search', auth(LEVELS.user), async (req, res) => {
  try {
    const { pol, pod, weeks, date, weightAmountKg, weightAmountCbm } =
      req.query;
    const searchDate = new Date(date);
    const startTime = searchDate.getTime();
    const endTime = new Date(date).setDate(searchDate.getDate() + 7 * weeks);

    let wshipsResponse;
    try {
      wshipsResponse = await axios.get(
        `https://csp.wships.com/wships/app/webSchedule?pol=${pol}&pod=${pod}`,
      );
    } catch (err) {
      return res.status(500).json({
        status: false,
        error: `Failed to fetch Wships data ${err.message}`,
      });
    }
    const availableTimeframes = await prices.findAll({
      where: {
        pol: pol,
        pod: pod,
      },
      attributes: ['applicableTimeId'],
      group: ['applicableTimeId'],
    });

    const polName = await port.findOne({
      where: {
        id: pol,
      },
    });

    const podName = await port.findOne({
      where: {
        id: pod,
      },
    });

    const availableTimeframeIds = availableTimeframes.map(
      (price) => price.applicableTimeId,
    );

    console.log(availableTimeframeIds, 'availableTimeframeIds');

    const allTimeframes = await pricesApplicableTimeframes.findAll({
      where: {
        id: {
          [Op.in]: availableTimeframeIds,
        },
      },
      order: [['updated_at', 'DESC']],
    });

    const latestDiscount = await discount.findOne({
      order: [['updatedAt', 'DESC']],
    });

    const { fixedDiscount, weeklyDiscount } = latestDiscount || {
      fixedDiscount: 0,
      weeklyDiscount: 0,
    };

    const allPrices = await prices.findAll({
      where: {
        pol: pol,
        pod: pod,
        applicableTimeId: {
          [Op.in]: availableTimeframeIds,
        },
      },
      include: [
        {
          model: pricesApplicableTimeframes,
          as: 'applicableTimeframes',
        },
      ],
      order: [['updatedAt', 'DESC']],
    });

    const filteredVoyages = await Promise.all(
      wshipsResponse.data.voyages
        .filter((voyage) => {
          const departureTime = new Date(voyage?.departureDate)?.getTime();
          return departureTime >= startTime && departureTime <= endTime;
        })
        .map(async (voyage) => {
          const departureDate = new Date(voyage.departureDate);
          const amount =
            weightAmountKg > weightAmountCbm ? weightAmountKg : weightAmountCbm;

          const applicableTimeframe = allTimeframes.find(
            (timeframe) =>
              departureDate >= new Date(timeframe.prices_start_date) &&
              departureDate <= new Date(timeframe.prices_end_date),
          );

          let finalPrice = 0;

          if (excludeDiscountPorts.some((port) => port.id === pol)) {
            finalPrice = priceData.price;
          } else if (applicableTimeframe) {
            const priceData = allPrices.find(
              (p) => p.applicableTimeId === applicableTimeframe.id,
            );

            if (priceData) {
              finalPrice = priceData.price - fixedDiscount;
            }
          } else {
            const mostRecentTimeframe = allTimeframes[0];
            if (mostRecentTimeframe) {
              const priceData = allPrices.find(
                (p) => p.applicableTimeId === mostRecentTimeframe.id,
              );

              if (priceData) {
                const weeksDiff = Math.ceil(
                  (departureDate -
                    new Date(mostRecentTimeframe.prices_end_date)) /
                    (7 * 24 * 60 * 60 * 1000),
                );

                finalPrice =
                  priceData.price - fixedDiscount - weeklyDiscount * weeksDiff;
              }
            }
          }

          return {
            carrierName: 'WSHIPS',
            key: voyage?.vvoyage,
            departureDate: voyage?.departureDate,
            vesselName: voyage?.vessel,
            voyage: voyage?.voyage,
            arrivalDate: voyage?.arrivalDate,
            amount: parseInt(amount),
            price: finalPrice,
            amountSymbol: weightAmountKg > weightAmountCbm ? 'MT' : 'CBM',
            amountTitle: 'Weight',
            discountApplied: applicableTimeframe ? 'fixed' : 'weekly',
            polName: polName.name,
            podName: podName.name,
          };
        }),
    );

    return res.json({
      status: true,
      data: filteredVoyages,
    });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
});

router.post('/update-by-email', auth(LEVELS.admin), async (req, res) => {
  try {
    const { prices, validity } = req.body;

    const timeframes = await pricesApplicableTimeframes.create({
      prices_start_date: validity.from,
      prices_end_date: validity.end,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const createdPrices = await Promise.all(
      prices.map(async (price) => {
        const polName = await port.findOne({
          where: {
            name: price.pol,
          },
        });

        const podName = await port.findOne({
          where: {
            name: price.pod,
          },
        });

        return await prices.create({
          pol: polName.id,
          pod: podName.id,
          price: price.price,
          applicableTimeId: timeframes.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }),
    );

    return res.json({
      status: true,
      data: createdPrices,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, error: err.message });
  }
});

module.exports = router;
