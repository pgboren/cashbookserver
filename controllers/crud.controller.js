require('../models/index');
Category = require('../models/category');
`Contact = require('../models/contact');`
institute = require('../models/institute');
Address = require('../models/address');
Address = require('../models/item');
Color = require('../models/color');
saleorder = require('../models/saleorder');

Moment = require('moment');
moment = require('moment-timezone');

const util = require('util');
const fs = require("fs");
var path = require('path');
let mongoose = require('mongoose');
const config = require('config');
const { Console } = require('console');
const item = require('../models/item');

exports.get =async function (req, res, next) {
    try {
        getModel(res,req.params.id, req.params.entity);        
    }
    catch (e) {
        next(e) 
    }
}

exports.index = function (req, res) {
    var entity = req.params.entity;
    var query = getIndexQuery(entity, req);
    query.exec(function(err, entities) {
        if (entity == 'order') { 
            var orders = [];
            entities.forEach(element => {
                orders.push({_id: element._id, number: element.number, paymentType: element.paymentType, date: element.date, price: element.price, vehicle: element.vehicle.name, status: element.status, customer: element.customer.name});
            });
              res.json(orders);
        }
        else {
            res.json(entities);
        }
    });
    return;
};

function getIndexQuery(entity, req) { 
    var query = null;
    var sort = null;
    var entityModel = null;
    var condition = {};

    if (req.query.name != null) 
        condition.name = req.query.name;

    if (req.query.active != null) 
        condition.active = req.query.active;

    if (req.query.name != null) 
        condition.name = req.query.name;

    if (req.query.enable != null) 
        condition.enable = req.query.enable;

    if (req.query.parent != null) 
        condition.parent = req.query.parent;

    entityModel = mongoose.model(entity);        

    if (entity == 'institute') { 
        sort = {name: 'asc'};
    }

    if (entity == 'color') { 
        sort = {name: 'asc'};
    }

    if (entity == 'item') { 
        sort = {name: 'asc'};
    }

    if (entity == 'category') { 
        sort = {name: 'asc'};
    }

    query = entityModel.find(condition).collation({ locale: "en" }).sort(sort);
    
    if (entity == 'customer') { 
        query.populate('photo');
    }

    if (entity == 'item') { 
        query.populate('photo');
        query.populate('category');
    }

    return query;
    
}

exports.delete = function(req, res, next) {
    var entity = req.params.entity;
    var modelClasss = mongoose.model(entity);        
    modelClasss.findById(req.params.id).exec(
        function(err, model){
            if(model){
                modelClasss.deleteOne({ _id: req.params.id }).then(function(){
                    res.status(200).json({
                        status: "success",
                        message: 'Resource is deleted.'
                    });
                }).catch(function(err){
                    res.status(500).json({ message: 'The request was not completed due to an internal error on the server side..' })
                });
            }
            else {
                res.status(404).json({ message: 'Resource was not found.' })
            }
        }
    );


}

exports.patch = function(req, res) {
    var entityName = req.params.entity;
    var entity = req.params.entity;
    var modelClasss = mongoose.model(entity);        
    var data = req.body;
    modelClasss.findOneAndUpdate({ _id: req.params.id }, data,
        function (err, model) {
            if (err){
                console.log(err)
            }
            else {
                res.redirect("/api/view/" + entity + "/" + model.id);
            }
        }
    );

}

exports.update = function(req, res) {
    var entityName = req.params.entity;
    var entity = req.params.entity;
    var modelClasss = mongoose.model(entity);        
    var data = req.body;
    modelClasss.findById(req.params.id, function(err, model){
        if (err) {
            res.send(err);
        }

        if (entity == 'agileboard') {
            assignBoardValue(data, model); 
        }
        else if (entity == 'agilestage') {
            assignStageValue(data, model); 
        }
        else {
            assignValueToModel(entity, data, model); 
        }
        console.log(model);

        model.save(function (err) {
            if (err) {
                if (err.code == 11000) {
                    var error = {code: err.code, message: err.message};
                    res.status(500);
                    res.send(error);
                    return;
                }
            }
            res.redirect("/api/view/" + entity + "/" + model.id);
      });
    });
};


