Category = require('../models/category');
Contact = require('../models/contact');
Branch = require('../models/branch');
Color = require('../models/color');
Item = require('../models/item');
CoponCode = require('../models/coponcode');
LoanInstitution = require('../models/institute');
Moment = require('moment');
moment = require('moment-timezone');

const util = require('util');
const fs = require("fs");
var path = require('path');
let mongoose = require('mongoose');
const config = require('config');
const { Console } = require('console');

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

    if (entity == 'deal') { 
        query.populate('branch');
        query.populate({path:'customer', populate: { path:  'photo', model: 'media' }});
        query.populate({path:'item', populate: { path:  'photo', model: 'media' }});
        query.populate({path:'item', populate: { path:  'color', model: 'color' }});                                                                                                                                                                  
        query.populate({path:'institute', populate: { path:  'logo', model: 'media' }});
        
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

    if (entity == 'category' || entity == 'branch') { 
        sort = {name: 'asc'};
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

exports.get =async function (req, res, next) {
    try {
        getViewModel(res,req.params.id, req.params.entity);        
    }
    catch (e) {
        next(e) 
    }
}



exports.getConponCode =async function (req, res, next) {
    try {
        var query = CoponCode.find({}).sort({entity: 'asc'});
        query.exec(function(err, coponcodes) {
            res.json(coponcodes);
        });
    }
    catch (e) {
        next(e) 
    }
}

function getViewModel(res, id, entity) {
   var query = getQuery(res, id, entity);
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

    if (entity == 'deal') { 
        doc = createDealDocumentSnapshot(entity, model);      
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
    general.childrent.color = {label: "color", value:model.color, dataType: "STRING",type:"DATA"};
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
    doc.contextMenu = 'model_item_view_action';  
    doc.title = model.name;

    doc.data[entity] = general;
    return doc;
}

function createBsDocSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.className = entity;
    doc.data = {};
    var branch = {label:"general", type: "GROUP", dataType: "GROUP"};    
    branch.childrent = {};
    branch.childrent.name = {label: "name", value:model.name, dataType: "STRING",type:"DATA"};
    if (model.enable) {
        branch.childrent.status = {label: "status", value: "សកម្ម", dataType: "STRING",type:"DATA"}
    }
    else {
        branch.childrent.status = {label: "status", value: "អសកម្ម", dataType: "BOOLEAN",type:"DATA"}
    }
    doc.contextMenu = 'model_view_action';  
    doc.title = model.name;
    doc.data[entity] = branch;
    return doc;
}

function createBsColorDocSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.className = entity;
    doc.data = {};
    var branch = {label:"general", type: "GROUP", dataType: "GROUP"};    
    branch.childrent = {};
    branch.childrent.name = {label: "name", value:model.name, dataType: "STRING",type:"DATA"};
    branch.childrent.code = {label: "code", value:model.code, dataType: "STRING",type:"DATA"};
    if (model.enable) {
        branch.childrent.status = {label: "status", value: "សកម្ម", dataType: "STRING",type:"DATA"}
    }
    else {
        branch.childrent.status = {label: "status", value: "អសកម្ម", dataType: "BOOLEAN",type:"DATA"}
    }
    doc.contextMenu = 'model_view_action';  
    doc.title = model.name;
    doc.data[entity] = branch;
    return doc;
}

function createInstituteDocSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.className = entity;
    doc.data = {};
    var institute = {label:"general", type: "GROUP", dataType: "GROUP"};    
    institute.childrent = {};
    if (model.photo) {
        institute.childrent.photo = {label: "logo", value:model.photo.path, dataType: "PHOTO",type:"DATA", action: "PHOTO_UPLOAD"};
    }
    else {
        institute.childrent.photo = {label: "logo", value:null, dataType: "DOCUMENT",type:"DATA", action: "PHOTO_UPLOAD"};
    }    


    institute.childrent.name = {label: "name", value:model.name, dataType: "STRING",type:"DATA"};
    if (model.enable) {
        institute.childrent.status = {label: "status", value: "សកម្ម", dataType: "STRING",type:"DATA"}
    }
    else {
        institute.childrent.status = {label: "status", value: "អសកម្ម", dataType: "BOOLEAN",type:"DATA"}
    }


    var address = {label:"address", type: "GROUP", dataType: "GROUP"};    
    address.childrent = {};

    
    address.childrent.houseNo = {label: "houseNo", value:model.address.houseNo, dataType: "STRING",type:"DATA"};
    address.childrent.floor = {label: "floor", value:model.address.floor, dataType: "STRING",type:"DATA"};
    address.childrent.roomNumber = {label: "roomNumber", value:model.address.roomNumber, dataType: "STRING",type:"DATA"};
    address.childrent.postalCode = {label: "postalCode", value:model.address.postalCode, dataType: "STRING",type:"DATA"};
    address.childrent.street = {label: "street", value:model.address.street, dataType: "STRING",type:"DATA"};
    address.childrent.village = {label: "village", value:model.address.village, dataType: "STRING",type:"DATA"};
    address.childrent.commune = {label: "commune", value:model.address.commune, dataType: "STRING",type:"DATA"};
    address.childrent.district = {label: "district", value:model.address.district, dataType: "STRING",type:"DATA"};
    address.childrent.province = {label: "village", value:model.address.province, dataType: "STRING",type:"DATA"};
    institute.childrent.address = address;
    doc.contextMenu = 'model_view_action';  
    doc.title = model.name;
    doc.data[entity] = institute;
    return doc;

}

function createCategoryDocumentSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.className = entity;
    doc.data = {};
    var category = {label:"general", type: "GROUP",dataType: "GROUP"};    
    category.childrent = {};

    category.childrent.name = {label: "name", value:model.name, dataType: "STRING",type:"DATA"};

    if (model.enable) {
        category.childrent.status = {label: "status", value: "សកម្ម", dataType: "STRING",type:"DATA"}
    }
    else {
        category.childrent.status = {label: "status", value: "អសកម្ម", dataType: "BOOLEAN",type:"DATA"}
    }

    
    doc.contextMenu = 'model_view_action';  
    doc.title = model.name;
    doc.data.category = category;
    return doc;
}

function createContactDocumentSnapshot(entity, model) {
    var doc = {};
    doc._id = model._id;    
    doc.className = entity;
    

    doc.data = {};

    var general = {label:"general", type: "GROUP", dataType: "GROUP", childrent: {}};
    if (model.photo) {
        general.childrent.photo = {label: "photo", value:model.photo.path, dataType: "PHOTO",type:"DATA", action: "PHOTO_UPLOAD"};
    }
    else {
        general.childrent.photo = {label: "photo", value:null, dataType: "DOCUMENT",type:"DATA", action: "PHOTO_UPLOAD"};
    }

    general.childrent.firstname = {label: "first_name", value:model.firstname, dataType: "STRING",type:"DATA"};
    general.childrent.lastname = {label: "last_name", value:model.lastname, dataType: "STRING",type:"DATA"};
    general.childrent.gender = {label: "gender", value:model.gender, dataType: "STRING",type:"DATA"};
    general.childrent.nickname = {label: "nick_name", value:model.nickname, dataType: "STRING",type:"DATA"};

    var contactNumber = {label:"contactNumber", type: "GROUP", dataType: "GROUP", childrent: {}};
    contactNumber.childrent.phoneNumber1 = {label: "primarynumber", value: model.phoneNumber1, dataType: "PHONENUMBER",type:"DATA"};
    contactNumber.childrent.phoneNumber2 = {label: "secondarynumber", value: model.phoneNumber2, dataType: "PHONENUMBER",type:"DATA"};
    contactNumber.childrent.phoneNumber3 = {label: "thridnumber", value: model.phoneNumber3, dataType: "PHONENUMBER",type:"DATA"};
    contactNumber.childrent.facebook =  {label: "facebook", value: model.facebook, dataType: "FACEBOOK",type:"DATA"};
    contactNumber.childrent.telegram = {label: "telegram", value: model.telegram, dataType: "TELEGRAM",type:"DATA"};

    var address = {label:"address", type: "GROUP", dataType: "GROUP", childrent: {}};
    address.childrent.village = {label: "village", value:model.address.village, dataType: "STRING",type:"DATA"};
    address.childrent.commune = {label: "commune", value:model.address.commune, dataType: "STRING",type:"DATA"};
    address.childrent.district = {label: "district", value:model.address.district, dataType: "STRING",type:"DATA"};
    address.childrent.province = {label: "province", value:model.address.province, dataType: "STRING",type:"DATA"};


    doc.contextMenu = 'model_item_view_action';  
    doc.title = model.firstname + " " + model.lastname;
    doc.data.general = general;
    doc.data.contactNumber = contactNumber;
    doc.data.address = address;

    return doc;
}

function createDealDocumentSnapshot(entity, model) {
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