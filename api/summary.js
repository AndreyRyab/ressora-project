const { createSummary } = require('./_controllers/summaries');

module.exports = function(req, res) {
  console.log('createSummary from summary/api');
  req.body = JSON.stringify(req.body);
  return createSummary(req, res);
};
