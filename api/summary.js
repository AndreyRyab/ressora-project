const { createSummary, updateSummary, getSummary } = require('./_controllers/summaries');
const { auth } = require('./_utils/authentication');

module.exports = async function(req, res) {
  const authRes = await auth({ ...req }, res);

  if (authRes.authMessage) {
    console.log('user authRes.authMessage: ', authRes.authMessage);
    return returnTemplate(req, res);
  }

  /* console.log(JSON.stringify(req.body)); */
  /* req.body = JSON.stringify(req.body); */

  if (req.body.method === 'getCurrentSummary' || req.body.method === 'getCertainSummaries') {
    console.log('getCurrentSummary/getCertainSummaries from summary/api');
    req.body = JSON.stringify(req.body);
    console.log('req.body:', req.body);
    return getSummary(req, res);
  }
  if (req.body.method === 'updateSummary') {
    console.log('updateSummary from summary/api');
    req.body = JSON.stringify(req.body);
    return updateSummary(req, res);
  }
  console.log('createSummary from summary/api');
  req.body = JSON.stringify(req.body);
  return createSummary(req, res);
};
