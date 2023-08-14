const db = require('../models');
let mongoose = require('mongoose');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const doc = require('pdfkit');

const DocumentClass = db.documentClass;
const Role = db.role;
const User = db.user;
const AccountType = db.accounttype;
const Account = db.account;
const Color = db.color;
const Counter = db.counter;
const Institute = db.institute;

module.exports = function(app) {
	console.log("Initial User Roles Data");

	Role.estimatedDocumentCount({})
  	.then((count) => {
    
	  if (count === 0) {

		new Role({
		  name: "user"
		}).save(err => {
		  if (err) {
			console.log("error", err);
		  }

		  console.log("added 'user' to roles collection");
		});
  
		new Role({
		  name: "moderator"
		}).save(err => {
		  if (err) {
			console.log("error", err);
		  }
  
		  console.log("added 'moderator' to roles collection");
		});
  
		var adminRole = new Role({
		  name: "admin"
		});
		adminRole.save(err => {
		  if (err) {
			console.log("error", err);
		  }
  
		  console.log("added 'admin' to roles collection");
		});

		const adminUser = new User({
			username: 'admin',
			email: 'admin@soleapmotor.com',
			password: bcrypt.hashSync('admin', 8)
		  });

		adminUser.roles.push(adminRole);
		adminUser.save(err => {
			if (err) {
			  console.log("error", err);
			}
	
			console.log("added 'admin' to users collection");
		  });
		
		new Role({
			name: "manager"
		  }).save(err => {
			if (err) {
			  console.log("error", err);
			}
	
			console.log("added 'admin' to roles collection");
		  });

		  new Role({
			name: "saler"
		  }).save(err => {
			if (err) {
			  console.log("error", err);
			}
	
			console.log("added 'saler' to roles collection");
		  });

		  new Role({
			name: "co"
		  }).save(err => {
			if (err) {
			  console.log("error", err);
			}
	
			console.log("added 'co' to roles collection");
		  });
	  }
	
	
  })
  .catch((err) => {
	console.log("error", err);
  });

    
	console.log("Initial Account Type and Account Data");


	AccountType.estimatedDocumentCount({})
  .then((count) => {
    
	if (count === 0) {

		var assetType = createAccountType("Current Asset", "INCREASED", "DECREASED");
		createAccount(101, 'បេឡាសាច់ប្រាក់', assetType._id, 'BALANCE_SHEET');
		createAccount(101, 'គណនីធានាគា', assetType._id, 'BALANCE_SHEET');
		createAccount(102, 'ស្តុកម៉ូតូ', assetType._id, 'BALANCE_SHEET');
		createAccount(103, 'គណនី​ត្រូវ​ទទួល', assetType._id, 'BALANCE_SHEET');
		
		var fixedType = createAccountType("Fixed Asset", "INCREASED", "DECREASED");
		var liability = createAccountType("Liabilities", "DECREASED", "INCREASED");
		createAccount(301, 'គណនីដែលត្រូវសង', liability._id, 'BALANCE_SHEET');

		var revenueType = createAccountType("Revenue", "DECREASED", "INCREASED");
		createAccount(401, 'លក់ម៉ូតូ', revenueType._id, 'INCOME_STATEMENT');
		createAccount(402, 'ការប្រាក់', revenueType._id, 'INCOME_STATEMENT');
		createAccount(403, 'ចំណូលផ្សេងៗ', revenueType._id, 'INCOME_STATEMENT');

		var expenseType = createAccountType("Expense", "DECREASED", "INCREASED");
		createAccount(501, 'ប្រាក់ខែ', expenseType._id, 'INCOME_STATEMENT');
		createAccount(502, 'រង្វាន់', expenseType._id, 'INCOME_STATEMENT');
		createAccount(503, 'សំភារះការិយាល័យ', expenseType._id, 'INCOME_STATEMENT');
		createAccount(504, 'ទឹកភ្លើង', expenseType._id, 'INCOME_STATEMENT');
		createAccount(505, 'ការប្រាក់', expenseType._id, 'INCOME_STATEMENT');
		createAccount(506, 'អាហារ', expenseType._id, 'INCOME_STATEMENT');
		createAccount(507, 'សាំង', expenseType._id, 'INCOME_STATEMENT');
		createAccount(508, 'អ៊ីនធឺណេត', expenseType._id, 'INCOME_STATEMENT');
		createAccount(509, 'ទូរស័ព្ទ', expenseType._id, 'INCOME_STATEMENT');
		createAccount(510, 'កំរៃជើងសារ១', expenseType._id, 'INCOME_STATEMENT');
		createAccount(511, 'កំរៃជើងសារ២', expenseType._id, 'INCOME_STATEMENT');
		createAccount(512, 'រង្វាន់អតិថិជន', expenseType._id, 'INCOME_STATEMENT');
		createAccount(513, 'ជំងឺ', expenseType._id, 'INCOME_STATEMENT');
		createAccount(514, 'ដើរកំសាន្ដ', expenseType._id, 'INCOME_STATEMENT');
		createAccount(515, 'ថ្លៃផ្ទះជួល', expenseType._id, 'INCOME_STATEMENT');

		var equityType = createAccountType("Equity", "DECREASED", "INCREASED");
		createAccount(601, 'តាន់ស៊ីនឿន - ដើមទុន', equityType._id, 'BALANCE_SHEET');
		createAccount(602, 'តាន់ស៊ីនឿន - ដកទុន', equityType._id, 'BALANCE_SHEET');
					
	}

	createInstitutes();

  })
  .catch((err) => {
    // Handle the error
  });

  
  Color.estimatedDocumentCount({})
  .then((count) => {
    if (count === 0) {
		createColor('ខ្មៅ');
		createColor('ក្រហម');
		createColor('ខៀវ');
		createColor('ស');
		createColor('ប្រផេះ');
		createColor('លឿង');
		createColor('ទឹកមាស');
	}
  })
  .catch((err) => {
    // Handle the error
  });


  DocumentClass.estimatedDocumentCount({})
  .then((count) => {
    if (count === 0) {
		var vehicleClass = createDocumentClass('VEHICLE', 'Vehicle');
		vehicleClass.fields.push(createDocumentField('photo', 'Photo', null));
		vehicleClass.fields.push(createDocumentField('barcode', 'String', null));
		vehicleClass.fields.push(createDocumentField('name', 'String', null));
		vehicleClass.fields.push(createDocumentField('account', 'Document', 'account'));
		vehicleClass.fields.push(createDocumentField('description', 'String', null));
		vehicleClass.fields.push(createDocumentField('price', 'double', null));
		vehicleClass.fields.push(createDocumentField('cost', 'double', null));
		vehicleClass.fields.push(createDocumentField('category', 'Document', 'category'));
		vehicleClass.fields.push(createDocumentField('make', 'String', null));
		vehicleClass.fields.push(createDocumentField('model', 'String', null));
		vehicleClass.fields.push(createDocumentField('type', 'String', null));
		vehicleClass.fields.push(createDocumentField('condition', 'String', null));
		vehicleClass.fields.push(createDocumentField('chassisno', 'String', null));
		vehicleClass.fields.push(createDocumentField('engineno', 'String', null));
		vehicleClass.fields.push(createDocumentField('color', 'String', null));
		vehicleClass.fields.push(createDocumentField('horsepower', 'String', null));
		vehicleClass.fields.push(createDocumentField('year', 'String', null));
		vehicleClass.fields.push(createDocumentField('enable', 'Boolean', null));
		vehicleClass.save();
	}
  })
  .catch((err) => {
    // Handle the error
  });

}

