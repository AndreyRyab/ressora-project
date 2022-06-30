const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const User = require('../_models/user');

const {
  NOT_FOUND_USER,
  LOGIN_PASSWORD_ERR,
  JWT_ERROR,
  SERVER_ERR,
  SUCCESS_PASSWORD,
  AUTH_ERROR,
  CONFLICT_ERROR,
  BAD_REQUEST,
  SUCCESS_LOGOUT,
  REMOVAL_FAILED,
} = require('../_errors/messages-constants');

const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  secure: true,
}

exports.findAllUsers = (req, res) => {
  console.log('contr, findAllUsers');
  User.find({})
    .then((users) => {
      res.status(200).send(users.reverse());
    })
    .catch((error) => {
      res.status(400).send({ message: error.message });
      console.log(error.message);;
    });
};

exports.signin = (req, res) => {
  console.log('signin from controllers');
  req.body = JSON.parse(req.body);
  const { login, password } = req.body;
  User.findOne({ login })
    .select('+password')
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: NOT_FOUND_USER });
      }
      bcrypt
      .compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return res.status(401).send({ message: LOGIN_PASSWORD_ERR });
        }
        try {
          const token = jwt.sign(
            { _id: user._id },
            /* process.env.NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', */
            'dev-secret',
            { expiresIn: '7d' },
          );
          return res
          .setHeader(
            'Set-Cookie', cookie.serialize(
              'jwt',
              token,
              {
                ...cookieOptions,
                maxAge: 3600000 * 24 * 7,
              },
            )
          )
          .status(200)
          .send({ message: SUCCESS_PASSWORD });
        } catch(error) {
          console.log(error.message);
          return res.status(400).send({ message: JWT_ERROR });
        }
      })
      .catch(({ message }) => {
        console.log('controllers signin error: ', message);
        return res.status(500).send({ message: SERVER_ERR });
      });
    })
    .catch(({ message }) => {
      console.log('controllers signin error: ', message);
      return res.status(500).send({ message: SERVER_ERR });
    });
};

exports.logout = (req, res) => {
  console.log('logout from controllers');
  req.body = JSON.parse(req.body);
  User.findById({ _id: req.body._id })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: NOT_FOUND_USER });
      }
      try {
        return res
          .setHeader('Set-Cookie', cookie.serialize('jwt', null, {
            maxAge: 0,
            ...cookieOptions,
          }))
          .send({ message: SUCCESS_LOGOUT })
          .end();
      } catch(error) {
        if (error.name === 'CastError') {
          return res.status(400).send({ message: BAD_REQUEST });
        }
        console.log(error.message);
        res.status(500).send({ message: JWT_ERROR})
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
};

exports.deleteUser = (req, res) => {
  req.body = JSON.parse(req.body);
  console.log('deleteUser from controllers: ', req.body.userId);
  try {
    User.findOneAndDelete({ _id: req.body.userId })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: NOT_FOUND_USER });
        }
        return res
          .send({
            message: `Пользователь ${user._id} удалён.`,
            _id: user._id,
          })
          .end();
      });
  } catch(error) {
    if (error.name === 'CastError') {
      return res.status(400).send({ message: BAD_REQUEST });
    }
    console.log(error.message);
    res.status(500).send({ message: REMOVAL_FAILED})
  }
};

exports.getCurrentUser = (req, res) => {
  User.findById({ _id: req.body._id })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: NOT_FOUND_USER });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err.message)
      if (err.name === 'CastError') {
        return res.status(400).send({ message: BAD_REQUEST });
      }
    })
};

exports.createUser = (req, res) => {
  req.body = JSON.parse(req.body);
  if (!req.body.login || !req.body.name || !req.body.password) {
    return res.status(400).send({ message: BAD_REQUEST });
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
          message: CONFLICT_ERROR,
        });
      } else {
        return res.status(500).send({
          message: `Ошибка на сервере: ${err.message}`,
        });
      }
    })
};

exports.returnTemplate = (req, res) => {
  res.status(401).send({
    message: AUTH_ERROR,
  });
}
