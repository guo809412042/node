const Joi = require('@hapi/joi');
const { ctlIssueKnowledge, } = require('../controllers');

ctlIssueKnowledge.getList.paramSchema = {
  query: Joi.object().keys({
    current: Joi.number()
      .integer()
      .default(1),
    pageSize: Joi.number()
      .integer()
      .default(10),
    tag: Joi.string().allow(''),
    text: Joi.string().allow(''),
  }),
};

ctlIssueKnowledge.create.paramSchema = {
  body: Joi.object().keys({
    tag: Joi.string().required(),
    title: Joi.string().required(),
    keywords: Joi.string().required(),
    content: Joi.string().required(),
    comment: Joi.string().allow(''),
  }),
};

ctlIssueKnowledge.update.paramSchema = {
  body: Joi.object().keys({
    tag: Joi.string(),
    title: Joi.string(),
    keywords: Joi.string(),
    content: Joi.string(),
    comment: Joi.string().allow(''),
  }),
};

ctlIssueKnowledge.remove.paramSchema = {
  body: Joi.object().keys({
    id: Joi.required(),
  }),
};

ctlIssueKnowledge.createTag.paramSchema = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    parentId: Joi.number()
      .integer()
      .default(0),
  }),
};

// ctlIssueKnowledge.getTags.paramSchema = {
//   query: Joi.object().keys({
//     parentId: Joi.number()
//       .integer()
//       .default(0),
//   }),
// };

ctlIssueKnowledge.getLogs.paramSchema = {
  query: Joi.object().keys({
    knowledgeId: Joi.number()
      .integer()
      .required(),
  }),
};
