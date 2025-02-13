
const { charge, chargeType } = require('../models'); // import models
const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {LEVELS} = require("../constants/user-role");

// router.post("/:id/edit", auth(LEVELS.admin), async (req, res) => {
router.post("/:id/edit", async (req, res) => {
    try {
        const id = req.params.id;
        const { name, price, type } = req.body;

        const chargeObj = await charge.update({ 
            name: name,
            price: price,
            typeId: type,
            createdById: req.userId,
            updatedById: req.userId
        }, {
            where: {
                id: id
            }
        });

        return res.json({
            status: true,
            data: chargeObj
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ status:false,  clientErrMsg: 'updating charge failed' });
    }
});

// router.post("/:id/delete", auth(LEVELS.admin), async (req, res) => {
router.post("/:id/delete", async (req, res) => {
    try {
        const id = req.params.id;
        const c = await charge.destroy({
            where: {
                id: id
            },
          });

        return res.json({
            status: true,
            data: c
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ status:false,  error: 'charge' });
    }
});


// router.post("/create", auth(LEVELS.admin), async (req, res) => {
router.post("/create", async (req, res) => {
    try {
        const { name, price, type } = req.body;
        const chargeObj = await charge.create({ name, price, typeId: type, created_by_id: req.userId, updated_by_id: req.userId });
        return res.json({
            status: true,
            data: chargeObj
        });
    } catch (err) {
        return res.json({
            status: false,
        })
    }
});

// router.get("/list", auth(LEVELS.user), async (req, res) => {
router.get("/list", async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const pageSize = parseInt(req.query.pageSize);

        if(!page || !pageSize){
            const list = await charge.findAll({
                include: [
                    {
                        model: chargeType,
                    }
                ],
                order: [['id', 'DESC']],
            });
            return res.json({
                status: true,
                data: { charges: list }
            });
        } else {
            const count = await charge.count({});
            const list = await charge.findAll({
                offset: (page - 1) * pageSize,
                limit: pageSize,
                include: [
                    {
                        model: chargeType,
                    }
                ],
                order: [['id', 'DESC']],
            });
            return res.json({
                status: true,
                data: { charges: list, totalCount: count }
            });
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;