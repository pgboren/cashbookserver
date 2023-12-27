const db = require("../models");
const User = db.user;
const Media = db.media;
const Role = db.role;

function replaceAll(str, find, replace) {
	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.update = async function(req, res) {

    const file = req.file;
    var media = null;
    var userId = req.params.id;
    if (file != null) {
      const { filename, size, mimetype, path} = file;
      var logicalPath = replaceAll(path, '\\', '/');
      logicalPath = replaceAll(logicalPath, 'public/', '');
      media = await Media.create({
        name: filename,
        size: size,
        mimetype: mimetype,
        path: logicalPath
      });
    }

    var roles = [];
    if (req.body.roles) {
      roles = await Role.find({ name: { $in: req.body.roles } });
    }

    const data = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      avatar: media? media._id: null,
      roles: roles
    };

    User.updateOne(
      { _id: userId },
      { $set: data }
    ).exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: "success",
                message: 'User is marked as deleted.'
            });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    })
    .catch(err => {
        res.status(500).json({ message: 'Internal server error.' });
    });

};

exports.post = async (req, res) => {
  const file = req.file;
  var media = null;
  if (file != null) {
    const { filename, size, mimetype, path} = file;
    var logicalPath = replaceAll(path, '\\', '/');
    logicalPath = replaceAll(logicalPath, 'public/', '');
    media = await Media.create({
      name: filename,
      size: size,
      mimetype: mimetype,
      path: logicalPath
    });
  }
  var roles = [];
  if (req.body.roles) {
    roles = await Role.find({ name: { $in: req.body.roles } });
  }
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    avatar: media? media._id: null,
    roles: req.body.roles? roles.map(role => role._id): []
  });
  await user.save();
  res.redirect('/api/users/' + user._id); 
}

exports.checkemailexist = (req, res) => {
  const email = req.query.email;
  const userId = req.query.userId;

  console.log(email);
  console.log(userId);

  let query = { email: email };
  query.deleted = false;

  if (userId) {
    query._id = { $ne: userId };
  }
  
  User.findOne(query)
    .exec((err, findUser) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (findUser != null) {
        res.status(200).json({exist: true});
        return;
      }
      res.status(200).json({exist: false});
  });
}

exports.get = (req, res) => {
  const id = req.params.id;
  User.findOne({ _id: id })
    .populate('roles', '_id name')
    .populate('avatar', '_id path')
    .exec((err, findUser) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (findUser != null) {
      const formattedUser = {
        _id: findUser._id,
        avatar: findUser.avatar ? findUser.avatar.path : null,
        roles: findUser.roles ? findUser.roles.map(role => role.name) : [], 
        username: findUser.username,
        email: findUser.email,
        createdAt: findUser.createdAt,
        updatedAt: findUser.updatedAt
      };
      res.status(200).json(formattedUser);
    }
    else {
      res.status(204).json({});
    }
  });
};

exports.all = (req, res) => {
  const deleted = req.query.deleted? req.query.deleted : false; 
  const query = deleted === 'true' ? {} : { deleted: false };
  const limit = parseInt(req.query.limit) || 10;
  const sortField = req.query.sort;
  const order = req.query.order;

  const sort = {};
  sort[sortField] = order === 'asc' ? 1 : -1;
  
  const options = {
      page: parseInt(req.query.page) || 1,
      populate: ["roles", "avatar"],
      limit: limit,
      sort: sort
  };

  User.paginate(query, options, function(err, result) {
    const formattedUsers = result.docs.map(user => ({
      _id: user._id,
      avatar: user.avatar ? user.avatar.path : null,
      roles: user.roles ? user.roles.map(role => role.name) : [], 
      username: user.username,
      email: user.email,
      deleted: user.deleted,
      deletable: user.deletable,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  
    res.status(200).json({
        docs: formattedUsers,
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.totalDocs,
    });

  });

};

exports.markAsDeleted = function(req, res, next) {
  const userId = req.params.id;
  User.updateOne(
      { _id: userId },
      { $set: { deleted: true } }
  ).exec()
  .then(result => {
      if (result.nModified > 0) {
          res.status(200).json({
              status: "success",
              message: 'User is marked as deleted.'
          });
      } else {
          res.status(404).json({ message: 'User not found.' });
      }
  })
  .catch(err => {
      res.status(500).json({ message: 'Internal server error.' });
  });
};
