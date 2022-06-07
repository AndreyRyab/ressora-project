const User = require('../models/user');

module.exports.findAll = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((error) => {
      console.log(error.message);;
    });
};
