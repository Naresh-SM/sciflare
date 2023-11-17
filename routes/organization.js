const router = require('express').Router();
require('dotenv').config();
const Organization = require('../models/organization');
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('./Verify');

router.post("/", verifyTokenAndAuthorization, async(req, res) => {
    const newOrganization = new Organization(req.body);
    try {
        const savedProduct = await newOrganization.save();
        res.status(200).json({
            status: true,
            message: 'Success!',
            data: savedProduct
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Failed!',
            data: error
        })
    }
});

router.put("/:id", verifyTokenAndAdmin, async(req, res) => {
    try {
        const savedProduct = await Organization.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new: true});
        res.status(200).json({
            status: true,
            message: 'Success!',
            data: savedProduct
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Failed!',
            data: null
        })
    }
});

router.delete("/:id", verifyTokenAndAdmin, async(req, res) => {
    try {
        await Organization.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: true,
            message: 'Successfully Deleted!',
            data: null
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Failed!',
            data: null
        })
    }
});

router.get("/", async(req, res) => {    
    try {
        let products = await Organization.find();
        
        res.status(200).json({
            status: true,
            message: 'Success!',
            data: products
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Failed!',
            data: null
        })
    }
});

module.exports = router