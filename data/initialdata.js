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
const Category = db.category;
const Counter = db.counter;
const Institute = db.institute;
const Media = db.media;

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
			password: 'admin'
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


  Category.estimatedDocumentCount({})
  .then((count) => {
    if (count === 0) {
		var category = new Category();
        category.name = 'ម៉ូតូ';
		category.key = 'MOTORBIKE';
        category.enable = true;
        category.save();
	}
  })
  .catch((err) => {
    // Handle the error
  });


  db.maker.estimatedDocumentCount({})
  .then((count) => {
    if (count === 0) {
		createRefDoc('maker', 'Honda NCX', 'HONDA_NCX');
		createRefDoc('maker', 'Honda (Thai)', 'HONDA_THAI');
		createRefDoc('maker', 'Suzuki', 'SUZUKI');
		createRefDoc('maker', 'Yamaha', 'YAMAHA');
	}
  })
  .catch((err) => {
    // Handle the error
  });

  db.type.estimatedDocumentCount({})
  .then((count) => {
    if (count === 0) {
		createRefDoc('type', 'Off-Road', 'OFF_ROAD');
		createRefDoc('type', 'Scooter', 'SCOOTER');
		createRefDoc('type', 'Sport', 'SPORT');
	}
  })
  .catch((err) => {
    // Handle the error
  });

  db.condition.estimatedDocumentCount({})
  .then((count) => {
    if (count === 0) {
		createRefDoc('condition', 'NEW', 'NEW');
		createRefDoc('condition', 'USED', 'USED');
		createRefDoc('condition', 'SECONDHAND', 'SECONDHAND');
	}
  })
  .catch((err) => {
    // Handle the error
  });

  
  db.model.estimatedDocumentCount({})
  .then((count) => {
    if (count === 0) {
		createRefDoc('model', 'Scoopy Prestige','SCOOPY_PRESTIGE');
		createRefDoc('model', 'Dream','DREAM');
		createRefDoc('model', 'Wave110','WAVE110');
		createRefDoc('model', 'Scoopy Club12','SCOOPY_CLUB12');
		createRefDoc('model', 'PCX','PCX');
		createRefDoc('model', 'Beat','BEAT');
		createRefDoc('model', 'Zoomer-X','ZOOMER_X');
		createRefDoc('model', 'Click125','CLICK125');
		createRefDoc('model', 'Click160','CLICK160');
		createRefDoc('model', 'ADV','ADV');
		createRefDoc('model', 'CB','CB');
		createRefDoc('model', 'CBR','CBR');
		createRefDoc('model', 'MSX','MSX');
		createRefDoc('model', 'MX King','MX_KING');
		createRefDoc('model', 'MT-15','MT_15');
		createRefDoc('model', 'FZ-F1','FZ_F1');
		createRefDoc('model', 'AEROX','AEROX');
		createRefDoc('model', 'X-RIDE','X_RIDE');
		createRefDoc('model', 'Q-BIX','Q_BIX');
		createRefDoc('model', 'Grand Filano','GRAND_FILANO');
		createRefDoc('model', "Let's",'LET_S');
		createRefDoc('model', 'Nex','NEX');
		createRefDoc('model', 'Nex Digi','NEX_DIGI');
		createRefDoc('model', 'Nex II','NEX_II');
		createRefDoc('model', 'Nex Crossover','NEX_CROSSOVER');
		createRefDoc('model', 'Smash V','SMASH_V');
		createRefDoc('model', 'Viva 125','VIVA_125');

		
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

function createRefDoc(docName, name, key) {   
	console.log('Create new ' + docName +  ':' + name);  
	const Model = mongoose.model(docName);
	const doc = new Model();
	doc.name = name;
	doc.key = key;
	doc.enable = true;
	doc.save();
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
		var wing = new Media();
		wing.name = "wing.jpg";
		wing.size = 19338;
		wing.mimetype = 'image/jpeg';
		wing.path = 'uploads/wing.jpg';
		wing.save();
		institute.logo = wing._id;
		institute.save();
		
		var institute = new Institute();
		institute.code = 'KK';
		institute.name = 'ខេ ខេ ហ្វាន់';
		institute.latinname = 'KK FUND LEASING PLC';
		institute.address = 'ផ្ទះលេខ 69-71 ផ្លូវ 271 សង្កាត់ទំនប់ទឹក ខណ្ឌ បឹងកេងកង រាជធានីភ្នំពេញ';
		var kk = new Media();
		kk.name = "kk.jpg";
		kk.size = 19338;
		kk.mimetype = 'image/jpeg';
		kk.path = 'uploads/kk.jpg';
		kk.save();
		institute.logo = kk._id;
		institute.save();

		institute = new Institute();
		institute.code = 'CL';
		institute.name = 'ឆាយលីស';
		institute.latinname = 'Chailease Royal Leasing Plc';
		institute.address = 'គារ ២១៦បេ ជាន់ទី៣ មហាវិថីព្រះនរោត្ដម (៤១) សង្កាត់ទន្លេបាសាក់ ខណ្ឌចំការមន ភ្នំពេញ';
		var cl = new Media();
		cl.name = "cl.jpg";
		cl.size = 19338;
		cl.mimetype = 'image/jpeg';
		cl.path = 'uploads/cl.jpg';
		cl.save();
		institute.logo = cl._id;
		institute.save();

		institute = new Institute();
		institute.code = 'AP';
		institute.name = 'អាក់ទីវភីភល';
		institute.latinname = ' Active People';
		institute.address = 'អាគារលេខ៨៨ ផ្លូវលេខ២១៤ កែងនឹងផ្លូវលេខ១១៣ សង្កាត់បឹងព្រលិត ខណ្ឌ៧មករា រាជធានីភ្នំពេញ';
		var ap = new Media();
		ap.name = "ap.jpg";
		ap.size = 19338;
		ap.mimetype = 'image/jpeg';
		ap.path = 'uploads/ap.jpg';
		ap.save();
		institute.logo = ap._id;
		institute.save();

		institute = new Institute();
		institute.code = 'GLF';
		institute.name = 'ជីអិល';
		institute.latinname = 'GL Finance PLC';
		institute.address = 'អាគាលេខ 270, 274 ផ្លូវកម្ពុជាក្រោម សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ';
		var gl = new Media();
		gl.name = "gl.jpg";
		gl.size = 19338;
		gl.mimetype = 'image/jpeg';
		gl.path = 'uploads/gl.jpg';
		gl.save();
		institute.logo = gl._id;
		institute.save();

	  }	
  })
  .catch((err) => {
	console.log("error", err);
  });

	
}