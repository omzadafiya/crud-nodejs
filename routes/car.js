const express = require('express');
const router = express.Router();
const CarController = require('../controller/cars');
const authMiddleware = require("../middlewares/auth");
const multer = require('multer');
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require('mongodb');
const cars = mongoCollections.cars; ``
const { type } = require('os');

router.post('/insert', authMiddleware, CarController.upload, async (req, resp) => {
    let car = await CarController.addCar(req.body, req.file)
    resp.send(car);
});

router.get('/getdata', authMiddleware, async (req, resp) => {
    let data = await CarController.findCar(req.query.id)
    resp.send(data);
});

router.put('/update/:id', CarController.upload, async (req, resp) => {
    console.log(req.body);
    let data = await CarController.updateCar(req.params.id, req.body, req.file)
    resp.send(data)
});

router.delete('/deletedata/:id', authMiddleware, async (req, resp) => {
    console.log(req.params.id)
    if (req.params.id) {
        let data = await CarController.deleteCar(req.params.id)
        resp.send(data);
    }
    else {
        resp.send("Please enter Valid Id")
    }

});

router.post('/uplode/:id', CarController.upload, async (req, resp) => {
    let data = await CarController.uplode_image(req.params.id, req.file)
    resp.send(data);

});

module.exports = router;

