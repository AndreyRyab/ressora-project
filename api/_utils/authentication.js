const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'dev-secret' } = process.env;

const {
  AUTH_ERROR,
} = require('../_errors/messages-constants');

module.exports.auth = (req, res) => {
  if (!req.cookies.jwt) {
    return { authMessage: AUTH_ERROR };
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log('auth ok, payload: ', payload);
  } catch (err) {
    return { authMessage: AUTH_ERROR };
  }
  return payload;
};
