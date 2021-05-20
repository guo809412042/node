const Joi = require('@hapi/joi');
const { ctlStatistics, } = require('../controllers');

ctlStatistics.getTagStatistics.paramSchema = {
  body: Joi.object().keys({
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    countryList: Joi.array().items(Joi.string()),
    lang: Joi.string(),
    sourceType: Joi.number().integer(),
    isVip: Joi.number().integer(),
    productId: Joi.number().integer(),
  }),
};
