require('../models/index');
Moment = require('moment');
moment = require('moment-timezone');

const util = require('util');
const fs = require("fs");
var path = require('path');
let mongoose = require('mongoose');
const config = require('config');
const { Console } = require('console');

exports.query = function (req, res) {
    try {
        var entity = req.params.entity;  
        var query = getIndexQuery(entity, req);
        query.exec(function(err, entities) {
            var docs = [];
            entities.forEach(model => {
                docs.push(createDocumentSnapshot(entity, model));
            });
            
            res.json(docs);
        });
        return;

    }
    catch (e) {
        console.log(e);
        next(e) 
    }
}

exports.get =async function (req, res, next) {
    try {
        getViewModel(res,req.params.id, req.params.entity);        
    }
    catch (e) {
        next(e) 
    }
}

function populateQuery(entity, query) {
    
    // if (entity == 'loanrequest') { 
    //     query.populate('branch');
    //     query.populate({path:'customer', populate: { path:  'photo', model: 'media' }});
    //     query.populate({path:'item', populate: { path:  'photo', model: 'media' }});
    //     query.populate({path:'item', populate: { path:  'color', model: 'color' }});                                                                                                                                                                  
    //     query.populate({path:'institute', populate: { path:  'logo', model: 'media' }});
        
    // }
}

function getQuery(res, id, entity) {
    var query = null;
    var entityModel = null;
    entityModel = mongoose.model(entity); 
    query = entityModel.findOne({ _id: id });
    populateQuery(entity, query);
    return query;
}

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


    if (entity == 'agilestage' && req.query.board != null) 
        condition.board = req.query.board;

    if (entity == 'agiletask' && req.query.board != null) 
        condition.board = req.query.board;

    entityModel = mongoose.model(entity);        

    if (entity == 'agileboard') { 
        sort = {order: 'asc'};
    }

    if (entity == 'agilestage') { 
        sort = {order: 'asc'};
    }

    if (entity == 'agiletask') { 
        sort = {stage:'asc' , order: 'asc'};
    }

    query = entityModel.find(condition).collation({ locale: "en" }).sort(sort);
    populateQuery(entity, query);
    return query;
    
}

function getViewModel(res, id, entity) {
   var query = getQuery(res, id, entity);
    query.exec(function(err, model) {  
        res.json(createDocumentSnapshot(entity, model));
     });
}

function createDocumentSnapshot(entity, model) {

    var doc = null;
    
    if (entity == 'agileboard') { 
        doc = createAgileBoardSnapshot(entity, model);      
    }

    if (entity == 'agilestage') { 
        doc = createAgileStageSnapshot(entity, model);      
    }

    if (entity == 'agiletask') { 
        doc = createAgileTaskSnapshot(entity, model);      
    }

    return doc;
}

function createAgileBoardSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.title = model.name;
    doc.className = entity;
    doc.data = {};
    doc.data.name = {label: "name", value:model.name, dataType: "STRING",type:"DATA"};
    doc.data.color = {label: "color", value:model.color, dataType: "STRING",type:"DATA"};
    doc.data.order = {label: "order", value:model.order, dataType: "STRING",type:"DATA"};
    return doc;
}

function createAgileStageSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.title = model.name;
    doc.className = entity;
    doc.data = {};
    doc.data.name = {label: "name", value:model.name, dataType: "STRING",type:"DATA"};
    doc.data.color = {label: "color", value:model.color, dataType: "STRING",type:"DATA"};
    doc.data.icon = {label: "icon", value:model.color, dataType: "STRING",type:"DATA"};
    doc.data.order = {label: "order", value:model.order, dataType: "STRING",type:"DATA"};
    return doc;
}


function createAgileTaskSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.title = model.name;
    doc.parent = model.parent;
    doc.className = entity;
    doc.data = {};
    doc.data.name = {label: "name", value:model.name, dataType: "STRING",type:"DATA"};
    doc.data.description = {label: "description", value:model.description, dataType: "STRING",type:"DATA"};
    doc.data.stage = {label: "stage", value:model.stage, dataType: "STRING",type:"DATA"};
    doc.data.board = {label: "board", value:model.board, dataType: "STRING",type:"DATA"};
    doc.data.order = {label: "order", value:model.order, dataType: "STRING",type:"DATA"};
    return doc;
}