const path = require('path');
const mongoose = require('mongoose');
const db = require('../models');
const Moment = require('moment');
const moment = require('moment-timezone');
const Enum = require('enum')
const util = require('util');
const fs = require("fs");
const config = require('config');

const Province = db.province;
const District = db.district;
const Commune = db.commune;
const Village = db.village;

exports.listProvinces = async function (req, res) {
    try {
        var query = Province.find({}).sort({code: 'asc'});
        query.exec(function(err, provinces) {         
            res.status(200).json({
                data: provinces
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server error' });
    }
};

exports.listDistricts = async function (req, res) {
    try {
        var province = req.params.province;
        var query = District.find({ 'province' : province}).sort({code: 'asc'});
        query.exec(function(err, districts) {         
            res.status(200).json({
                data: districts
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server error' });
    }
};

exports.listCommunes = async function (req, res) {
    try {
        var district = req.params.district;
        var query = Village.find({ 'district' : district}).sort({code: 'asc'});
        query.exec(function(err, communes) {         
            res.status(200).json({
                data: communes
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server error' });
    }
};

exports.listVillages = async function (req, res) {
    try {
        var commune = req.params.commune;
        var query = Village.find({ 'commune' : commune}).sort({code: 'asc'});
        query.exec(function(err, villages) {         
            res.status(200).json({
                data: villages
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server error' });
    }
};