function createDocumentField(name, type, multiplicity, format, data, targetDocumentClass, require) {
	var field = {};
	field.name = name;
	field.type = type;
	field.multiplicity = multiplicity;
	field.format = format;
	field.data = data;
	field.targetDocumentClass = targetDocumentClass; 
	field.require =  require;
	return field;
}

function createDocumentClass(name, className) {
	var documentClass = new DocumentClass();
	documentClass.name = name;
	documentClass.className = className;
	documentClass.fields = [];
	return documentClass;
}

function createColor(name) {   
	console.log('Create new color:' + name);  
	var color = new Color();
	color.name = name;
	color.enable = true;
	color.save();
}

function createAccount(number, name, type, statement) {   
    console.log('Create new account:' + number + ' - ' + name);  
    var account = new Account();
    account.number = number;
    account.name = name;
    account.type = type;
	account.statement = statement;
    account.save();
    return account;
}

function createAccountType(name, debit_effect, credit_effect) {
    console.log('Create new account type:' + name); 
    var accountType = new AccountType();
    accountType.name = name;
    accountType.debitEffect = debit_effect;
    accountType.creditEffect = credit_effect;
    accountType.save();
    return accountType;
}

function createInstitutes() {

   Institute.estimatedDocumentCount({}).then((count) => {
	  if (count === 0) {
		console.log('Create institutes'); 

		var institute = new Institute();
		institute.code = 'WING';
		institute.name = 'ធនាគារ វីង';
		institute.latinname = 'Wing Bank';
		institute.address = 'អគារលេខ 721 មហាវិថីព្រះមុនីវង្ស ភូមិភូមិ 9 សង្កាត់បឹងកេងកងទី 3 ខណ្ឌបឹងកេងកង រាជធានីភ្នំពេញ';
		institute.logo = '64b7ec4a0a8fb90838d5dceb';
		institute.save();
		
		var institute = new Institute();
		institute.code = 'KK';
		institute.name = 'ខេ ខេ ហ្វាន់';
		institute.latinname = 'KK FUND LEASING PLC';
		institute.address = 'ផ្ទះលេខ 69-71 ផ្លូវ 271 សង្កាត់ទំនប់ទឹក ខណ្ឌ បឹងកេងកង រាជធានីភ្នំពេញ';
		institute.logo = '64b7ec330a8fb90838d5dce1';
		institute.save();

		institute = new Institute();
		institute.code = 'CL';
		institute.name = 'ឆាយលីស';
		institute.latinname = 'Chailease Royal Leasing Plc';
		institute.address = 'គារ ២១៦បេ ជាន់ទី៣ មហាវិថីព្រះនរោត្ដម (៤១) សង្កាត់ទន្លេបាសាក់ ខណ្ឌចំការមន ភ្នំពេញ';
		institute.logo = '64b7ec3c0a8fb90838d5dce5';
		institute.save();

		institute = new Institute();
		institute.code = 'AP';
		institute.name = 'អាក់ទីវភីភល';
		institute.latinname = ' Active People';
		institute.address = 'អាគារលេខ៨៨ ផ្លូវលេខ២១៤ កែងនឹងផ្លូវលេខ១១៣ សង្កាត់បឹងព្រលិត ខណ្ឌ៧មករា រាជធានីភ្នំពេញ';
		institute.logo = '64b7ec410a8fb90838d5dce7';
		institute.save();

		institute = new Institute();
		institute.code = 'GLF';
		institute.name = 'ជីអិល';
		institute.latinname = 'GL Finance PLC';
		institute.address = 'អាគាលេខ 270, 274 ផ្លូវកម្ពុជាក្រោម សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ';
		institute.logo = '64b7ec380a8fb90838d5dce3';	
		institute.save();

		institute = new Institute();
		institute.code = 'AMK';
		institute.name = 'អេ​ អឹម ខេ';
		institute.latinname = 'AMK Microfinance Institution PLC';
		institute.address = 'អគារលេខ ២៨៥  មហាវិថីយុទ្ធពលខេមរៈភូមិន្ទ (ផ្លូវ ២៧១) ​ សង្កាត់ទំនប់ទឹក  ខណ្ឌបឹងកេងកង រាជធានីភ្នំពេញ';
		institute.logo = '64b7ec450a8fb90838d5dce9';	
		institute.save();

	  }	
  })
  .catch((err) => {
	console.log("error", err);
  });

	
}