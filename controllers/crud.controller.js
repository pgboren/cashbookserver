require('../models/index');
const { validationResult } = require('express-validator');
const { paginate } = require('mongoose-paginate-v2');
const Moment = require('moment');
const moment = require('moment-timezone');
const util = require('util');
const fs = require("fs");
const path = require('path');
const mongoose = require('mongoose');
const config = require('config');

exports.createResource = async (req, res) => {
    const entity = req.params.entity;
    const Model = mongoose.model(entity);
    const data = req.body;

    try {
        // Check if there are any validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        // Create new model instance and assign values to fields
        const model = new Model(data);

        // Save new model instance to database
        const savedModel = await model.save();
        return res.status(201).json(savedModel);
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            const key = Object.keys(error.keyValue)[0];
            const value = Object.values(error.keyValue)[0];
            return res.status(409).json({
                error: `The ${key}: '${value}' is already in use by another ${entity}.`,
            });
        }

        // Handle other errors
        return res.status(500).json({ error: error.message });
    }
};

exports.delete = function(req, res, next) {
    const entity = req.params.entity;
    const modelClass = mongoose.model(entity);

    modelClass.findById(req.params.id).exec(function(err, model) {
        if (model) {
            modelClass.deleteOne({ _id: req.params.id }).then(function() {
                res.status(200).json({
                    status: "success",
                    message: 'Resource is deleted.'
                });
            }).catch(function(err) {
                res.status(500).json({ message: 'The request was not completed due to an internal error on the server side.' });
            });
        } else {
            res.status(404).json({ message: 'Resource was not found.' });
        }
    });
};

exports.patch = function(req, res) {
    const entity = req.params.entity;
    const modelClass = mongoose.model(entity);        
    const data = req.body;
    modelClass.findOneAndUpdate({ _id: req.params.id }, data, function (err, model) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/api/view/" + entity + "/" + model.id);
        }
    });
}

exports.update = function(req, res) {
    const entity = req.params.entity;
    const modelClass = mongoose.model(entity);        
    const data = req.body;
    modelClass.findOneAndUpdate({ _id: req.params.id }, data, { new: true }, function(err, updatedModel) {
        if (err) {
            res.status(500).send(err);
        }
        res.redirect("/api/view/" + entity + "/" + updatedModel.id);
    });
};
