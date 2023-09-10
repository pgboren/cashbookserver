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


const Itemspecification = db.itemspecification;

module.exports = async function(app) {
    var institute = createInstitutes();
    var contacts = createContacts();
    const account = await Account.findOne({ 'number': 102 });
    const category = await Category.findOne({ 'key': 'MOTORBIKE' });
    const maker = await db.maker.findOne({ 'key': 'HONDA_NCX' });
    const type = await db.type.findOne({ 'key': 'OFF_ROAD' });
    const con = await db.condition.findOne({ 'key': 'NEW' });
    const model = await db.model.findOne({ 'key': 'SCOOPY_PRESTIGE' });
    const color = await db.color.findOne({ 'name': 'ខ្មៅ' });
    const vehicle = createVehicle('1234567890','Honda Dream 125CC 2023 - Black', account._id, category._id, category._id, maker._id, type._id, con._id, color._id, model._id);

    


    // barcode, name, acct, cat, maker, type, con, color, model

}

function createContacts() {

    var contactdata = [
        { 
            type: "CUS",
            name: "សុខ ជិន",
            latinname: "Sok Chheng",
            gender: "MALE",
            nickname: "សុខ",
            phoneNumber: "1234567890",
            address: "ផ្ទះលេខ២៧០ ២៧៤ ផ្លូវកម្ពុជាក្រោម សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ",
            facebook: "sokchheng",
            telegram: "https://t.me/borenpeng"
            },
            {
            type: "CUS",
            name: "ណីតា សុខ",
            latinname: "Nita Sok",
            gender: "FEMALE",
            nickname: "ណីតា",
            phoneNumber: "9876543210",
            address: "ផ្ទះលេខ២៧០ ២៧៤ ផ្លូវកម្ពុជាក្រោម សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ",
            facebook: "nitasok",
            telegram: "https://t.me/borenpeng"
            },
            {
            type: "CUS",
            name: "សុភាសិត ជុម",
            latinname: "Sopheak Chea",
            gender: "MALE",
            nickname: "សុភាសិត",
            phoneNumber: "5551234567",
            address: "ផ្ទះលេខ២៧០ ២៧៤ ផ្លូវកម្ពុជាក្រោម សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ",
            facebook: "https://t.me/borenpeng"
            },
            {
            type: "CUS",
            name: "ដាវី ម៉ៅ",
            latinname: "Davy Mao",
            gender: "FEMALE",
            nickname: "ដាវី ",
            phoneNumber: "9876543210",
            address: "ផ្ទះលេខ២៧០ ២៧៤ ផ្លូវកម្ពុជាក្រោម សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ",
            facebook: "davymao",
            telegram: "https://t.me/borenpeng"
            },
            {
            type: "CUS",
            name: "សុភាសិត កែវ",
            latinname: "Sophea Keo",
            gender: "MALE",
            nickname: "សុភាសិត ",
            phoneNumber: "555987654",
            address: "ផ្ទះលេខ២៧០ ២៧៤ ផ្លូវកម្ពុជាក្រោម សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ",
            facebook: "sopheakeo",
            telegram: "https://t.me/borenpeng"
            },
            {
            type: "CUS",
            name: "ជីអិល ហ្វាយនែន ភីអិលស៊ី",
            latinname: "GL Finance PLC",
            gender: null,
            phoneNumber: "0966060666",
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

async function createInvoice(item) {
    console.log('Creaet a test invoice');       
    const customer = await Contact.findOne({ name: 'ណីតា សុខ' });
    const datetime = new Date();
    var invoice = new Invoice();
    invoice.date = datetime.getTime();
    invoice.customer = customer._id;
    invoice.item = item._id;
    invoice.number = {};
    invoice.number.prefix = 'INV';
    invoice.paymentoption = 'CASH_PAY';
    invoice.qty = 1;
    invoice.price = 2350;
    invoice.save();
};

async function createLoanInvoice(index) {
    console.log('Creaet a test invoice');       
    const glFinance = await Institute.findOne({ name:'ជីអិលហ្វាយនែន ភីអិលស៊ី'});
    const customer = await Contact.findOne({ name:'សុភាសិត កែវ' });
    const item = await Item.findOne({ name:'Honda Dream 125CC 2023 - Black' });
    const datetime = new Date();
    const milliseconds = datetime.getTime();
    
    var invoice = new Invoice();
    invoice.date = milliseconds;
    invoice.number = {};
    invoice.number.prefix = 'INV';
    invoice.customer = customer._id;
    invoice.institute = glFinance._id;
    invoice.item = item._id;
    invoice.machineNumber = '123456789';
    invoice.chassisNumber = '123456789';
    invoice.plateNumber = '123456789';
    invoice.color = '6485b150a54e2d6efc2d8e90';
    invoice.year = 2023;
    invoice.condition = 'NEW';
    invoice.paymentoption = 'LOAN';
    invoice.qty = 1;
    invoice.price = 2350;
    invoice.save();
    
    var loan = new Loan();
    loan.date = datetime.getTime();
    loan.contractNumber = 'Testing Contact No' + index;
    loan.institute = glFinance._id;
    loan.customer = customer._id;
    loan.invoice = invoice;
    loan.amount = 2000;
    loan.status = 'NEW';
    loan.save();
    
};


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
    contact.nickname = data.nickname;
    contact.gender = data.gender;
    contact.phoneNumber = "070433123";
    contact.facebook = "087987987";
    contact.telegram = "070433123";
    contact.address = "ភូមិទឹកថ្លា សង្កាត់ក្រាំងពង្រ ខណ្ឌដង្កោរ រាជធានីភ្នំពេញ";
    contact.save();
    return contact;
}

function createVehicle(barcode, name, acct, cat, maker, type, con, color, model) {  
    console.log('Create new Vehicle: ' + name);
    var vehicle = new Vehicle();
    vehicle.barcode = barcode;
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
    vehicle.save();
    return vehicle;
    
}
