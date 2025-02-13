
const {port} = require('../models'); // import models
const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {LEVELS} = require("../constants/user-role");

//   router.post("/",auth(LEVELS.admin), async(req,res) =>{
  router.post("/", async(req,res) =>{
    const { name } = req.body
    try{
        const p = await port.create({name});
        return res.json({
            status: true,
            data: { port: p }
        });
    }catch(err){
        return res.status(500).json(err);
    }
});

// router.get("/", auth(LEVELS.user), async(req,res) =>{
router.get("/", async(req,res) =>{
    try{
        const list = await port.findAll();
        return res.json({
            status: true,
            data: { list }
        });
    }catch(err){
        return res.status(500).json(err);
    }
});

  module.exports = router;