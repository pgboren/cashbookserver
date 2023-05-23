const Category = require('../models/category');
const Branch = require('../models/branch');
const Color = require('../models/color');
const Item = require('../models/item');
const LoanRequest = require('../models/loanrequest');
const Couponnumbers = require('../models/couponnumber');
const LoanInstitution = require('../models/institute');


const Contact = require('../models/contact');

const Moment = require('moment');
const moment = require('moment-timezone');

const Enum = require('enum')
const util = require('util');
const fs = require("fs");
var path = require('path');
let mongoose = require('mongoose');
const config = require('config');
const { Console } = require('console');

var viewType = new Enum({'LIST_VIEW': 'LIST_VIEW', 'LIST_ITEM_VIEW': 'LIST_ITEM_VIEW'});

exports.getViewData = async function (req, res) {
    try {
        var response = null;
        if (req.params.viewName == viewType.LIST_VIEW.value) {
            await getListViewData(req, res);
        }

        if (req.params.viewName == viewType.LIST_ITEM_VIEW.value) {
            getListItemViewData(req, res);
        }
        
    } catch (err) {
        res.status(500).json({ message: 'Internal Server error' });
    }
};

async function getListItemViewData(req, res) {
    const docName = req.params.docname;
    const docModelClass = mongoose.model(docName);
    var query = docModelClass.findOne({ _id: req.query.id });
    query.exec(function(err, model) {      
        if (!model) {
            res.status(404).json({ message: `${req.params.docname} with id ${req.params.id} not found` });
        }
        else {
            if (docName == 'contact') {
                createContactListItemViewData(req, res);
            }
        }
    });
}

function createContactListItemViewData(req, res) {
    const docModelClass = mongoose.model(req.params.docname);
    var query = docModelClass.findOne({ _id: req.query.id }).populate("photo");
    query.exec(function(err, contact) {      
        if (!contact) {
            res.status(404).json({ message: `${req.params.docname} with id ${req.params.id} not found` });
        }
        else {
            var data = {
                id: contact._id,
                name:contact.name,
                latinname: contact.latinname,
                phoneNumber: contact.phoneNumber1,
                photo: contact.photo? contact.photo.path : null
            };
            res.status(200).json(data);
        }
    });
}

async function getListViewData(req, res) {
    const limit = parseInt(req.query.limit) || 10;
        const { select, orders, filter } = req.body;
        const docModel = mongoose.model(req.params.docname);
        const options = {
            select,
            page: parseInt(req.query.page) || 1,
            limit,
            sort: orders
        };
        const result = await docModel.paginate({}, options);
        const docs = [];
        result.docs.forEach(model => {
            var doc = createViewDocumentSnapshot(model, req.params.docname);
           docs.push(doc);
        });

        res.status(200).json({
            data: docs,
            currentPage: result.page,
            totalPages: result.totalPages,
            totalItems: result.totalDocs,
        });
}


exports.get =async function (req, res, next) {
    var entityModel = mongoose.model(req.params.document); 
    var query = entityModel.findOne({ _id: req.params.id });
    query.exec(function(err, model) {      
        if (!model) {
            res.status(404).json({ message: `${req.params.document} with id ${req.params.id} not found` });
        }
        else {
            res.json(model);
        }
    });
    return;
}

