const db = require('../models');
const mongoose = require('mongoose');
const util = require('util');

const Contact = db.contact;
const Item = db.item;
const Category = db.category;
const Account = db.account;
const Institute = db.institute;
const Invoice = db.invoice;
const Loan = db.loan;
const Vehicle = db.vehicle;

module.exports = async function(app) {
    
    var contacts = createContacts();

    // var institute = createInstitutes();
    // const account = await Account.findOne({ 'number': 102 }).exec();
    // const category = await Category.findOne({ 'key': 'MOTORBIKE' }).exec();
    // const maker = await db.maker.findOne({ 'key': 'HONDA_NCX' }).exec();
    // const type = await db.type.findOne({ 'key': 'OFF_ROAD' }).exec();
    // const newVehicle = await db.condition.findOne({ 'key': 'NEW' }).exec();
    // const secondhand = await db.condition.findOne({ 'key': 'SECONDHAND' }).exec();
    // const model = await  db.model.findOne({ 'key': 'SCOOPY_PRESTIGE' }).exec();
    // const color = await db.color.findOne({ 'name': 'ខ្មៅ' }).exec();

    // const vehicle = createVehicle('Honda Dream 125CC - 2023 - Black', account._id, category._id, maker._id, type._id, newVehicle._id, color._id, model._id, null);
    // const secondHandVehicle = createVehicle('Honda Dream 125CC - 2023 - Black', account._id, category._id, maker._id, type._id, secondhand._id, color._id, model._id, 'AR-2052');


    // const datetime = new Date();
    // var cashsaleInvoice = new Invoice();
    // cashsaleInvoice.date = datetime.getTime();
    // cashsaleInvoice.customer = contacts[0]._id;
    // cashsaleInvoice.vehicle = vehicle._id;
    // cashsaleInvoice.number = {};
    // cashsaleInvoice.number.prefix = 'INV';
    // cashsaleInvoice.paymentoption = 'CASH_PAY';
    // cashsaleInvoice.qty = 1;
    // cashsaleInvoice.price = 2350;
    // cashsaleInvoice.save();

    // var loanSaleInvoice = new Invoice();
    // loanSaleInvoice.date = datetime.getTime();
    // loanSaleInvoice.customer = contacts[0]._id;
    // loanSaleInvoice.vehicle = secondHandVehicle._id;
    // loanSaleInvoice.institute = institute._id;
    // loanSaleInvoice.number = {};
    // loanSaleInvoice.number.prefix = 'INV';
    // loanSaleInvoice.paymentoption = 'LOAN';
    // loanSaleInvoice.qty = 1;
    // loanSaleInvoice.price = 2750;
    // loanSaleInvoice.save();   
}

function createContacts() {

    var contactdata = [
        { 
            type: "CUS",
            name: "សុខ ជិន",
            latinname: "Sok Chheng",
            gender: "MALE",
            primaryNumber: "1234567890",
            address: "ផ្ទះលេខ២៧០ ២៧៤ ផ្លូវកម្ពុជាក្រោម សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ",
            facebook: "sokchheng",
            telegram: "https://t.me/borenpeng"
            },
            {
            type: "CUS",
            name: "ណីតា សុខ",
            latinname: "Nita Sok",
            gender: "FEMALE",
            primaryNumber: "9876543210",
            address: "ផ្ទះលេខ២៧០ ២៧៤ ផ្លូវកម្ពុជាក្រោម សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ",
            facebook: "nitasok",
            telegram: "https://t.me/borenpeng"
            },
            {
            type: "CUS",
            name: "សុភាសិត ជុម",
            latinname: "Sopheak Chea",
            gender: "MALE",
            primaryNumber: "5551234567",
            address: "ផ្ទះលេខ២៧០ ២៧៤ ផ្លូវកម្ពុជាក្រោម សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ",
            facebook: "https://t.me/borenpeng"
            },
            {
            type: "CUS",
            name: "ដាវី ម៉ៅ",
            latinname: "Davy Mao",
            gender: "FEMALE",
            primaryNumber: "9876543210",
            address: "ផ្ទះលេខ២៧០ ២៧៤ ផ្លូវកម្ពុជាក្រោម សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ",
            facebook: "davymao",
            telegram: "https://t.me/borenpeng"
            },
            {
            type: "CUS",
            name: "សុភាសិត កែវ",
            latinname: "Sophea Keo",
            gender: "MALE",
            primaryNumber: "555987654",
            address: "ផ្ទះលេខ២៧០ ២៧៤ ផ្លូវកម្ពុជាក្រោម សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ",
            facebook: "sopheakeo",
            telegram: "https://t.me/borenpeng"
            },
            {
            type: "CUS",
            name: "ជីអិល ហ្វាយនែន ភីអិលស៊ី",
            latinname: "GL Finance PLC",
            gender: null,
            primaryNumber: "0966060666",
            address: "ផ្ទះលេខ២៧០ ២៧៤ ផ្លូវកម្ពុជាក្រោម សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ",
            facebook: "glfinancecambodia",
            telegram: "https://t.me/borenpeng"
            }                 
        ];

    
        var contacts = [];
        for (let i = 0; i < contactdata.length; i++) {
            var contact = createContact(contactdata[i], i +1);
            contacts.push(contact);
        }
        return contacts;
            
}

function createInstitutes() {
    return createInstitue('GLF', 'ជីអិលហ្វាយនែន ភីអិលស៊ី', 'GL FINANCE PLC', '070433123', 'ផ្ទះលេខ ២៧០,២៧៤ ផ្លូវកម្ពុជាក្រោម ភូមិ ៤ សង្កាត់ មិត្តភាព ខណ្ឌ ៧មករា រាជធានីភ្នំពេញ');
}

function createInstitue(code, name, latinname, phoneNumber, address) {
    console.log(util.format('- Create institute %s-%s-%s-%s-%s',code, name,latinname, phoneNumber, address));
    var institute = new Institute();
    institute.code = code;
    institute.name = name;
    institute.latinname = latinname;
    institute.phoneNumber = phoneNumber;
    institute.address = address;
    institute.enable = true;
    institute.save();
    return institute;
};

function createContact(data, index) {

    console.log(util.format('- Create new Contact: %s',data.name));

    var contact = new Contact();
    contact.name = data.name;
    contact.type = data.type;
    contact.latinname = data.latinname;
    contact.gender = data.gender;
    contact.primaryNumber = "070433123";
    contact.facebook = "087987987";
    contact.telegram = "070433123";
    contact.address = "ភូមិទឹកថ្លា សង្កាត់ក្រាំងពង្រ ខណ្ឌដង្កោរ រាជធានីភ្នំពេញ";
    contact.save();
    console.log(contact);
    return contact;
}

function createVehicle(name, acct, cat, maker, type, con, color, model, platenumber) {  
    console.log('Create new Vehicle: ' + name);
    var vehicle = new Vehicle();
    vehicle.name = name;
    vehicle.account = acct;
    vehicle.price = 2050;
    vehicle.cost = 2000;
    vehicle.description = 'item testing description';
    vehicle.category = cat;
    vehicle.maker = maker;
    vehicle.type = type;
    
    vehicle.condition = con;
    vehicle.color = color;
    vehicle.model = model;

    vehicle.chassisno = 'FB110M0007729';
    vehicle.engineno = 'FB110M0007729'
    vehicle.horsepower = '150cc';
    vehicle.year = 2018;
    vehicle.enable = true;
    vehicle.platenumber = platenumber;
    vehicle.save();

    return vehicle;
    
}
