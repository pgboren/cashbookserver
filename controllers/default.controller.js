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

exports.create = async function (req, res) {
    var docClasss = mongoose.model("agileboard");        
    var docs = new docClasss();
    docs.name = 'soleapmoto';
    const saveBoard = await docs.save();
    createDefaultStages(saveBoard._id, 'អតិថិជនថ្នី', '#fff176', 'ic_users', 1);
    createDefaultStages(saveBoard._id, 'រៀបចំឯកសារ', '#b39ddb', 'ic_docs_upload', 2);
    createDefaultStages(saveBoard._id, 'បោះបង់ចោល', '#e0e0e0', 'ic_cancel', 3);
    createDefaultStages(saveBoard._id, 'ស្នើរសុំបង់រំលស់', '#ffd54f', 'ic_loan', 4);
    createDefaultStages(saveBoard._id, 'សំណើរបដិសេធ', '#546e7a', 'ic_loan_reject', 5);
    createDefaultStages(saveBoard._id, 'សំណើរអនុម័ត', '#90caf9', 'ic_loan_approved', 6);
    createDefaultStages(saveBoard._id, 'ចេញវិក័យបត្រ', '#ef9a9a', 'ic_invoice', 7);
    createDefaultStages(saveBoard._id, 'ទូទាត់ប្រាក់', '#a5d6a7', 'ic_payment', 8);
    res.status(200);
}

function createDefaultStages(boardId, name, color, icon, order) {
    var modelClasss = mongoose.model("agilestage");        
    var model = new modelClasss();
    model.name = name;
    model.color = color;
    model.icon = icon;
    model.order = order;
    model.save();
}

exports.testdata = async function (req, res) {
    var boardClasss = mongoose.model("agileboard");        
    var stageClasss = mongoose.model("agilestage");        
    var name = "soleapmoto";
    const board = await boardClasss.findOne({ name });
    const stages = await stageClasss.find();
    const item = await createItem();
    stages.forEach(stage => {
        createTasks(board._id, stage._id, stage.name, item._id);
        console.log('Create task of ' + stage._id + ' - ' + stage.name )
    });
}

async function createItem() {
    var modelClasss = mongoose.model("item");        
    var model = new modelClasss();
    model.nameKh = "ហុងដា សង់ ឆ្នាំ 2023 - ខ្មៅ";
    model.name = "Honda dream 125cc 2023 - black";
    model.color = null;
    model.status = "ថ្មី";
    model.description = "ម៉ាស៊ីន 4 តង់​ / ស៊ីមី 1​ / OHC / បញ្ចុះកម្ដៅដោយខ្យល់";
    model.price = 2550;
    model.installmentPaymentPrice = 2850;
    model.cost = 2300;
    model.branch = null;
    model.category = null;
    model.power  = "125cc";
    model.year = 2023;
    const saveModel = await model.save();
    return saveModel;
}

function createTasks(boardId, stageId, name, item) {
    var modelClasss = mongoose.model("agiletask");        
    for(var i=0; j= 1000,i<j; i++){
        var model = new modelClasss();
        model.name = name + " " + i;
        model.description = "Testing Description " + i;
        model.paymentOption = "INSTALLMENT";
        model.stage = stageId;
        model.board = boardId;
        model.item = item;
        model.date = 1678697290805;
        model.phoneNumber = '070433123';
        model.save();
    }
}

