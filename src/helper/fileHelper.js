// fileHelper.js
const fs = require('fs');
const pathModule = require('path');
const multer  = require('multer');
const path = require('path');

function replaceAll(str, find, replace) {
	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function moveFile(file, destinationFolder) {
  const { originalname, size, mimetype, path } = file;
  const logicalPath = replaceAll(path, '\\', '/');
  const relativePath = replaceAll(logicalPath, 'public/', '');
  const fileName = Date.now() + '_' + originalname;
  return {
    name: fileName,
    size,
    mimetype,
    path: logicalPath,
  };
}

module.exports = {
  moveFile,
};