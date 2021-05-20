/*
 * @Author: highsea.高海
 * @Date: 2019-01-14 15:16:29
 * @Copyright(c) QuVideo F2E Team
 * @Email: hai.gao@quvideo.com
 */
'use strict';

const pkginfo = require('../../package.json');
const spec = require('../spec');

/**
 * @swagger
 * /document/info:
 *   get:
 *     tags:
 *       - notUse
 *     summary: __请忽略__ 获取API文档信息.
 *     operationId: getDocumentInfo
 *     responses:
 *       name:
 *         description: 项目名称
 *       version:
 *         description: 版本号
 *       description:
 *         description: 项目描述
 *       author:
 *         description: 项目作者
 */
exports.getApiInfo = ctx => {
  // BUSINESS LOGIC
  const data = {
    name: pkginfo.name,
    version: pkginfo.version,
    description: pkginfo.description,
    author: pkginfo.author,
  };
  ctx.body = data;
};

/**
 * @swagger
 * /document:
 *   get:
 *     tags:
 *       - notUse
 *     summary: __请忽略__ 获取项目API规范.
 *     operationId: getDocumentAll
 *     responses:
 *       all:
 *         description: 所有信息，略
 */
exports.getSwaggerSpec = ctx => {
  ctx.body = spec;
};
