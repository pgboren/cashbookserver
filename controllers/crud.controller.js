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

function replaceAll(str, find, replace) {
	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.createDocWithFile = async (req, res) => {
    const entity = req.params.entity;
    const Model = mongoose.model(entity);
    const data = JSON.parse(req.body.json);
    try {
        file = req.file;
        var media = null;
		if (file != null) {
			const { originalname, size, mimetype, path} = file;
			var logicalPath = replaceAll(path, '\\', '/');
            logicalPath = replaceAll(logicalPath, 'public/', '');
			var file_name = Date.now() +'_'+ originalname;
            const Media = mongoose.model("media");
			media = await Media.create({
				name: file_name,
				size: size,
				mimetype: mimetype,
				path: logicalPath
			});
		}
        const errors = validationResult(data);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const model = new Model(data);
        if (media != null) {
            model.photo = media;
        }

        const savedModel = await model.save();
        return res.status(201).json({ id: savedModel._id });

    } catch (error) {
        console.log(error);
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

exports.createDoc = async (req, res) => {
    const entity = req.params.entity;
    const Model = mongoose.model(entity);
    const data = req.body;
    try {
        const errors = validationResult(data);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const model = new Model(data);
        const savedModel = await model.save();
        return res.status(201).json({ id: savedModel._id });

    } catch (error) {
        console.log(error);
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

exports.getDoc = async (req, res) => {
    const docName = req.params.entity;
    const id = req.params.id;
    const docClass = mongoose.model(docName);
    docClass.findById(id).exec(function(err, doc) {
        if (doc) {
                res.status(200).json({
                    status: "success",
                    type: docName,
                    doc: doc
                });
        } else {
            res.status(404).json({ message: 'Resource was not found.' });
        }
    });
    
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
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        modelClass.findOneAndUpdate({ _id: req.params.id }, data, function (err, model) {
            if (err) {
                res.status(500).json({ error: err.message });
            }
            return res.status(201).json({ id: model._id });
        });
    } catch (error) {
        if (error.code === 11000) {
            const key = Object.keys(error.keyValue)[0];
            const value = Object.values(error.keyValue)[0];
            return res.status(409).json({
                error: `The ${key}: '${value}' is already in use by another ${entity}.`,
            });
        }
        return res.status(500).json({ error: error.message });
    }
}

exports.update = function(req, res) {
    const entity = req.params.entity;
    const Model = mongoose.model(entity);
    const data = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        modelClass.findOneAndUpdate({ _id: req.params.id }, data, function (err, model) {
            if (err) {
                res.status(500).json({ error: err.message });
            }
            return res.status(201).json({ id: savedModel._id });
        });

    } catch (error) {
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
