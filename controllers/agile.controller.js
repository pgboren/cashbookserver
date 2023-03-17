require('../models/index');
Moment = require('moment');
moment = require('moment-timezone');
const { paginate } = require('mongoose-paginate-v2');

const util = require('util');
const fs = require("fs");
var path = require('path');
let mongoose = require('mongoose');
const config = require('config');
const { Console } = require('console');
const agiletask = require('../models/agiletask');

exports.getTasks = async function (req, res) {
    
    const requestPage = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const query = req.query.q || {};
    const sort = { number: 'desc'};
    query.board = { $eq : req.query.board };
    query.stage =  { $in : req.query.stages };
    var Task = mongoose.model('agiletask');        
    try {

        const options = {
            page: requestPage,
            limit: limit,
            sort: sort,
            populate: [
              { path: 'item' },
              { path: 'stage' },
              { path: 'board' },
            ]
          };

        const { docs, totalPages, totalDocs, page } = await Task.paginate(query, options);
        var tasks = [];
        docs.forEach(doc => {
            
            tasks.push(createAgileTaskSnapshot('agiletask', doc));
        });

        res.status(200).json({
        data: tasks,
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalDocs,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
}

function createAgileTaskSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.title = model.name;
    doc.parent = model.parent;
    doc.className = entity;
    doc.data = {};
    doc.data.name = {label: "name", value:model.name + ' - ' + model.number, dataType: "STRING",type:"DATA"};
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


exports.get =async function (req, res, next) {
    try {
        getViewModel(res,req.params.id, 'agiletask');        
    }
    catch (e) {
        next(e) 
    }
}

function getViewModel(res, id, entity) {
    var query = getQuery(res, id, entity);
     query.exec(function(err, model) {  
         res.json(createAgileTaskSnapshot(entity, model));
      });
 }

 function getQuery(res, id, entity) {
    var query = null;
    var entityModel = null;
    entityModel = mongoose.model(entity); 
    query = entityModel.findOne({ _id: id });
    populateQuery(entity, query);
    return query;
}

function populateQuery(entity, query) {
    
    if (entity == 'agiletask') { 
        query.populate('stage');
        query.populate('board'); 
        query.populate('item'); 
    }
}
