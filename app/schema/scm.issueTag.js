const Joi = require('@hapi/joi');
const { ctlIssueTag, } = require('../controllers');

ctlIssueTag.updateRecord.paramSchema = {
  body: Joi.object().keys({
    id: Joi.required(),
  }),
};
