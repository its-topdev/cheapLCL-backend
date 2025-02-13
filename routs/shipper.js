
const { shipper, contact } = require('../models'); // import models
const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { LEVELS } = require('../constants/user-role');

// router.get("/user-shippers", auth(LEVELS.user), async (req, res) => {
router.get("/user-shippers", async (req, res) => {
    try {
        const list = await shipper.findAll({
            where: {
                userId: req.userId
            }
        });
        return res.json({
            status: true,
            data: {shippers: list}
        });
    } catch (err) {
        return res.json({
            status: false,
        })
    }
});

// router.post("/create", auth(LEVELS.user), async (req, res) => {
router.post("/create", async (req, res) => {
    try {
        const { name, address, country, city, zip, contactName, contactPhone, contactEmail, contacts  } = req.body;
        const shipperObj = await shipper.create({ userId: req.userId, name, address, countryId: country, cityId: city, zip, createdById: req.userId, updatedById: req.userId });
        
        if(shipperObj){
            await contact.create({ name:contactName, email:contactEmail, phone:contactPhone, shipperId:shipperObj.id , createdById: req.userId, updatedById: req.userId });
            contacts.forEach(function(element) 
            { 
                contact.create({ name:element.name, email:element.email, phone:element.phone, shipperId:shipperObj.id , createdById: req.userId, updatedById: req.userId });
            });
        }       
        
        return res.json({
            status: true,
            data: shipperObj
        });
    } catch (err) {
        return res.json({
            status: false,
        })
    }

});

module.exports = router;