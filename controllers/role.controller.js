const db = require("../models");
const Role = db.role;

exports.all = (req, res) => {
    Role.find({})
      .exec((err, roles) => {
        if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        res.status(200).json(roles);
      });
};
  