function getQuery(res, id, entity) {
    var query = null;
    var entityModel = null;
    entityModel = mongoose.model(entity); 


    query = entityModel.findOne({ _id: id });

    if (entity == 'contact') { 
        query.populate('photo')
    }

    if (entity == 'item') { 
        query.populate('color');
        query.populate('category');
    }

    
    return query;
}

function getModel(res, id, entity) {
    var query = getQuery(res, id, entity);
     query.exec(function(err, model) {      
             res.json(model);
      });
     return;
}

exports.new = function (req, res) {
    var entity = req.params.entity;
    var modelClasss = mongoose.model(entity);        
    var model = new modelClasss();
    var data = req.body;
    if (entity == 'agileboard') {
        assignBoardValue(data, model); 
    }
    else if (entity == 'agilestage') {
        assignStageValue(data, model); 
    }
    else if (entity == 'agiletask') {
        assignTaskValue(data, model); 
    }
    else {
        assignValueToModel(entity, data, model); 
    }
    model.save(
        function (err) {
            if (err) {
                console.log(err);
            if (err.code == 11000) {
                res.status(500);
                res.send(err);
                return;
            }
        } 

        res.redirect("/api/view/" + entity + "/" + model.id);
    });
};

function assignTaskValue(data, model) { 
    console.log(model);
    model.name = data.name;
    model.description = data.description;
    model.paymentOption = data.paymentOption;
    model.board = data.board;
    model.stage = data.stage;
    model.date = data.date
    model.item = data.item ;
    model.phoneNumber = data.phoneNumber;


}

function assignBoardValue(data, model) { 
    model.name = data.name;
    model.color = data.color;
    model.order = data.order;
}

function assignStageValue(data, model) { 
    model.name = data.name;
    model.color = data.color;
    model.icon = data.icon;
    model.board = data.board;
    model.order = data.order;
}

function assignValueToModel(entity, data, model) { 

    model.name = data.name;
    model.enable = data.enable;

    //Color
    model.code = data.code;

    //Category
    model.parent = data.parent;
    

    //Contact
    model.name = data.name;
    model.latinname = data.latinname;
    model.gender = data.gender;
    model.nickname = data.nickname;
    model.phoneNumber1 = data.phoneNumber1;
    model.phoneNumber2 = data.phoneNumber2;
    model.phoneNumber3 = data.phoneNumber3;
    model.facebook = data.facebook;
    model.telegram = data.telegram;

    //Item
    model.nameKh = data.nameKh;
    model.color = data.color;
    model.status = data.status;
    model.description = data.description;
    model.price = data.price;
    model.installmentPaymentPrice = data.installmentPaymentPrice;
    model.cost = data.cost;
    model.branch = data.branch;
    model.category = data.category;
    model.power = data.power;
    model.year = data.year;
    
    model.number = data.number;
    model.branch = data.branch;
    model.customer = data.customer;
    model.date = data.date;
    model.price = data.price;
    model.vehicleYear = data.vehicleYear;
    model.vehicleChassisNo = data.vehicleChassisNo;
    model.vehicleEngineNo = data.vehicleEngineNo;
    model.paymentType = data.paymentType;
    model.institute = data.institute;
    model.item = data.item;
    model.status = data.status;

    if (data.address) {
        var address = {};
        address.houseNo =  data.address.houseNo;
        address.floor = data.address.floor;
        address.roomNumber = data.address.roomNumber;
        address.postalCode = data.address.postalCode;
        address.street = data.address.street;
        address.village = data.address.village;
        address.commune = data.address.commune;
        address.district = data.address.district;
        address.province = data.address.province;
        model.address = address;
    }

    model.branch = data.branch;
    model.customer = data.customer;
    model.date = data.date;
    model.branch = data.branch;
    model.bookingAmount = data.bookingAmount;
    model.paymentOption = data.paymentOption;
    model.institute = data.institute;
    model.item = data.item;
    model.quantity = data.quantity;
    model.price = data.price;
    model.discount = data.discount;
    model.status = data.status;
    model.vehicleCondition = data.vehicleCondition;
}

   