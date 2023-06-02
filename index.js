require("dotenv").config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('config');
let mongoose = require('mongoose');
const Media = require('./models/media');
const util = require('util');
const fileUpload = require('express-fileupload');
var media = require('./controllers/media.controller');
const multer  = require('multer');
const moment= require('moment') 
require('moment-timezone') 

const db = require('./models');
const Role = db.role;

const dateThailand = moment.tz(Date.now(), "Asia/Bangkok");

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'public/uploads/', 
      filename: (req, file, cb) => {
          cb(null, path.parse(file.originalname).name + '_' + Date.now() 
            + path.extname(file.originalname));
    }
});

const imageUpload = multer({
	storage: imageStorage,
	limits: {
	  fileSize: 1000000 // 1000000 Bytes = 1 MB
	},
	fileFilter(req, file, cb) {
	//   if (!file.originalname.match(/\.(png|jpg)$/)) { 
	// 	 // upload only png and jpg format
	// 	 return cb(new Error('Please upload a Image'))
	//    }
	 cb(undefined, true)
  }
}) 

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

const app = express();

const app_conf = config.get('App');

// connnection_string = util.format('mongodb+srv://cashbook:5s17DyXYI6sA20i83@dbaas-db-6015241-a8489cc3.mongo.ondigitalocean.com/cashbook?tls=true&authSource=admin&replicaSet=dbaas-db-6015241');
 connnection_string = util.format('mongodb://boren:boren@127.0.0.1:27017/cashbook');

mongoose.set('useFindAndModify', false);
mongoose.connect(connnection_string, { useNewUrlParser: true, useUnifiedTopology: true});
var database = mongoose.connection;
if(!database) {
	console.log("Error connecting db");
}
else {
	initial();
	console.log("Db connected successfully");
}


app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

function initial() {
	console.log("Initial Role");
	Role.estimatedDocumentCount((err, count) => {
	  if (!err && count === 0) {

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
	});
  }

function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
  
  function replaceAll(str, find, replace) {
	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }

app.post('/api/media/upload', imageUpload.single('file'), async function (req, res, next) {
	try {
		file = req.file;
		if (file != null) {
			const { originalname, size, mimetype, path} = file;
			var logicalPath = replaceAll(path, '\\', '/');
			var file_name = Date.now() +'_'+ originalname;
			const media = await Media.create({
				name: file_name,
				size: size,
				mimetype: mimetype,
				path: logicalPath
			});
			res.status(201).json(media);
		}
	} 
	catch (err) {
		console.log(err);
	} 
})
  
app.use(express.static('public'));
require('./routes/default.routes')(app);
require('./routes/crud.routes')(app);
require('./routes/view.routes')(app);
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});