exports.index = async function (req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const { select, orders, filter } = req.body;
        const docModel = mongoose.model(req.params.document);
        const options = {
            select,
            page: parseInt(req.query.page) || 1,
            limit,
            sort: orders
        };
        const result = await docModel.paginate({}, options);
        const docs = [];
        result.docs.forEach(model => {
            var doc = createViewDocumentSnapshot(model, req.params.document);
           docs.push(doc);
        });
        res.status(200).json({
            data: docs,
            currentPage: result.page,
            totalPages: result.totalPages,
            totalItems: result.totalDocs,
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server error' });
    }
};

function createViewDocumentSnapshot(doc, documentName) {
    var viewDocSnapshot = {};
    viewDocSnapshot._id = doc._id;
    viewDocSnapshot.docClassName = documentName;
    return viewDocSnapshot;
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

    if (entity == 'agilestask' && req.query.board != null) 
        condition.board = req.query.board;

    entityModel = mongoose.model(entity);        

    if (entity == 'category' || entity == 'branch') { 
        sort = {name: 'asc'};
    }

    if (entity == 'agileboard') { 
        sort = {order: 'asc'};
    }

    if (entity == 'agilestage') { 
        sort = {order: 'asc'};
    }

    if (entity == 'agilestask') { 
        sort = {stage:'asc' , order: 'asc'};
    }
    query = entityModel.find(condition).collation({ locale: "en" }).sort(sort);
    populateQuery(entity, query);
    return query;
    
}

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

exports.getView =async function (req, res, next) {
    try {
        getViewModel(res, req.params.id, req.params.entity);        
    }
    catch (e) {
        next(e) 
    }
}

exports.getNewCouponNumber =async function (req, res, next) {
    try {
        var query = Couponnumbers.find({ entity: req.params.entity }).sort({number: 'desc'}).limit(1);
        query.exec(function(err, couponnumbers) {        
            
            var number = 0;
            if (couponnumbers.length > 0) {
                number = couponnumbers[0].number + 1;
            }
            else {
                number = 1;
            }
            var newNumber = new Couponnumbers();
                newNumber.entity = req.params.entity;
                newNumber.number = number;
                newNumber.save();
            res.json(newNumber);
        });
    }
    catch (e) {
        next(e) 
    }
}

function getViewModel(res, id, entity) {
   var entityModel = mongoose.model(entity); 
   var query = entityModel.findOne({ _id: id });
   populateQuery(entity, query);
    query.exec(function(err, model) {  
        res.json(createDocumentSnapshot(entity, model));
     });
}

function createDocumentSnapshot(entity, model) {

    var doc = null;

    if (entity == 'category') { 
        doc = createCategoryDocumentSnapshot(entity, model);      
    }

    if (entity == 'item') { 
        doc = createBsItemDocSnapshot(entity, model);      
    }

    if (entity == 'color') { 
        doc = createBsColorDocSnapshot(entity, model);      
    }

    if (entity == 'branch') { 
        doc = createBsDocSnapshot(entity, model);      
    }

    if (entity == 'institute') { 
        doc = createInstituteDocSnapshot(entity, model);      
    }

    if (entity == 'contact') { 
        doc = createContactDocumentSnapshot(entity, model);      
    }

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

function createTypeDocumentSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.className = entity;
    doc.data  = {
        name:{label: "name", value:model.name, dataType: "STRING",type:"DATA"}
    };
    return doc;
}

function createBsItemDocSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.className = entity;
    doc.data = {};
    var general = {label:"general", dataType: "GROUP", type: "GROUP"};    
    general.childrent = {};
    if (model.photo) {
        general.childrent.photo = {label: "photo", value:model.photo.path, dataType: "PHOTO",type:"DATA", action: "PHOTO_UPLOAD"};
    }
    else {
        general.childrent.photo = {label: "photo", value:null, dataType: "PHOTO",type:"DATA", action: "PHOTO_UPLOAD"};
    }
    general.childrent.name = {label: "name", value:model.name, dataType: "STRING",type:"DATA"};
    general.childrent.nameKh = {label: "nameKh", value:model.nameKh, dataType: "STRING",type:"DATA"};

    if (model.color != null) {
        general.childrent.color = {label: "color", value:model.color.name, dataType: "STRING",type:"DATA"};
    }
    else {
        general.childrent.color = {label: "color", value:"", dataType: "STRING",type:"DATA"};
    }
    
    general.childrent.year = {label: "year", value:model.year, dataType: "STRING",type:"DATA"};
    general.childrent.power = {label: "power", value:model.power, dataType: "STRING",type:"DATA"};
    general.childrent.description = {label: "description", value:model.description, dataType: "STRING",type:"DATA"};
    general.childrent.price = {label: "price", value:model.price, dataType: "CURRENCY",type:"DATA", locale: "US"};
    general.childrent.installmentPaymentPrice = {label: "installmentPaymentPrice", value:model.installmentPaymentPrice, dataType: "CURRENCY",type:"DATA", locale: "US"};
    general.childrent.cost = {label: "cost", value:model.cost, dataType: "CURRENCY",type:"DATA", locale: "US"};  
    general.childrent.category = {label: "category", value:model.category.name, dataType: "STRING",type:"DATA"};
    

    if (model.enable) {
        general.childrent.status = {label: "status", value: "សកម្ម", dataType: "STRING",type:"DATA"}
    }
    else {
        general.childrent.status = {label: "status", value: "អសកម្ម", dataType: "BOOLEAN",type:"DATA"}
    }
    doc.contextMenu = 'model_view_action';  
    doc.title = model.name;

    doc.data.root = {label:"root", type: "ROOT", dataType: "ROOT", childrent: {}};
    doc.data.root.childrent.general = general;
    return doc;
}

function createBsDocSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.title = model.name;
    doc.className = entity;
    doc.data = {};
    var general = {label:"general", type: "GROUP", dataType: "GROUP"};    
    general.childrent = {};
    general.childrent.name = {label: "name", value:model.name, dataType: "STRING",type:"DATA"};
    if (model.enable) {
        general.childrent.status = {label: "status", value: "សកម្ម", dataType: "STRING",type:"DATA"}
    }
    else {
        general.childrent.status = {label: "status", value: "អសកម្ម", dataType: "BOOLEAN",type:"DATA"}
    }
    doc.contextMenu = 'model_view_action';  
    doc.title = model.name;
    doc.data.root = {label:"root", type: "ROOT", dataType: "ROOT", childrent: {}};
    doc.data.root.childrent.general = general;
    return doc;
}

function createBsColorDocSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.className = entity;
    doc.data = {};
    var general = {label:"general", type: "GROUP", dataType: "GROUP"};    
    general.childrent = {};
    general.childrent.name = {label: "name", value:model.name, dataType: "STRING",type:"DATA"};
    general.childrent.code = {label: "code", value:model.code, dataType: "STRING",type:"DATA"};
    if (model.enable) {
        general.childrent.status = {label: "status", value: "សកម្ម", dataType: "STRING",type:"DATA"}
    }
    else {
        general.childrent.status = {label: "status", value: "អសកម្ម", dataType: "BOOLEAN",type:"DATA"}
    }
    doc.contextMenu = 'model_view_ac`dftion';  
    doc.title = model.name;

    doc.data = {};
    doc.data.root = {label:"root", type: "ROOT", dataType: "ROOT", childrent: {}};
    doc.data.root.childrent.general = general;
    return doc;
}

function createInstituteDocSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.className = entity;
    doc.data = {};
    var general = {label:"general", type: "GROUP", dataType: "GROUP"};    
    general.childrent = {};
    if (model.photo) {
        general.childrent.photo = {label: "logo", value:model.photo.path, dataType: "PHOTO",type:"DATA", action: "PHOTO_UPLOAD"};
    }
    else {
        general.childrent.photo = {label: "logo", value:null, dataType: "PHOTO",type:"DATA", action: "PHOTO_UPLOAD"};
    }    


    general.childrent.name = {label: "name", value:model.name, dataType: "STRING",type:"DATA"};
    if (model.enable) {
        general.childrent.status = {label: "status", value: "សកម្ម", dataType: "STRING",type:"DATA"}
    }
    else {
        general.childrent.status = {label: "status", value: "អសកម្ម", dataType: "BOOLEAN",type:"DATA"}
    }

    var address = {label:"address", type: "GROUP", dataType: "GROUP"};    
    address.childrent = {};

    
    address.childrent.houseNo = {label: "houseNo", value:model.address.houseNo, dataType: "STRING",type:"DATA"};
    address.childrent.floor = {label: "floor", value:model.address.floor, dataType: "STRING",type:"DATA", visible: 4};
    address.childrent.roomNumber = {label: "roomNumber", value:model.address.roomNumber, dataType: "STRING",type:"DATA", visible: 4};
    address.childrent.postalCode = {label: "postalCode", value:model.address.postalCode, dataType: "STRING",type:"DATA", visible: 4};
    address.childrent.street = {label: "street", value:model.address.street, dataType: "STRING",type:"DATA"};
    address.childrent.village = {label: "village", value:model.address.village, dataType: "STRING",type:"DATA"};
    address.childrent.commune = {label: "commune", value:model.address.commune, dataType: "STRING",type:"DATA"};
    address.childrent.district = {label: "district", value:model.address.district, dataType: "STRING",type:"DATA"};
    address.childrent.province = {label: "village", value:model.address.province, dataType: "STRING",type:"DATA"};
    general.childrent.address = address;
    doc.contextMenu = 'model_view_action';  
    doc.title = model.name;

    doc.data = {};
    doc.data.root = {label:"root", type: "ROOT", dataType: "ROOT", childrent: {}};
    doc.data.root.childrent.general = general;
    return doc;
}

function createCategoryDocumentSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.className = entity;
    var general = {label:"general", type: "GROUP",dataType: "GROUP"};    
    general.childrent = {};

    general.childrent.name = {label: "name", value:model.name, dataType: "STRING",type:"DATA"};

    if (model.enable) {
        general.childrent.status = {label: "status", value: "សកម្ម", dataType: "STRING",type:"DATA"}
    }
    else {
        general.childrent.status = {label: "status", value: "អសកម្ម", dataType: "BOOLEAN",type:"DATA"}
    }

    
    doc.contextMenu = 'model_view_action';  
    doc.title = model.name;
    doc.data = {};
    doc.data.root = {label:"root", type: "ROOT", dataType: "ROOT", childrent: {}};
    doc.data.root.childrent.general = general;
    return doc;
}

function createContactDocumentSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.className = entity;
    
    var general = {label:"general", type: "GROUP", dataType: "GROUP", childrent: {}};
    if (model.photo) {
        general.childrent.photo = {label: "photo", value:model.photo.path, dataType: "PHOTO",type:"DATA", action: "PHOTO_UPLOAD"};
    }
    else {
        general.childrent.photo = {label: "photo", value:null, dataType: "PHOTO",type:"DATA", action: "PHOTO_UPLOAD"};
    }

    general.childrent.latinname = {label: "latin_name", value:model.latinname, dataType: "STRING",type:"DATA"};
    general.childrent.name = {label: "name", value:model.name, dataType: "STRING",type:"DATA"};
    general.childrent.gender = {label: "gender", value:model.gender, dataType: "STRING",type:"DATA"};
    general.childrent.nickname = {label: "nick_name", value:model.nickname, dataType: "STRING",type:"DATA"};

    var contactNumber = {label:"contactNumber", type: "GROUP", dataType: "GROUP", childrent: {}};
    contactNumber.childrent.phoneNumber1 = {label: "primarynumber", value: model.phoneNumber1, dataType: "PHONENUMBER",type:"DATA"};
    contactNumber.childrent.phoneNumber2 = {label: "secondarynumber", value: model.phoneNumber2, dataType: "PHONENUMBER",type:"DATA"};
    contactNumber.childrent.phoneNumber3 = {label: "thridnumber", value: model.phoneNumber3, dataType: "PHONENUMBER",type:"DATA"};
    contactNumber.childrent.facebook =  {label: "facebook", value: model.facebook, dataType: "FACEBOOK",type:"DATA"};
    contactNumber.childrent.telegram = {label: "telegram", value: model.telegram, dataType: "TELEGRAM",type:"DATA"};

    var address = {label:"address", type: "GROUP", dataType: "GROUP", childrent: {}};
    if (model.address != null) {
address.childrent.houseno = {label: "houseno", value:model.address.houseNo, dataType: "STRING",type:"DATA"};
    address.childrent.floor = {label: "floor", value:model.address.floor, dataType: "STRING",type:"DATA"};
    address.childrent.roomnumber = {label: "roomnumber", value:model.address.roomNumber, dataType: "STRING",type:"DATA"};

    address.childrent.village = {label: "village", value:model.address.village, dataType: "STRING",type:"DATA"};
    address.childrent.commune = {label: "commune", value:model.address.commune, dataType: "STRING",type:"DATA"};
    address.childrent.district = {label: "district", value:model.address.district, dataType: "STRING",type:"DATA"};
    address.childrent.province = {label: "province", value:model.address.province, dataType: "STRING",type:"DATA"};
    }
    


    doc.contextMenu = 'model_view_action';  
    doc.title = model.name;

    doc.data = {};
    doc.data.root = {label:"root", type: "ROOT", dataType: "ROOT", childrent: {}};
    doc.data.root.childrent.general = general;
    doc.data.root.childrent.contactNumber = contactNumber;
    doc.data.root.childrent.address = address;
    return doc;
}

function createSaleDocumentSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.className = entity;
    doc.data = {};
    var deal = {label:"general", type: "GROUP",dataType: "GROUP"};    
    deal.childrent = {}; 

    var name = model.customer.firstname + " " +  model.customer.lastname;

    deal.childrent.number = {label: "number", value:model.number, dataType: "STRING",type:"DATA"};
    deal.childrent.status = {label: "status", value:model.status, dataType: "RESOURCE_STRING",type:"DATA"};
    deal.childrent.branch = {label: "branch", value:model.branch.name, dataType: "STRING",type:"DATA"};
    var date = new Date(model.date);
    var dateString = moment(date).format('DD-MM-yyyy');
    deal.childrent.date = {label: "date", value:dateString, dataType: "STRING",type:"DATA"};
    deal.childrent.price = {label: "price", value:model.price, dataType: "CURRENCY",type:"DATA", locale: "US"};
    deal.childrent.paymentType = {label: "paymentType", value:model.paymentType, dataType: "RESOURCE_STRING",type:"DATA"};


    if (model.paymentType == 'INSTALLMENT') {

        var institute = {label:"institute", type: "GROUP", id: model.customer._id,dataType: "GROUP"};
        institute.childrent = {};
        if (model.institute.logo) {
            institute.childrent.photo = {label: "logo", value:model.institute.logo.path, dataType: "PHOTO",type:"DATA", action: "PHOTO_VIEW"};
        }
        else {
            institute.childrent.photo = {label: "logo", value:null, dataType: "DOCUMENT",type:"DATA", action: "PHOTO_VIEW"};
        }    
        institute.childrent.name = {label: "name", value:model.institute.name, dataType: "STRING",type:"DATA", action: "PHOTO_VIEW"};
        deal.childrent.institute = institute;

    }
    
    var customer = {label:"customer", type: "GROUP", id: model.customer._id,dataType: "GROUP"};    
    customer.childrent = {};
    if (model.customer.photo) {
        customer.childrent.photo = {label: "photo", value:model.customer.photo.path, dataType: "PHOTO",type:"DATA", action: "PHOTO_VIEW"};
    }
    else {
        customer.childrent.photo = {label: "photo", value:null, dataType: "DOCUMENT",type:"DATA", action: "PHOTO_VIEW"};
    }
    customer.childrent.firstname = {label: "first_name", value:model.customer.firstname, dataType: "STRING",type:"DATA", visible: 8};
    customer.childrent.lastname = {label: "last_name", value:model.customer.lastname, dataType: "STRING",type:"DATA", visible: 8};
    customer.childrent.fullname = {label: "name", value:model.customer.lastname + ' ' + model.customer.firstname, dataType: "STRING",type:"DATA"};

    customer.childrent.phoneNumber1 = {label: "primarynumber", value: model.customer.phoneNumber1, dataType: "PHONENUMBER",type:"DATA"};
    customer.childrent.phoneNumber2 = {label: "secondarynumber", value: model.customer.phoneNumber2, dataType: "PHONENUMBER",type:"DATA"};
    customer.childrent.phoneNumber3 = {label: "thridnumber", value: model.customer.phoneNumber3, dataType: "PHONENUMBER",type:"DATA"};

    deal.childrent.customer = customer;

    deal.childrent.item = {label: "item", value:model.item, dataType: "STRING",type:"DATA"};

    var item = {label:"item", id: model.item._id, type: "GROUP",dataType: "GROUP"};    
    item.childrent = {};

    if (model.item.photo) {
        item.childrent.photo = {label: "photo", value:model.item.photo.path, dataType: "PHOTO",type:"DATA", action: "PHOTO_VIEW"};
    }
    else {
        item.childrent.photo = {label: "photo", value:null, dataType: "DOCUMENT",type:"DATA", action: "PHOTO_VIEW"};
    }

    item.childrent.name = {label: "name", value:model.item.name, dataType: "STRING",type:"DATA"};
    item.childrent.modelyear = {label: "model_year", value:model.item.year, dataType: "STRING",type:"DATA"};

    if (model.item.color) {
        item.childrent.color = {label: "color", value:model.item.color.name, dataType: "STRING",type:"DATA"};
    }
    else {
        item.childrent.color = {label: "color", value: null, dataType: "STRING",type:"DATA"};
    }

    item.childrent.vehicleChassisNo = {label: "vehicleChassisNo", value:model.vehicleChassisNo, dataType: "STRING",type:"DATA"};
    item.childrent.vehicleEngineNo = {label: "vehicleEngineNo", value:model.vehicleEngineNo, dataType: "STRING",type:"DATA"};

    deal.childrent.item = item;
    
    doc.contextMenu = 'model_view_action';  
    doc.title = model.name;
    doc.data.deal = deal;
    return doc;
}

function createLoanRequestDocumentSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.className = entity;
    doc.data = {};
    var deal = {label:"general", type: "GROUP",dataType: "GROUP"};    
    deal.childrent = {}; 

    var name = model.customer.firstname + " " +  model.customer.lastname;

    deal.childrent.number = {label: "number", value:model.number, dataType: "STRING",type:"DATA"};
    deal.childrent.status = {label: "status", value:model.status, dataType: "RESOURCE_STRING",type:"DATA"};
    deal.childrent.branch = {label: "branch", value:model.branch.name, dataType: "STRING",type:"DATA"};
    var date = new Date(model.date);
    var dateString = moment(date).format('DD-MM-yyyy');
    deal.childrent.date = {label: "date", value:dateString, dataType: "STRING",type:"DATA"};
    deal.childrent.price = {label: "price", value:model.price, dataType: "CURRENCY",type:"DATA", locale: "US"};
    deal.childrent.paymentType = {label: "paymentType", value:model.paymentType, dataType: "RESOURCE_STRING",type:"DATA"};


    if (model.paymentType == 'INSTALLMENT') {

        var institute = {label:"institute", type: "GROUP", id: model.customer._id,dataType: "GROUP"};
        institute.childrent = {};
        if (model.institute.logo) {
            institute.childrent.photo = {label: "logo", value:model.institute.logo.path, dataType: "PHOTO",type:"DATA", action: "PHOTO_VIEW"};
        }
        else {
            institute.childrent.photo = {label: "logo", value:null, dataType: "DOCUMENT",type:"DATA", action: "PHOTO_VIEW"};
        }    
        institute.childrent.name = {label: "name", value:model.institute.name, dataType: "STRING",type:"DATA", action: "PHOTO_VIEW"};
        deal.childrent.institute = institute;

    }
    
    var customer = {label:"customer", type: "GROUP", id: model.customer._id,dataType: "GROUP"};    
    customer.childrent = {};
    if (model.customer.photo) {
        customer.childrent.photo = {label: "photo", value:model.customer.photo.path, dataType: "PHOTO",type:"DATA", action: "PHOTO_VIEW"};
    }
    else {
        customer.childrent.photo = {label: "photo", value:null, dataType: "DOCUMENT",type:"DATA", action: "PHOTO_VIEW"};
    }
    customer.childrent.firstname = {label: "first_name", value:model.customer.firstname, dataType: "STRING",type:"DATA", visible: 8};
    customer.childrent.lastname = {label: "last_name", value:model.customer.lastname, dataType: "STRING",type:"DATA", visible: 8};
    customer.childrent.fullname = {label: "name", value:model.customer.lastname + ' ' + model.customer.firstname, dataType: "STRING",type:"DATA"};

    customer.childrent.phoneNumber1 = {label: "primarynumber", value: model.customer.phoneNumber1, dataType: "PHONENUMBER",type:"DATA"};
    customer.childrent.phoneNumber2 = {label: "secondarynumber", value: model.customer.phoneNumber2, dataType: "PHONENUMBER",type:"DATA"};
    customer.childrent.phoneNumber3 = {label: "thridnumber", value: model.customer.phoneNumber3, dataType: "PHONENUMBER",type:"DATA"};

    deal.childrent.customer = customer;

    deal.childrent.item = {label: "item", value:model.item, dataType: "STRING",type:"DATA"};

    var item = {label:"item", id: model.item._id, type: "GROUP",dataType: "GROUP"};    
    item.childrent = {};

    if (model.item.photo) {
        item.childrent.photo = {label: "photo", value:model.item.photo.path, dataType: "PHOTO",type:"DATA", action: "PHOTO_VIEW"};
    }
    else {
        item.childrent.photo = {label: "photo", value:null, dataType: "DOCUMENT",type:"DATA", action: "PHOTO_VIEW"};
    }

    item.childrent.name = {label: "name", value:model.item.name, dataType: "STRING",type:"DATA"};
    item.childrent.modelyear = {label: "model_year", value:model.item.year, dataType: "STRING",type:"DATA"};

    if (model.item.color) {
        item.childrent.color = {label: "color", value:model.item.color.name, dataType: "STRING",type:"DATA"};
    }
    else {
        item.childrent.color = {label: "color", value: null, dataType: "STRING",type:"DATA"};
    }

    item.childrent.vehicleChassisNo = {label: "vehicleChassisNo", value:model.vehicleChassisNo, dataType: "STRING",type:"DATA"};
    item.childrent.vehicleEngineNo = {label: "vehicleEngineNo", value:model.vehicleEngineNo, dataType: "STRING",type:"DATA"};

    deal.childrent.item = item;
    
    doc.contextMenu = 'model_view_action';  
    doc.title = model.name;
    doc.data.deal = deal;
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
    doc.data.icon = {label: "icon", value:model.icon, dataType: "STRING",type:"DATA"};
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
    console.log(model.customer);
    doc.data.name = {label: "name", value:model.name + ' - ' + model.number, dataType: "STRING",type:"DATA"};
    doc.data.phonenumber = {label: "phonenumber", value:model.customer.phoneNumber1, dataType: "STRING",type:"DATA"};
    doc.data.price = {label: "price", value:model.price, dataType: "CURRENCY",type:"DATA", locale: "US"};
    doc.data.description = {label: "description", value:model.description, dataType: "STRING",type:"DATA"};
    doc.data.paymentOption = {label: "paymentOption", value:model.paymentOption, dataType: "RESOURCE_STRING",type:"DATA"};
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
    doc.contextMenu = 'model_view_action';  
    doc.data.number = {label: "number", value:model.number, dataType: "STRING",type:"DATA"};
    return doc;
}

