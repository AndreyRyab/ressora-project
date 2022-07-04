const Summary = require('../_models/summary');

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

exports.createSummary = (req, res) => {
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
          message: CONFLICT_ERROR,
        });
      } else {
        return res.status(500).send({
          message: `Ошибка на сервере: ${err.message}`,
        });
      }
    })
};


/* {
  date: '2022-07-01T21:19:20+03:00',
  prod_line: 1,
  created_by: '62aee101ea05f36af609da19',
  updated_by: '62aee101ea05f36af609da19',
  plan:  {
    operation_list: [{
      title: 'Test operation',
      brief: 'Test operation brief',
      quantity: 42,
    }],
  },
  fact: {
    operation_list: [{
      title: 'Test operation fact',
      brief: 'Test operation fact brief',
      quantity: 45,
    }],
  },
} */
