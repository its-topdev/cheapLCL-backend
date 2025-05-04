const express = require('express');

const router = express.Router();
const {
  bookRequest, user, bookStatus, charge, prices, port, chargeType, shipper, contact, country
} = require('../models'); // import models
const { parameters } = require('../config/params');
const { sendEmail } = require('../services/Email');
const { templates } = require('../constants/email-templates');
const { auth } = require('../middlewares/auth');
const { book_status } = require('../constants/book-status');
const { book_request_prefix } = require('../constants/general');
const { LEVELS } = require('../constants/user-role');

router.post('/create', auth(LEVELS.user), async (req, res) => {
  // router.post('/create', async (req, res) => {
  const book = req.body;
  book.userId = req.userId;
  book.createdById = req.userId;
  book.bookStatusId = book_status.CREATED;
  book.vessel = book.vessel;
  book.voyage = book.voyage;
  try {
    // Retrieve pol and pod IDs from the port table
    const pol_Obj = await port.findOne({
      where: { name: book.pol },
      attributes: ['id']
    });
    const pod_Obj = await port.findOne({
      where: { name: book.pod },
      attributes: ['id']
    });

    if (!pol_Obj || !pod_Obj) {
      return res.status(400).json({
        status: false,
        error: 'Invalid POL or POD name',
      });
    }

    // Find the priceId using pol and pod IDs, ordered by the latest update
    const priceObj = await prices.findOne({
      where: {
        pol: pol_Obj.id,
        pod: pod_Obj.id,
      },
      attributes: ['id'],
      order: [['updatedAt', 'DESC']],
      limit: 1
    });
    if (!priceObj) {
      return res.status(400).json({
        status: false,
        error: 'Price not found for the given POL and POD',
      });
    }

    // Set the priceId in the booking request
    book.priceId = priceObj.id;
    // create new booking request
    const newBook = await bookRequest.create(book);
    await charge.findAll().then((list) => {
      newBook.addCharges(list);
    });
    const bookUser = await user.findOne({
      attributes: ['name', 'email', 'phone'],
      where: {
        id: newBook.userId,
      },
    });

    // send email to referant
    // const email = await newBook.getEmailByPol();
    const params = [
      { name: 'BOOK_NUMBER', content: newBook.id },
      { name: 'BOOK_POL', content: book.pol },
      { name: 'BOOK_POD', content: book.pod },
      { name: 'USER_NAME', content: bookUser.name },
      { name: 'USER_EMAIL', content: bookUser.email },
      { name: 'USER_PHONE', content: bookUser.phone },
    ];

    const to = parameters.managersEmailsTo.map((item) => ({ email: item }));
    // const to = [{ email }];
    // const to = bookUser.email;
    const response = sendEmail(
      templates.new_book_referant,
      to,
      'NEW BOOKING REQUEST',
      params,
    );

    // send email to customer
    const weightOrCbm =
      newBook.weight > newBook.cbm ? `${newBook.weight}MT` : `${newBook.cbm}M³`;
    const paramsCustomer = [
      { name: 'WEIGHT_OR_CBM', content: weightOrCbm },
      { name: 'POL', content: book.pol },
      { name: 'POD', content: book.pod },
      { name: 'USER_NAME', content: bookUser.name },
    ];
    // console.log(paramsCustomer);

    const toCustomer = [{ email: bookUser.email }];
    const responseCustomer = sendEmail(
      templates.new_book_customer,
      toCustomer,
      `Your order ${book_request_prefix}-${newBook.id} has been approved!`,
      paramsCustomer,
    );

    return res.json({
      status: true,
      data: newBook,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json(err);
  }
});
// router.get("/list",  auth(LEVELS.admin), async (req, res) => {
router.get("/list", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const listType = req.query.list_type || 'undefined';
    let count, list;
    const charges = await charge.findAll({
      include: [
        {
          model: chargeType,
        },
      ],
    });
    if (listType === 'quotes') {
      const userId = req.query.user_id;
      if (!userId) {
        return res.status(400).json({
          status: false,
          error: 'user_id is required when list_type is quotes',
        });
      }
      count = await bookRequest.count({
        where: { userId },
      });
      list = await bookRequest.findAll({
        where: { userId },
        offset: (page - 1) * pageSize,
        limit: pageSize,
        include: [
          {
            model: prices,
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
          },
          {
            model: user,
          },
          {
            model: bookStatus,
          },
          {
            model: shipper,
            include: [
              {
                model: contact,
                as: 'contactObj',
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
        order: [['id', 'DESC']],
      });
    } else {
      count = await bookRequest.count({});
      list = await bookRequest.findAll({
        offset: (page - 1) * pageSize,
        limit: pageSize,
        include: [
          {
            model: prices,
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
          },
          {
            model: user,
          },
          {
            model: bookStatus,
          },
          {
            model: shipper,
            include: [
              {
                model: contact,
                as: 'contactObj',
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
        order: [['id', 'DESC']],
      });
    }

    return res.json({
      status: true,
      data: { books: list, totalCount: count, charges },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// router.post("/:id/update-status", auth(LEVELS.admin),  async (req, res) => {
router.post('/:id/update-status', async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  if (!id || !status) {
    console.log('missing parameter');
    return res.json({
      status: false,
      error: 'missing parameters',
    });
  }
  const bookObj = await bookRequest.findOne({
    where: {
      id,
    },
  });
  if (!bookObj) {
    return res.json({
      status: false,
      clientErrMsg: 'book not found',
    });
  }
  bookObj.bookStatusId = status;
  await bookObj.save();
  if (status == book_status.CANCELLED) {
    const bookObjUser = await bookObj.getUserObj();
    const params = [
      { name: 'NAME', content: bookObjUser.name },
      { name: 'ORDER_NUMBER', content: bookObj.id },
    ];
    const to = [{ email: bookObjUser.email }];
    const res = await sendEmail(
      templates.cancel_book,
      to,
      'Important Update: Your Recent CheapLCL Order Has Been Canceled',
      params,
    );
  }
  return res.json({
    status: true,
    data: {},
  });
});

module.exports = router;