function populateQuery(entity, query) {
    if (entity == 'item') { 
        query.populate('category');
        query.populate('photo');
    }
    
    if (entity == 'contact') { 
        query.populate('photo');
    }

    if (entity == 'institute') { 
        query.populate('photo');
    }

    if (entity == 'vehicle') { 
        query.populate('photo');
        query.populate('category');
    }

    if (entity == 'sale') { 
        query.populate('branch');
        query.populate({path:'customer', populate: { path:  'photo', model: 'media' }});
        query.populate({path:'item', populate: { path:  'photo', model: 'media' }});
        query.populate({path:'item', populate: { path:  'color', model: 'color' }});                                                                                                                                                                  
        query.populate({path:'institute', populate: { path:  'logo', model: 'media' }});   
    }

    if (entity == 'loanrequest') { 
        query.populate('branch');
        query.populate({path:'customer', populate: { path:  'photo', model: 'media' }});
        query.populate({path:'s', populate: { path:  'photo', model: 'media' }});
        query.populate({path:'item', populate: { path:  'color', model: 'color' }});                                                                                                                                                                  
        query.populate({path:'institute', populate: { path:  'logo', model: 'media' }});
    }

    if (entity == 'agiletask') { 
        query.populate('stage');
        query.populate('board'); 
        query.populate('item'); 
        query.populate('customer'); 
    }
}