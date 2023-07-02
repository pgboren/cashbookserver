
const db = require('../models');

const AccountType = db.accounttype;
const Account = db.account;
const Contact = db.contact;
const Item = db.item;
const Category = db.category;
const Invoice = db.invoice;
const Institute = db.institute;
const Loan = db.loan;

const Moment = require('moment');
const moment = require('moment-timezone');

const Enum = require('enum')
const util = require('util');
const fs = require("fs");
var path = require('path');
let mongoose = require('mongoose');
const config = require('config');
const { Console } = require('console');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const Jimp = require('jimp');

var viewType = new Enum({'LIST_VIEW': 'LIST_VIEW', 'LIST_ITEM_VIEW': 'LIST_ITEM_VIEW', 'DOC_VIEW': 'DOC_VIEW'});

exports.fbqr = async function (req, res) {
    const options = {
        color: {
        dark: '#1164b4',    
        light: '#FFFFFF',
        errorCorrectionLevel: 'H',
            type: 'image/jpeg',
            quality: 0.8,
            margin: 1    
        }
    };
    const fbData = 'fb://page/soleapmotor';
    // const tgData = `tg://resolve?domain=borenpeng`;
    // Generate the QR code
    QRCode.toFile('qrcode.jpg', fbData, options, function (err) {
        if (err) {
        console.error(err);
        return;
        }
    
        // Load the QR code image as a Jimp object
        Jimp.read('qrcode.jpg', function (err, qrCode) {
        if (err) {
            console.error(err);
            return;
        }
    
        // Load the logo image
        Jimp.read('public/imgs/fb.png', function (err, logo) {
            if (err) {
            console.error(err);
            return;
            }
    
            // Calculate the position to overlay the logo
            const xPos = (qrCode.bitmap.width - logo.bitmap.width) / 2;
            const yPos = (qrCode.bitmap.height - logo.bitmap.height) / 2;
    
            // Composite the logo onto the QR code
                // qrCode.composite(logo, xPos, yPos, {
                // mode: Jimp.BLEND_SOURCE_OVER,
                // opacitySource: 1,
                // opacityDest: 1
                // }); 
    
            // Save the final QR code with the logo overlay
            qrCode.write('fb_qr.jpg', function (err) {
            if (err) {
                console.error(err);
            } else {
                const qrCodeImage = fs.readFileSync('fb_qr.jpg');
                res.setHeader('Content-Type', 'image/png');
                res.setHeader('Content-Disposition', 'inline; filename=telegram_qrcode.png');
                res.send(qrCodeImage);
                console.log('QR code with logo overlay saved successfully.');
            }
            });
        });
        });
    });  
}

exports.generateInvoice = async function (req, res) {
   
    var query = Invoice.findOne({ _id: req.params.id });
    query.populate('customer').populate('institute').populate('color')
    .populate({
    path: 'item',
    populate: { path: 'category' }
    });

    await query.exec(function(err, invoice) {    
        createPdfFile(req, res, invoice);
    });
    
}

