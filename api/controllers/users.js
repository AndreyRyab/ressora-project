const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.findAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((error) => {
      res.status(400).send({ message: error.message });
      console.log(error.message);;
    });
};

exports.login = (req, res) => {
  const { login, password } = req.body;
  User.find({ login })
    .select('+password')
    .then((userArray) => {
      if (!userArray.length) {
        return res.status(404)
          .send({ message: 'Пользователь с таким логином не найден' })
      }
      bcrypt
      .compare(password, userArray[0].password)
      .then((matched) => {
        if (!matched) {
          return res
          .status(401)
          .send({ message: 'Неправильные почта или пароль' })
        }
          /* const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
            { expiresIn: "7d" }
          ); */
        return res
          .status(200)
          .send({ message: 'С паролем всё ок!' })
        });
    })
    .catch((error) => {
      console.log(error.message);
    });;
};

exports.createUser = (req, res) => {
  if (!req.body.login || !req.body.name || !req.body.password || !req.body.admin) {
    return res.status(400).send({
      message: 'Введите все параметры нового пользователя',
    });
  }
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        login: req.body.login,
        name: req.body.name,
        password: hash,
        admin: req.body.admin,
      })
    )
    .then((user) =>
      res.status(200).send({
        login: user.login,
        name: user.name,
        admin: user.admin,
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({
          message: `Пользователь с таким ${Object.keys(err.keyValue)[0] === 'name' ? 'именем' : 'логином'} уже есть в базе`,
        });
      } else {
        return res.status(500).send({
          message: `Ошибка на сервере: ${err.message}`,
        });
      }
    })
};
