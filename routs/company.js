const express = require('express');
const { company } = require('../models');
// import models
const router = express.Router();

// router.get("/",auth(LEVELS.user), async(req,res) =>{
router.get('/list', async (req, res) => {
    try {
        const list = await company.findAll();
        return res.json({
            status: true,
            data: { companies: list },
        });
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
