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
const accountType = require('../models/accounttype');
const account = require('../models/account');
const { add } = require('lodash');

exports.create = async function (req, res) {
    // var docClasss = mongoose.model("agileboard");        
    // var docs = new docClasss();
    // docs.name = 'ហាងម៉ួតូសុលាភ';
    // const saveBoard = await docs.save();
    // createDefaultStages(saveBoard._id, 'អតិថិជនថ្នី', '#fff176', 'ic_users', 1);
    // createDefaultStages(saveBoard._id, 'រៀបចំឯកសារ', '#b39ddb', 'ic_docs_upload', 2);
    // createDefaultStages(saveBoard._id, 'បោះបង់ចោល', '#e0e0e0', 'ic_cancel', 3);
    // createDefaultStages(saveBoard._id, 'ស្នើរសុំបង់រំលស់', '#ffd54f', 'ic_loan', 4);
    // createDefaultStages(saveBoard._id, 'សំណើរបដិសេធ', '#546e7a', 'ic_loan_reject', 5);
    // createDefaultStages(saveBoard._id, 'សំណើរអនុម័ត', '#90caf9', 'ic_loan_approved', 6);
    // createDefaultStages(saveBoard._id, 'ចេញវិក័យបត្រ', '#ef9a9a', 'ic_invoice', 7);
    // createDefaultStages(saveBoard._id, 'ទូទាត់ប្រាក់', '#a5d6a7', 'ic_payment', 8);
    // res.status(200);
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

    var type = createAccountType("Expense", "INCREASED", "DECREASED");
    createAccount(501, 'ប្រាក់ខែ', type._id);
    createAccount(502, 'ជួលផ្ទះ', type._id);
    createAccount(503, 'សំភារះការិយាល័យ', type._id);
    createAccount(504, 'ទឹកភ្លើង', type._id);
    createAccount(505, 'ការប្រាក់', type._id);
    createAccount(506, 'អាហារ', type._id);
    createAccount(507, 'សាំង', type._id);
    createAccount(508, 'អ៊ីនធឺណេត', type._id);
    createAccount(509, 'ទូរស័ព្ទ', type._id);
    createAccount(510, 'កំរៃជើងសារ១', type._id);
    createAccount(511, 'កំរៃជើងសារ២', type._id);
    createAccount(512, 'រង្វាន់អតិថិជន', type._id);
    createAccount(513, 'ជំងឺ', type._id);
    createAccount(514, 'ដើរកំសាន្ដ', type._id);
    
    type = createAccountType("Revenue", "INCREASED", "DECREASED");
    createAccount(300, 'លក់ម៉ូតូ', type._id);
    createAccount(301, 'ការប្រាក់', type._id);
    createAccount(302, 'ចំណូលផ្សេងៗ', type._id);

    type = createAccountType("Inventory", "INCREASED", "DECREASED");
    createAccount(101, 'ស្តុកម៉ូតូ', type._id);
    
    // createAccountType("Expenses",  "INCREASED", "DECREASED");
    // createAccountType("Income", "DECREASED", "INCREASED");
    // createAccountType("Equity",  "DECREASED", "INCREASED");

    // var boardClasss = mongoose.model("agileboard");        
    // var stageClasss = mongoose.model("agilestage");        
    // var name = "soleapmoto";
    // const board = await boardClasss.findOne({ name });
    // const stages = await stageClasss.find();
    // const item = await createItem();
    // stages.forEach(stage => {
    //     createTasks(board._id, stage._id, stage.name, item._id);
    //     console.log('Create task of ' + stage._id + ' - ' + stage.name )
    // });
}

function createAccount(number, name, type) {
    var Account = mongoose.model("account");        
    var account = new Account();
    account.number = number;
    account.name = name;
    account.type = type;
    account.save();
    return account;
}

function createAccountType(name, debit_effect, credit_effect) {
    var AccountType = mongoose.model("accounttype");        
    var accountType = new AccountType();
    accountType.name = name;
    accountType.debitEffect = debit_effect;
    accountType.creditEffect = credit_effect;
    accountType.save();
    return accountType;
}

function createContact(name) {
    var Contact = mongoose.model("contact");        
    var contact = new Contact();
    contact.name = name;
    contact.latinname = name;
    contact.nickname = name;
    contact.gender = "MALE";
    contact.phoneNumber1 = "070433123";
    contact.phoneNumber2 = "087987987";
    contact.phoneNumber3 = "087987987";
    contact.facebook = "087987987";
    contact.telegram = "070433123";

    var address = {};
    address.houseNo = "125E0E1";
    address.floor = "2";
    address.roomNumber = "100";
    address.postalCode = "855";
    address.street = "100";
    address.village = "ភានសារ";
    address.commune = "ព្រះនិពាន្ធ";
    address.district = "កងពិសី";
    address.province = "កំពង់ស្ពឺ";
    contact.address = address;
    contact.save();

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
    for(var i=0; j= 1,i<j; i++){
        var model = new modelClasss();
        model.name = name + " " + i;
        model.description = "Testing Description " + i;
        model.paymentOption = "INSTALLMENT";
        model.stage = stageId;
        model.board = boardId;
        model.item = item;
        model.price = 2500;
        model.date = 1678697290805;
        model.phoneNumber = '070433123';
        model.save();
    }
}

