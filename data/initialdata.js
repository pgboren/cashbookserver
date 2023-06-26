const db = require('../models');
let mongoose = require('mongoose');

const Role = db.role;
const AccountType = db.accounttype;
const Account = db.account;
const Color = db.color;
const Counter = db.counter;

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
  
		new Role({
		  name: "admin"
		}).save(err => {
		  if (err) {
			console.log("error", err);
		  }
  
		  console.log("added 'admin' to roles collection");
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
    // Handle the error
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