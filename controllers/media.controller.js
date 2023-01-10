const fs = require("fs");
const http = require("http");
const url = require("url");
const path = require('path');
const Media = require('../models/media');
var thumb = require('node-thumbnail').thumb;

exports.upload = function (req, res) {

    let file;
    let uploadPath='userfiles/';
    let folder = null;
    let thumbnail = false;
    let prefix = null;
    let thumbnail_width = 0;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    file = req.files.upload;
    file.fileName

    if (req.query.folder != null) {
        folder = req.query.folder;
    }

    if (req.query.prefix != null) {
        prefix = req.query.prefix;
    }

    if (req.query.thumbnail != null && req.query.thumbnail == 'true') {
        thumbnail = true;
        thumbnail_width = req.query.thumbnail_width;
    }
    let outputFile = "output.jpg";

    uploadPath = 'public/userfiles/' + folder + '/';
   
    if (folder != null) {
        
        if (!fs.existsSync(uploadPath)) {
            fs.mkdir(uploadPath,true, function(err) {
                moveFile(file, uploadPath + file.name, res);
            });
        }
        else {
            moveFile(file, uploadPath + file.name, res);
            var fileName = uploadPath + 'thumbnail/' + file.name;
            if (fs.existsSync(fileName)) {
                fs.unlinkSync(fileName);
            }
        }
    }
    else {
        uploadPath = uploadPath + file.name;
        moveFile(file, uploadPath, res);
    } 

};

function genrateThumbnail(source, destinaiton, width) {

    thumb({
        source: source,
        destination: destinaiton,
        width: width,
        suffix: "",
        concurrency: 4
    }, function(files, err, stdout, stderr) {
        if (err) {
            console.log(err);
            throw err;
        }
    });
}

function moveFile(file, uploadPath, res) {
    file.mv(uploadPath, function(err) {
        if (err)
            return res.status(500).send(err);
    });
};

