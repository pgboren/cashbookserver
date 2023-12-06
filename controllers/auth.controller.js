const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const UserAccessToken = db.user_access_token;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    branch: req.body.branch,
    password: req.body.password
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.verify = (req, res) => {  
  const token = req.params.token;
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        res.status(401).json({ error: 'Token has expired' });
      } else {
        res.status(500).json({ error: 'Error verifying token' });
      }
    } else {
      res.json({ message: 'Token is valid', decoded });
    }
  });
};

exports.refresh = (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (invalidatedTokens.has(refreshToken)) {
    return res.status(403).json({ message: 'Forbidden - Refresh token has been invalidated' });
  }

  jwt.verify(refreshToken, config.secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = decoded;
    // Assuming `user` is defined somewhere in your code
    const newAccessToken = jwt.sign({ id: user.id }, config.secret, { expiresIn: '1d' });
    const newRefreshToken = jwt.sign({ id: user.id }, config.secret, { expiresIn: '15d' });

    // Consider storing the new refresh token in your data store
    // and associating it with the user

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  });
};

exports.signin = (req, res) => {  

  const userAgent = req.headers['user-agent'];
  
  User.findOne({
    username: req.body.username
  })
    .populate("roles")
    .populate("avatar")
    .exec((err, user) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(req.body.password,user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({accessToken: null,message: "Invalid Password!"
        });
      }

      UserAccessToken.update( { user: user._id, active:true },{ $set: { active: false } },{ multi: true }).exec();
      const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: '1d' });
      const refreshToken = jwt.sign({ id: user.id }, config.secret, { expiresIn: '15d' });

      var accessToken = new UserAccessToken();
      accessToken.user = user;
      accessToken.token = token;
      accessToken.active = true;
      accessToken.type = 'ACCESSTOKEN';
      accessToken.save();

      var accessToken = new UserAccessToken();
      accessToken.user = user;
      accessToken.token = refreshToken;
      accessToken.active = true;
      accessToken.type = 'REFRESHTOKEN';
      accessToken.save();

      var authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      console.log(user);
  
      var authData = {
        username: user.username,
        brach: user.branch,
        avatar: user.avatar.path,
        email: user.email,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken
      };
      res.status(200).send(authData);
    });
};

exports.signout = async (req, res) => {
  const accessToken = req.headers['x-access-token'];
  const refreshToken = req.headers['x-refresh-token'];
  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  UserAccessToken.findOneAndUpdate({ token: accessToken }, { active: false }, { upsert: true }).exec();
  UserAccessToken.findOneAndUpdate({ token: refreshToken }, { active: false }, { upsert: true }).exec();
  res.json({ message: 'Logout successful' });
};