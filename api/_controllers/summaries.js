const moment = require('moment');

const Summary = require('../_models/summary');

const { createChartData } = require('../_utils/create-chart-data');
const { createTotalChartData } = require('../_utils/create-total-chart-data');

const {
  NOT_FOUND,
  CONFLICT_SUMMARY_ERROR,
  BAD_REQUEST,
  AUTH_ERROR,
} = require('../_errors/messages-constants');

exports.createSummary = (req, res) => {
  console.log('contr, createSummary');
  req.body = JSON.parse(req.body);
  if (!req.body.date || !req.body.created_by) {
    return res.status(400).send({ message: BAD_REQUEST });
  }
  Summary.create({
    date: req.body.date,
    prod_line: req.body.prod_line,
    created_by: req.body.created_by,
    updated_by: req.body.updated_by,
    plan: req.body.plan,
    fact: req.body.fact,
  }).then((summary) =>
      res.status(200).send({
        date: summary.date,
        prod_line: summary.prod_line,
        created_by: summary.created_by,
        updated_by: summary.updated_by,
        plan: summary.plan,
        fact: summary.fact,
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({
          message: CONFLICT_SUMMARY_ERROR,
        });
      } else {
        return res.status(500).send({
          message: `Ошибка на сервере: ${err.message}`,
        });
      }
    })
};

exports.updateSummary = (req, res) => {
  console.log('contr, updateSummary');
  const { id, update } = JSON.parse(req.body);
  if (!update) {
    console.log('!update', req.body);
    return res.status(400).send({ message: BAD_REQUEST });
  }
  Summary.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true },
    )
    .then((summary) => {
      if (!summary) {
        return res.status(404).send({ message: NOT_FOUND });
      }
      res.status(200).send(summary);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: BAD_REQUEST });
      } else {
        return res.status(500).send({
          message: `Ошибка на сервере: ${err.message}`,
        });
      }
    })
};

exports.getSummary = (req, res) => {
  req.body = JSON.parse(req.body);
  try {
    if (req.body.method === 'getLastSummaries') {
      console.log('contr, getLastSummaries');
      Summary.find({
        date: {
          $gte: req.body.startPeriod,
          $lt: req.body.endPeriod,
        },
      })
        .then((summaryList) => {
          if (!summaryList.length) {
            return res.status(404).send({ message: NOT_FOUND });
          }
          const lastSummaries = summaryList.slice(-2).reverse();
          const result = [
            { ...createChartData(lastSummaries[0]), date: moment(lastSummaries[0].date).format('DD.MM.YYYY')},
            { ...createChartData(lastSummaries[1]), date: moment(lastSummaries[1].date).format('DD.MM.YYYY')},
          ];
          return res.status(200).send(result);
        });
      return;
    }
    console.log('contr, getCertainSummaries');
    Summary.find({
      date: {
        $gt: req.body.start,
        $lt: req.body.end,
      },
    })
      .then((summaryList) => {
        if (!summaryList.length) {
          return res.status(404).send({ message: NOT_FOUND });
        }

        if (summaryList.length > 2) {
          const result = createTotalChartData(summaryList);
 
          return res.status(200).send(result); 
        }
        const result = createChartData(summaryList[0]);

        return res.status(200).send(result);
      });
  } catch (err) {
    console.log(err.message)
    if (err.name === 'CastError') {
      return res.status(400).send({ message: BAD_REQUEST });
    }
    return res.status(500).send({
      message: `Ошибка на сервере: ${err.message}`,
    });
  }
};

exports.returnTemplate = (req, res) => {
  res.status(401).send({
    message: AUTH_ERROR,
  });
};
