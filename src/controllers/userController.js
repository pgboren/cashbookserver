const db = require("../models");
const BaseController = require("./baseController");


class UserController extends BaseController {
  
  constructor() {
    super(db.user);
  }
  
  replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async update(req, res) {

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

       this.User.updateOne(
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

  async post(req, res) {
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

  checkemailexist(req, res) {
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

  get(req, res) {
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

  markAsDeleted(req, res, next) {
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

}

module.exports = UserController;
