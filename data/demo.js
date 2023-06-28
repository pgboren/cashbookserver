const db = require('../models');
let mongoose = require('mongoose');

const Contact = db.contact;
const Item = db.item;
const Category = db.category;
const Account = db.account;
const Institute = db.institute;
const Invoice = db.invoice;
const Loan = db.loan;
const Itemspecification = db.itemspecification;

module.exports = function(app) {
    // createContacts();
    createItems();
    // Invoice.estimatedDocumentCount({})
    // .then((count) => {

    //     if (count === 0) {
    //         for (let i = 0; i < 10; i++) {
    //             createLoanInvoice(i);
    //         }
        
    //         for (let i = 0; i < 10; i++) {
    //             createInvoice();
    //         }
    //     }
       
    // })
    // .catch((err) => {
    //     console.log(err);
    // });
}

function createContacts() {

    Contact.estimatedDocumentCount({})
    .then((count) => {
        if (count === 0) {
            console.log('Create Demo Contact data');

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
                    type: "IF",
                    name: "ជីអិល ហ្វាយនែន ភីអិលស៊ី",
                    latinname: "GL Finance PLC",
                    gender: null,
                    phoneNumber: "0966060666",
                    address: "ផ្ទះលេខ២៧០ ២៧៤ ផ្លូវកម្ពុជាក្រោម សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ",
                    facebook: "glfinancecambodia",
                    telegram: "https://t.me/borenpeng"
                  },
                  {
                    type: "IF",
                    name: "ឆាយលីស រ៉ូយ៉ាល់ លីស៊ីង ម.ក",
                    latinname: "Chailease Royal Leasing Plc",
                    gender: null,
                    phoneNumber: "011888408",
                    address: "អគារ ២១៦បេ ជាន់ទី៣ មហាវិថីព្រះនរោត្ដម (៤១) សង្កាត់ទន្លេបាសាក់ ខណ្ឌចំការមន ភ្នំពេញ",
                    facebook: "kkleasing",
                    telegram: "https://t.me/borenpeng"
                  },
                  {
                    type: "IF",
                    name: "ខេ ខេ ហ្វាន់ លីសីង ភីអិលស៊ី",
                    latinname: "KK Fund Leasing Plc.",
                    gender: null,
                    phoneNumber: "023212559",
                    address: "No. 69-71, St 271, Sangkat Tumnob Tuek, Khan Boeung Keng Kang, Phnom Penh, Cambodia.",
                    facebook: "kkleasing",
                    telegram: "https://t.me/borenpeng"
                  }
                                    
              ];

            for (let i = 0; i < contactdata.length; i++) {
                createContact(contactdata[i]), i +1;
            }
        }
    })
    .catch((err) => {
        console.log(err);
    });

}

function createInstitutes() {


    Institute.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            createInstitue('ជីអិលហ្វាយនែន ភីអិលស៊ី', 'ផ្ទះលេខ ២៧០,២៧៤ ផ្លូវកម្ពុជាក្រោម ភូមិ ៤ សង្កាត់ មិត្តភាព ខណ្ឌ ៧មករា រាជធានីភ្នំពេញ');
            createInstitue('ឆាយលីស រ៉ូយ៉ាល់ ហ្វាយនែន', '12F, No.146 Key Stone Building, Preah Norodom Blvd (41), Khan Chamkar Mon, Phnom Penh, Cambodia');    
        }
    });
}

async function createInvoice() {
    console.log('Creaet a test invoice');       
    const customer = await Contact.findOne({ name: 'ណីតា សុខ' });
    const datetime = new Date();
    var invoice = new Invoice();
    const item = await Item.findOne({ name:'Honda Dream 125CC 2023 - Black' });
    invoice.date = datetime.getTime();
    invoice.customer = customer._id;
    invoice.item = item._id;
    invoice.number = {};
    invoice.number.prefix = 'INV';
    invoice.machineNumber = '123456789';
    invoice.chassisNumber = '123456789';
    invoice.plateNumber = '123456789';
    invoice.color = '6485b150a54e2d6efc2d8e8b';
    invoice.year = 2023;
    invoice.condition = 'NEW';
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


function createInstitue(name, address) {
    var institute = new Institute();
    institute.name = name;
    institute.address = address;
    institute.enable = true;
    institute.save();
};

function createContact(data, index) {
    console.log('Creaet a new contact:' + data.name);       
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
}

function createItems() {

    Category.estimatedDocumentCount({})
    .then((count) => {
        if (count === 0) {
            var category = new Category();
            category.name = 'Motobike';
            category.enable = true;
            category.save();

            Account.findOne({ 'number': 102 })
            .then((result) => {
                var account = result;
                createItem('Honda Dream 125CC 2023 - Black', category._id, account._id);
                createItem('Honda Dream 125CC 2023 - Red', category._id, account._id);
                createItem('Honda Dream 125CC 2023 - White', category._id, account._id);
                createItem('Honda Scoopy 110CC 2023 - Black', category._id, account._id);
                createItem('Honda Scoopy 110CC 2023 - Red', category._id, account._id);
                createItem('Honda Scoopy 110CC 2023 - White', category._id, account._id);
                createItem('Honda Scoopy 110CC 2022 - Black', category._id, account._id);
                createItem('Honda Scoopy 110CC 2022 - White', category._id, account._id);
                createItem('Honda Scoopy 110CC 2022 - Red', category._id, account._id);
                createItem('Honda Beat 110CC 2022 - Blue', category._id, account._id);
                createItem('Honda Beat 110CC 2022 - Red', category._id,account._id);
                createItem('Honda Drea 125CC 2020 - Red', category._id, account._id);
                createItem('Honda Drea 125CC 2020 - Red', category._id, account._id);
            })
            .catch((err) => {
                // Handle the error
            });
        }
    })
    .catch((err) => {
        // Handle the error
    });


}

function createItem(name, cat, acct) {  
    console.log('Create new Item: ' + name);
    
    var item = new Item();
    item.name = name;
    item.price = 2050;
    item.cost = 2000;
    item.description = 'item testing description';
    item.isInventory = true;
    item.category = cat;
    item.account = acct;
    item.specifications = [];
    
    var colorSpec = new Itemspecification();;
    colorSpec.name = 'color';
    colorSpec.value = 'red';
    colorSpec.item = item;
    colorSpec.order = 0;
    colorSpec.save();
    item.specifications.push(colorSpec);

    var chassisNumber = new Itemspecification();
    chassisNumber.name = 'chassisNumber';
    chassisNumber.value = 'FB110M0007729';
    chassisNumber.item = item;
    chassisNumber.order = 0;
    chassisNumber.save();
    item.specifications.push(chassisNumber);

    var machineNumber = new Itemspecification();
    machineNumber.name = 'machineNumber';
    machineNumber.value = 'FB110M0007729';
    machineNumber.item = item;
    machineNumber.order = 0;
    machineNumber.save();
    item.specifications.push(machineNumber);

    item.save();
    
}
