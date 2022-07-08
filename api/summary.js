const { createSummary, updateSummary } = require('./_controllers/summaries');

module.exports = async function(req, res) {
  const authRes = await auth({ ...req }, res);

  if (authRes.authMessage) {
    console.log('user authRes.authMessage: ', authRes.authMessage);
    return returnTemplate(req, res);
  }

  console.log(req.body);
  if (req.body.update) {
    console.log('updateSummary from summary/api');
    req.body = JSON.stringify(req.body);
    return updateSummary(req, res);
  }
  console.log('createSummary from summary/api');
  req.body = JSON.stringify(req.body);
  return createSummary(req, res);
};
