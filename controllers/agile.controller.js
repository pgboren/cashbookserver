require('../models/index');
Moment = require('moment');
moment = require('moment-timezone');

const util = require('util');
const fs = require("fs");
var path = require('path');
let mongoose = require('mongoose');
const config = require('config');
const { Console } = require('console');

exports.createtasks = function (req, res) {
    var boardId = "63e33a686706e92dd049204c";
    createTasks(boardId, "63e9dcec0759ba3dc06bfff4", "អតិថិជនថ្នី");
    createTasks(boardId, "63e9dcf80759ba3dc06bfff7", "រៀបចំឯកសារ");
    createTasks(boardId, "63e9dd000759ba3dc06bfffa", "បោះបង់ចោល");
    createTasks(boardId, "63e9dd080759ba3dc06bfffd", "ស្នើរសុំបង់រំលស់");
    createTasks(boardId, "63e9dd160759ba3dc06c0000", "សំណើរបដិសេធ");
    createTasks(boardId, "63e9dd1e0759ba3dc06c0003", "សំណើរអនុម័ត");
    createTasks(boardId, "63e9dd260759ba3dc06c0006", "ចេញវិក័យបត្រ");
    createTasks(boardId, "63e9dd2d0759ba3dc06c0009", "ទូទាត់ប្រាក់");
}

function screateTasks(boardId, stageId, name) {
    var modelClasss = mongoose.model("agiletask");        
    for(var i=0; j= 10,i<j; i++){
        var model = new modelClasss();
        model.name = name + " " + i;
        model.description = "Testing Description " + i;
        model.stage = stageId;
        model.board = boardId;
        model.order = i;
        model.save();
    }
}

exports.query = function (req, res) {
    try {
        var entity = req.params.entity;  
        var query = null;
        if (entity == "agiletask") {
            query = getTaskQuery(entity, req);
        }
        else {
            query = getIndexQuery(entity, req);
        }
        
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
    
    if (entity == 'agiletask') { 
        query.populate('stage');
        query.populate('board'); 
        query.populate('item'); 
    }
}

function getQuery(res, id, entity) {
    var query = null;
    var entityModel = null;
    entityModel = mongoose.model(entity); 
    query = entityModel.findOne({ _id: id });
    populateQuery(entity, query);
    return query;
}

function getTaskQuery(entity, req) {
    var query = null;
    var sort = null;
    var entityModel = null;
    var condition = {};
    var stages = null;

    entityModel = mongoose.model(entity);        

    if (req.query.name != null) 
        condition.name = req.query.name;

    if (entity == 'agiletask') {
        condition.board = { $eq : '63e33a686706e92dd049204c' };
        condition.stage =  { $in : req.query.stages };
    }
    
    if (entity == 'agiletask') { 
        sort = { number: 'desc'};
    }

    query = entityModel.find(condition).collation({ locale: "en" }).sort(sort);
    populateQuery(entity, query);
    return query;
}

function getIndexQuery(entity, req) { 
    var query = null;
    var sort = null;
    var entityModel = null;
    var condition = {};
    var stages = null;

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

    if (entity == 'agiletask') {
        condition.board = req.query.board;
        condition.stages = req.query.stages;
    }
        
    entityModel = mongoose.model(entity);        

    if (entity == 'agileboard') { 
        sort = {order: 'asc'};
    }

    if (entity == 'agilestage') { 
        sort = {order: 'asc'};
    }

    if (entity == 'agiletask') { 
        sort = {order: 'asc'};
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
    doc.data.paymentOption = {label: "paymentOption", value:model.paymentOption, dataType: "STRING",type:"DATA"};
    
    var date = new Date(model.date);
    var dateString = moment(date).format('DD-MM-yyyy');
    doc.data.date = {label: "date", value:dateString, dataType: "STRING",type:"DATA"}

    var stage = {label:"stage", type: "GROUP", dataType: "GROUP"};    
    stage.childrent = {};
    stage.childrent.id = {label: "id", value:model.stage.id, dataType: "STRING",type:"DATA"};
    stage.childrent.name = {label: "name", value:model.stage.name, dataType: "STRING",type:"DATA"};
    stage.childrent.color = {label: "color", value:model.stage.color, dataType: "STRING",type:"DATA"};
    stage.childrent.icon = {label: "icon", value:model.stage.icon, dataType: "STRING",type:"DATA"};
    doc.data.stage = stage;

    var item = {label:"item", type: "GROUP", dataType: "GROUP"};    
    item.childrent = {};
    item.childrent.id = {label: "id", value:model.item.id, dataType: "STRING",type:"DATA"};
    item.childrent.name = {label: "name", value:model.item.name, dataType: "STRING",type:"DATA"};
    doc.data.item = item;

    var board = {label:"board", type: "GROUP", dataType: "GROUP"};    
    board.childrent = {};
    board.childrent.id = {label: "id", value:model.board.id, dataType: "STRING",type:"DATA"};
    board.childrent.name = {label: "name", value:model.board.name, dataType: "STRING",type:"DATA"};
    doc.data.board = board;
    doc.data.order = {label: "order", value:model.order, dataType: "STRING",type:"DATA"};
    return doc;
}
