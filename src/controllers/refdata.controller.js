const db = require('../models');

const util = require('util');
const mongoose = require('mongoose');

const Category = db.category;
const Province = db.province;
const District = db.district;
const Commune = db.commune;
const Village = db.village;
const Maker = db.maker;
const Type = db.type;
const Condition = db.condition;
const Model = db.model;
const Color = db.color;

exports.syncdata = async function(req, res) {
    var categories = await Category.find({});
    var provinces = await Province.find({});
    var districts = await District.find({});
    var communes = await Commune.find({});
    var villages = await Village.find({});
    var makers = await Maker.find({});
    var types = await Type.find({});
    var conditions = await Condition.find({});
    var models = await Model.find({});
    var colors = await Color.find({});
    
    res.status(200).json({
        status: "success",
        data: {
            category: categories,
            maker: makers,
            type: types,
            condition:conditions,
            model: models,
            color: colors
        }
    });    

    // provinces: provinces,
    //         districts: districts,
    //         communes: communes,
    //         villages: villages,
    // category: categories,
    // district: districts,
    // commune: communes,
    // village: villages

}