function createPdfFile(req, res, invoice) {
    const doc = new PDFDocument({size: 'A4', margins: { top: 10, left: 10, right: 10, bottom: 10 }});

            const fileName = invoice._id + '.pdf';

            doc.image('public/imgs/logo.png', 55, 30, {fit: [70, 70]})
            // doc.image('public/imgs/qr_fb.jpg', 50, 120, {fit: [50, 50]})
            // doc.image('public/imgs/qr_tg.jpg', 100, 120, {fit: [50, 50]})

            doc.fillColor('#851718');
            doc.font('public/fonts/KhmerOSniroth.ttf').fontSize(12).text('ទិញ-លក់ ម៉ូតូ កង់បី គ្រប់ប្រភេទ',20, 90);
            doc.moveDown(0.03);
            doc.text('មានសាវាកម្មបង់រំលស់ ១០០%',23);
            doc.font('public/fonts/khmerosmoul.ttf').fontSize(18).text('សុលាភ លក់ម៉ូតូបង់រំលស់',200, 30);
            doc.moveDown(0.03);
            doc.font('public/fonts/arialbd.ttf').fontSize(15).text('SOLEAP MOTORSHOP');
            doc.moveDown(0.2);
    
            doc.fillColor('black')
            doc.font('public/fonts/khmerossystem.ttf').fontSize(9).text('អាស័យដ្ឋាន៖ ភូមិទឹកថ្លា សង្កាត់ក្រាំងពង្រ ខណ្ឌដង្កោ រាជធានីភ្នំពេញ');
            doc.moveDown(0.1);
            doc.font('public/fonts/arial.ttf').fontSize(8).text('Address: Tuek Thla Village, Sangkat Krang Pongro, Khan Dangkao, City Phnom Penh');
            doc.moveDown(0.2);
            doc.font('public/fonts/khmerossystem.ttf').fontSize(9).text('ទូរស័ព្ទលេខ៖ ០៧៧ ៤១ ៤៣ ៨៩, ០៩៦ ៩៧ ៩៨ ៩២៨, ០៨៨ ៩៧ ៩៨ ៩២៨ ');
            doc.moveDown(0.1);
            doc.font('public/fonts/arial.ttf').fontSize(8).text('Telephone: 077 41 43 89, 096 97 98 928, 088 97 98 928');
            doc.moveDown(0.1);
            doc.font('public/fonts/khmerossystem.ttf').fontSize(8).text('Telegram: 096 97 98 928 Facebook: សុលាភ លក់ម៉ូតូបង់រំលស់');
            doc.moveDown(5);
            doc.text('', 0, 180);
            doc.font('public/fonts/khmerosmoul.ttf').fontSize(18).text('វិក្កយបត្រ', {align: 'center'});
            doc.moveDown(0.1);
            doc.font('public/fonts/arial.ttf').fontSize(18).text('INVOICE', {align: 'center'});
            doc.moveDown(0.3);
            doc.font('public/fonts/khmerossystem.ttf').fontSize(9);
    
            doc.text('អតិថិជន / Customer             :',20, 250);
            doc.moveUp();
            doc.text(invoice.contact.name, 150);
            doc.moveDown(0.2);    
            
            doc.text('អាស័យដ្ឋាន /  Address         :', 20);
            doc.moveUp();
            doc.text(invoice.contact.address, 150, 270, { width: 190, align: 'justify'});
            doc.moveDown(0.2);
            doc.text('លេខសំគាល់ /  Code            :', 20);

            doc.text(invoice.contact.type + '-' + invoice.contact.number, 150, 305, { width: 190});
            doc.moveDown(0.2);
            doc.text('ទូរស័ព្ទលេខ / Telephone       :', 20);
            doc.text(invoice.contact.phoneNumber, 150, 325, { width: 190});
        
            doc.text('លេខរៀងវិក្កបត្រ / Invoice No : ',350 ,250 );
            doc.text( invoice.number.toString().padStart(6, '0'),475 ,250);
            doc.moveDown(0.2);

            var date = new Date(invoice.date);
        
            doc.text('កាលបរិច្ឆេទ / Date                :', 350);
            doc.moveUp();
            doc.text(moment(date).format('DD/MM/yyyy'),475);
            doc.text('', 0, 360);
            const startX = 20;
            const startY = 360;
            const cellWidth = 50;
            const cellHeight = 30;
            doc.lineWidth(0.1);
            var x = startX + 0 * cellWidth;
            var y = startY;
            
            doc.rect(x, y, 30, 40).fillAndStroke('#ffffff', '#000000');
            doc.font('public/fonts/KhmerOSNew-Bold.ttf').fontSize(10);
            doc.fillColor('#000000').text("ល.រ", x + 5, y + 5, { width: 20, align: 'center'});
            doc.font('Helvetica-Bold').fontSize(10);
            doc.fillColor('#000000').text("No", x + 5, y + 20, { width: 20, align: 'center'});
        
            x = x + 30;
            doc.rect(x, y, 225, 40).fillAndStroke('#ffffff', '#000000');
            doc.font('public/fonts/KhmerOSNew-Bold.ttf').fontSize(10);
            doc.fillColor('#000000').text("បរិយាយមុខទំនិញ", x + 5, y + 5, { width: 225, align: 'center'});
            doc.font('Helvetica-Bold').fontSize(10);
            doc.fillColor('#000000').text("Description", x + 5, y + 20, { width: 225, align: 'center'});
        
            x = x + 225;
            doc.rect(x, y, 60, 40).fillAndStroke('#ffffff', '#000000');
            doc.font('public/fonts/KhmerOSNew-Bold.ttf').fontSize(10);
            doc.fillColor('#000000').text("បរិមាណ", x + 5, y + 5, { width: 50, align: 'center'});
            doc.font('Helvetica-Bold').fontSize(10);
            doc.fillColor('#000000').text("Quantity", x + 5, y + 20, { width: 50, align: 'center'});
        
            x = x + 60;
            doc.rect(x, y, 120, 40).fillAndStroke('#ffffff', '#000000');
            doc.font('public/fonts/KhmerOSNew-Bold.ttf').fontSize(10);
            doc.fillColor('#000000').text("តំលៃឯកតា", x + 5, y + 5, { width: 110, align: 'center'});
            doc.font('Helvetica-Bold').fontSize(10);
            doc.fillColor('#000000').text("Unit Price", x + 5, y + 20, { width: 110, align: 'center'});
        
            x = x + 120;
            doc.rect(x, y, 120, 40).fillAndStroke('#ffffff', '#000000');
            doc.font('public/fonts/KhmerOSNew-Bold.ttf').fontSize(10);
            doc.fillColor('#000000').text("តំលៃសរុប", x + 5, y + 5, { width: 110, align: 'center'});
            doc.font('Helvetica-Bold').fontSize(10);
            doc.fillColor('#000000').text("Amount", x + 5, y + 20, { width: 110, align: 'center'});

            x = startX;
            y = y + 40;
            doc.rect(x, y, 30, 200).fillAndStroke('#ffffff', '#000000');
            doc.fillColor('#000000').text(1, x + 5, y + 5, { width: 20, align: 'center'});

            x = x + 30;
            doc.font('public/fonts/khmerossystem.ttf').fontSize(10);
            doc.rect(x, y, 225, 200).fillAndStroke('#ffffff', '#000000');
            doc.fillColor('#000000').text(invoice.item.category.name, x + 5, y + 5, { width: 225});
            doc.fillColor('#000000').text(invoice.item.name + " - ព៌ណ" + invoice.color.name +  " - ឆ្នាំ" + invoice.year, x + 5, y + 20, { width: 225});
            doc.fillColor('#000000').text("លេខតួរ: " + invoice.chassisNumber, x + 5, y + 35, { width: 225});
            doc.fillColor('#000000').text("លេខម៉ាស៊ីន: " + invoice.machineNumber, x + 5, y + 50, { width: 225});

            x = x + 225;
            doc.rect(x, y, 60, 200).fillAndStroke('#ffffff', '#000000');
            doc.fillColor('#000000').text(invoice.qty, x + 5, y + 5, { width: 50, align: 'center'});

            const priceFormatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            x = x + 60;
            doc.rect(x, y, 120, 200).fillAndStroke('#ffffff', '#000000');
            doc.fillColor('#000000').text(priceFormatter.format(invoice.price), x + 5, y + 5, { width: 110, align: 'right'});
            
            x = x + 120;
            doc.rect(x, y, 120, 200).fillAndStroke('#ffffff', '#000000');
            doc.fillColor('#000000').text(priceFormatter.format(invoice.price), x + 5, y + 5, { width: 110, align: 'right'});

            y = y + 200;
            x = startX + 315;
            doc.rect(x, y, 120, 40).fillAndStroke('#ffffff', '#000000');
            doc.font('public/fonts/KhmerOSNew-Bold.ttf').fontSize(11);
            doc.fillColor('#000000').text("សរុប", x + 5, y + 5, { width: 120});
            doc.font('Helvetica-Bold').fontSize(11);
            doc.fillColor('#000000').text("Grand Total", x + 5, y + 25, { width: 120});

            x = x + 120;

            const totalCurrencyFormatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                currencyDisplay: 'code',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            doc.rect(x, y, 120, 40).fillAndStroke('#ffffff', '#000000');
            doc.font('Helvetica-Bold').fontSize(11);
            doc.fillColor('#000000').text(totalCurrencyFormatter.format(invoice.price), x + 5, y + 15, { width: 110, align: 'right'});

            y = 750;
            x = 375;
            doc.font('public/fonts/KhmerOSNew-Bold.ttf').fontSize(12);
            doc.fillColor('#000000').text("ហត្តលេខា និងឈ្មោះអ្នកលក់", x + 5, y + 5, { width: 200, align:'center'});
            doc.font('Helvetica-Bold').fontSize(10);
            doc.fillColor('#000000').text("Seller's Signature & Name", x + 5, y + 25, { width: 200, align:'center'});

            y = 750;
            x = 20;
            doc.font('public/fonts/KhmerOSNew-Bold.ttf').fontSize(12);
            doc.fillColor('#000000').text("ហត្តលេខា និងឈ្មោះអ្នកទិញ", x + 5, y + 5, { width: 200, align:'center'});
            doc.font('Helvetica-Bold').fontSize(10);
            doc.fillColor('#000000').text("Customer's Signature & Name", x + 5, y + 25, { width: 200, align:'center'});

            y = 790;
            x = 20;
            doc.font('public/fonts/KhmerOSNew-Regular.ttf').fontSize(8);
            doc.fillColor('#000000').text("សម្គាល់៖ ច្បាប់ដើមសម្រាប់អ្នកទិញ ច្បាប់ចម្លងសម្រាប់អ្នកលក់", x + 5, y + 5, { width: 300, align:'left'});
            doc.font('Helvetica').fontSize(8);
            doc.fillColor('#000000').text("Note: Original Invoice for customer, copied invoice for seller", x + 5, y + 20, { width: 300, align:'left'});

            y = startY + 110;

            doc.lineCap('butt').moveTo(20, y).dash(2, {space: 3}).lineTo(575, y).stroke();

             res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename=${fileName}`);

            doc.pipe(res);
            doc.end();
            console.log('pdf created');
}

exports.getViewData = async function (req, res) {
    try {
        var response = null;
        if (req.params.viewName == viewType.LIST_VIEW.value) {
            await getListViewData(req, res);
        }

        if (req.params.viewName == viewType.LIST_ITEM_VIEW.value) {
            await getListItemViewData(req, res);
        }

        if (req.params.viewName == viewType.DOC_VIEW.value) {
            await getDocViewData(req, res);
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server error' });
    }
};

exports.getListItemViewData = async function (req, res) {
    try {
        getListItemViewData(req, res);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server error' });
    }
};


async function getDocViewData(req, res) {
    const docName = req.params.docname;
    const docModelClass = mongoose.model(docName);
    var query = docModelClass.findOne({ _id: req.query.id });
    query.populate(getPopulateField(docName))
    query.exec(function(err, model) {      
        if (!model) {
            res.status(404).json({ message: `${req.params.docname} with id ${req.params.id} not found` });
        }
        else {
            var data = createDocViewData(req.params.docname, model);
            res.status(200).json(data);
        }
    });
}

async function getListItemViewData(req, res) {
    const docName = req.params.docname;
    const docModelClass = mongoose.model(docName);
    var query = docModelClass.findOne({ _id: req.query.id });
    query.populate(getPopulateField(docName))
    query.exec(function(err, model) {      
        if (!model) {
            res.status(404).json({ message: `${req.params.docname} with id ${req.params.id} not found` });
        }
        else {
            var data = createListViewData(req.params.docname, model);
            res.status(200).json(data);
        }
    });
}

async function getListViewData(req, res) {
    const limit = parseInt(req.query.limit) || 10;
        const { select, orders, filter } = req.body;
        const docModel = mongoose.model(req.params.docname);
        const options = {
            page: parseInt(req.query.page) || 1,
            populate: getPopulateField(req.params.docname),
            limit: limit,
            sort: orders
        };
        const result = await docModel.paginate(filter, options);
        const docs = [];
        result.docs.forEach(model => {
            var doc = createListViewData(req.params.docname, model);
           docs.push(doc);
        });

        res.status(200).json({
            data: docs,
            currentPage: result.page,
            totalPages: result.totalPages,
            totalItems: result.totalDocs,
        });
}

function getPopulateField(docName) {
    if (docName == 'account') {
        return ["type"];
    }

    if (docName == 'item') {
       return ["account", "category", "specifications"];
    }

    if (docName == 'invoice') {
        return ["customer", "institute", "item", "color"];
    }

    if (docName == 'loan') {
        return ["invoice", "institute", "customer", "color"];
    }

}

function createDocViewData(docName, doc) {
    var data = null;

    if (docName == 'item') {
        data = createItemViewData(docName, doc);
    }
    
    return data;
}

function createItemViewData(docName, doc) {
    var viewDocSnapshot = {};
    viewDocSnapshot._id = doc.id;
    viewDocSnapshot.docClassName = docName;
    var general = {label:"general", dataType: "GROUP", type: "GROUP", editTable: false, viewType: null};     
    general.childrent  = {
        name: { label: "name", value:doc.name, dataType: "STRING",type:"DATA", viewType: 'TEXT'},
        category: { label: "category", value:doc.category.name, dataType: "STRING",type:"DATA", viewType: 'TEXT'},
        account: { label: "account", value:doc.account.number + ' : ' + doc.account.name , dataType: "STRING", type:"DATA", viewType: 'TEXT'},
        price:  {label: "price", value:doc.price, dataType: "CURRENCY",type:"DATA", locale: "US", viewType: 'CURRENCY'},
        cost:  {label: "cost", value:doc.cost, dataType: "CURRENCY",type:"DATA", locale: "US", viewType: 'CURRENCY'},
        description:  {label: "description", value:doc.description, dataType: "STRING",type:"DATA", viewType: 'TEXT'}, 
        isInventory:  {label: "isInventory", value:doc.isInventory , dataType: "BOOLEAN",type:"DATA", viewType: 'BOOLEAN'},
        account:  {label: "account", value:doc.account._id, dataType: "STRING",type:"DATA", viewType: 'TEXT'},
        enable:  {label: "enable", value:doc.enable, dataType: "BOOLEAN",type:"DATA", viewType: 'BOOLEAN'},
    };

    var specificationGroup = {label:"specification", dataType: "GROUP", type: "GROUP", editTable: true, viewType: 'DROP_DROP_LIST_BOTTOM_SHEET', docName: 'item', docId: doc._id }; 
    specificationGroup.childrent = {};
    doc.specifications.forEach(function(specification) {
        specificationGroup.childrent[specification.name] = {label: specification.name, value:specification.value, dataType: "STRING",type:"DATA"} ;
    });

    viewDocSnapshot.data = {general: general, specifications : specificationGroup };

    return viewDocSnapshot;
}


function createListViewData(docName, doc) {
    var data = null;

    if (docName == 'contact') {
        data = createContactListViewData(docName, doc);
    }

    if (docName == 'item') {
        data = createItemListViewData(docName, doc);
    }

    if (docName == 'itemspecification') {
        
        data = createItemSpecificationListViewData(docName, doc);
    }
    
    if (docName == 'account') {
        data = createAccountViewData(docName, doc);
    }

    if (docName == 'accounttype') {
        data = createAccountTypeViewData(docName, doc);
    }

    if (docName == 'category') {
        data = createNameViewData(docName, doc);
    }

    if (docName == 'institute') {
        data = createInstituteViewData(docName, doc);
    }

    if (docName == 'invoice') {
        data = createInvoiceViewData(docName, doc);
    }

    if (docName == 'color') {
        data = createNameViewData(docName, doc);
    }

    if (docName == 'loan') {
        data = createLoanViewData(docName, doc);
    }
    return data;
}

function createLoanViewData(docName, doc) {
    var viewDocSnapshot = {};
    viewDocSnapshot._id = doc.id;
    viewDocSnapshot.docClassName = docName;
    var date = new Date(doc.date);
    var dateString = moment(date).format('DD/MM/yyyy');
    viewDocSnapshot.data  = {
        contractNumber: { label: "contractNumber", value:doc.contractNumber, dataType: "STRING", type:"DATA"},
        date: {label: "date", value:dateString, dataType: "STRING",type:"DATA"},
        institute : {label: "institute", value:doc.institute.name, dataType: "STRING",type:"DATA"},
        customer : {label: "customer", value:doc.customer.name, dataType: "STRING",type:"DATA"},
        invoice : {label: "invoice", value:doc.invoice.name, dataType: "STRING",type:"DATA"},
        item: {label: "item", value:doc.item.name, dataType: "STRING",type:"DATA"},
        color: {label: "color", value:doc.color.name, dataType: "STRING",type:"DATA"},
        year: {label: "year", value:doc.year, dataType: "STRING",type:"DATA"},
        condition: {label: "condition", value:doc.condition, dataType: "RESOURCE_STRING",type:"DATA"},
        paymentoption: {label: "paymentoption", value:doc.paymentoption, dataType: "RESOURCE_STRING",type:"DATA"},
        price:  {label: "price", value:doc.price, dataType: "CURRENCY",type:"DATA", locale: "US"}
    };
    return viewDocSnapshot;
}


function createInvoiceViewData(docName, doc) {
    var viewDocSnapshot = {};
    viewDocSnapshot._id = doc.id;
    viewDocSnapshot.docClassName = docName;
    var date = new Date(doc.date);
    var dateString = moment(date).format('DD/MM/yyyy');
    viewDocSnapshot.data  = {
        number: { label: "number", value: doc.number.prefix + '-' + doc.number.count , dataType: "STRING", type:"DATA", format: "%06d"},
        date: {label: "date", value:dateString, dataType: "STRING",type:"DATA"},
        customer : {label: "contact", value:doc.customer.name, dataType: "STRING",type:"DATA"},
        institute : {label: "institute", value:doc.institute ? doc.institute.name : null, dataType: "STRING",type:"DATA"},
        item: {label: "item", value:doc.item.name, dataType: "STRING",type:"DATA"},
        color: {label: "color", value:doc.color.name, dataType: "STRING",type:"DATA"},
        year: {label: "year", value:doc.year, dataType: "STRING",type:"DATA"},
        condition: {label: "condition", value:doc.condition, dataType: "RESOURCE_STRING",type:"DATA"},
        paymentoption: {label: "paymentoption", value:doc.paymentoption, dataType: "RESOURCE_STRING",type:"DATA"},
        price:  {label: "price", value:doc.price, dataType: "CURRENCY",type:"DATA", locale: "US"}
    };

    return viewDocSnapshot;
}

function createAccountViewData(docName, doc) {
    var viewDocSnapshot = {};
    viewDocSnapshot._id = doc.id;
    viewDocSnapshot.docClassName = docName;
    viewDocSnapshot.data  = {
        name: { label: "name", value:doc.name, dataType: "STRING",type:"DATA"},
        type: { label: "type", value:doc.type.name, dataType: "STRING",type:"DATA"},
        amount:  {label: "amount", value:0, dataType: "CURRENCY",type:"DATA", locale: "US"}
    };
    return viewDocSnapshot;
}

function createItemSpecificationListViewData(docName,doc) {
    var viewDocSnapshot = {};
    viewDocSnapshot._id = doc.id;
    viewDocSnapshot.docClassName = docName;
    var general = {label:"general", dataType: "GROUP", type: "GROUP"};    
    viewDocSnapshot.data  = {
        name: { label: "name", value:doc.name, dataType: "STRING",type:"DATA"},
        value: { label: "value", value:doc.value, dataType: "STRING",type:"DATA"},
        item: { label: "item", value:doc.item, dataType: "STRING",type:"DATA"},
        order: { label: "order", value:doc.order, dataType: "NUMBER",type:"DATA"},
    };
    return viewDocSnapshot;
}

function createItemListViewData(docName, doc) {
    var viewDocSnapshot = {};
    viewDocSnapshot._id = doc.id;
    viewDocSnapshot.docClassName = docName;
    var general = {label:"general", dataType: "GROUP", type: "GROUP"};    
    viewDocSnapshot.data  = {
        name: { label: "name", value:doc.name, dataType: "STRING",type:"DATA"},
        category: { label: "category", value:doc.category.name, dataType: "STRING",type:"DATA"},
        account: { label: "account", value:doc.account.number + ' : ' + doc.account.name , dataType: "STRING",type:"DATA"},
        price:  {label: "price", value:doc.price, dataType: "CURRENCY",type:"DATA", locale: "US"},
    };
    return viewDocSnapshot;
}

function createContactListViewData(docName, doc) {
    var viewDocSnapshot = {};
    viewDocSnapshot._id = doc.id;
    viewDocSnapshot.docClassName = docName;
    viewDocSnapshot.data  = {
        code: { label: "code", value:doc.type + '-' + doc.number, dataType: "STRING",type:"DATA"},
        name: { label: "name", value:doc.name, dataType: "STRING",type:"DATA"},
        latinname: { label: "latinname", value:doc.latinname, dataType: "STRING",type:"DATA"},
        gender: { label: "gender", value:doc.gender, dataType: "RESOURCE_STRING",type:"DATA"},
        nickname: { label: "nickname", value:doc.nickname, dataType: "STRING",type:"DATA"},
        phoneNumber: { label: "phoneNumber", value:doc.phoneNumber, dataType: "STRING",type:"DATA"},
        facebook: { label: "facebook", value:doc.facebook, dataType: "STRING",type:"DATA"},
        telegram: { label: "telegram", value:doc.telegram, dataType: "STRING",type:"DATA"},
        address: { label: "address", value:doc.address, dataType: "STRING",type:"DATA"}    
    };
    return viewDocSnapshot;
}

function createAccountTypeViewData(docName, doc) {
    var viewDocSnapshot = {};
    viewDocSnapshot._id = doc._id;
    viewDocSnapshot.docClassName = 'accounttype';
    viewDocSnapshot.data  = {
        name:{label: "name", value:doc.name, dataType: "STRING",type:"DATA"}
    };
    return viewDocSnapshot;
}

function createNameViewData(docName, doc) {
    var viewDocSnapshot = {};
    viewDocSnapshot._id = doc._id;
    viewDocSnapshot.docClassName = docName;
    viewDocSnapshot.data  = {
        name:{label: "name", value:doc.name, dataType: "STRING",type:"DATA"}
    };
    return viewDocSnapshot;
}

function createInstituteViewData(docName, doc) {
    var viewDocSnapshot = {};
    viewDocSnapshot._id = doc._id;
    viewDocSnapshot.docClassName = docName;
    viewDocSnapshot.data  = {
        name:{label: "name", value:doc.name, dataType: "STRING",type:"DATA"},
        address:{label: "address", value:doc.address, dataType: "STRING",type:"DATA"}
    };
    return viewDocSnapshot;
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
