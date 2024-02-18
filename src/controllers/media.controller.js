require('../models/index');
const { validationResult } = require('express-validator');
const Moment = require('moment');
const moment = require('moment-timezone');
const util = require('util');
const fs = require("fs");
const path = require('path');
const mongoose = require('mongoose');

function replaceAll(str, find, replace) {
	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.upload = async (req, res) => {
    try {
        file = req.file;
        var media = null;
		if (file != null) {
			const { filename, size, mimetype, path} = file;
			var logicalPath = replaceAll(path, '\\', '/');
            logicalPath = replaceAll(logicalPath, 'public/', '');
            const Media = mongoose.model("media");
			media = await Media.create({
				name: filename,
				size: size,
				mimetype: mimetype,
				path: logicalPath
			});
            return res.status(201).json({ id: media._id });
		}
        return res.status(204).json({ error: 'No Content' });
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            const key = Object.keys(error.keyValue)[0];
            const value = Object.values(error.keyValue)[0];
            return res.status(409).json({
                error: `The ${key}: '${value}' is already in use by another ${entity}.`,
            });
        }
        return res.status(500).json({ error: error.message });
    }
};