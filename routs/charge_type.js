
const { chargeType } = require('../models'); // import models
const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {LEVELS} = require("../constants/user-role");

// router.get("/list", auth(LEVELS.admin), async (req, res) => {
router.get("/list", async (req, res) => {
    try {
        const list = await chargeType.findAll({});
        return res.json({
            status: true,
            data: { types: list }
        });
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;