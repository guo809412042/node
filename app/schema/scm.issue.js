const Joi = require('@hapi/joi');
const { ctlIssue, } = require('../controllers');

ctlIssue.getList.paramSchema = {
  body: Joi.object().keys({
    current: Joi.number()
      .integer()
      .default(1),
    pageSize: Joi.number()
      .integer()
      .default(10),
    orderField: Joi.number()
      .integer()
      .default(3),
    orderType: Joi.number()
      .integer()
      .default(2),
  }),
};
