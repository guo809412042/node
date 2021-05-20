const { Op, } = require('sequelize');

const request = require('../common/medi.request');
const { ckObjValue, } = require('../common/utils');
const { svcStatistics, } = require('../services');

/**
 * 获取平台概况
 * @param ctx
 * @returns {Promise<void>}
 */
const getPlatformOverview = async ctx => {
  // const productId = getProductId(ctx);
  let reqData = Object.assign(
    {
      // productId,
    },
    ctx.reqParam.body
  );
  reqData = ckObjValue(reqData);
  // [DOC] http://restapi.quvideo.com/project/652/interface/api/8934
  const res = await request({
    method: 'post',
    url: '/api/rest/manager/feedback/platformInfo',
    data: reqData,
  });

  ctx.body = res.data.data || {};
};

/**
 * 获取人员概况
 * @param ctx
 * @returns {Promise<void>}
 */
const getStaffOverview = async ctx => {
  // const productId = getProductId(ctx);
  let reqData = Object.assign({}, ctx.reqParam.body);
  reqData = ckObjValue(reqData);
  // [DOC] http://restapi.quvideo.com/project/652/interface/api/8936
  const res = await request({
    method: 'post',
    url: '/api/rest/manager/feedback/peopleInfo',
    data: reqData,
  });
  ctx.body = res.data.data || {};
};

/**
 * 获取标签统计
 * @param {*} ctx
 */
const getTagStatistics = async ctx => {
  const {
    startTime,
    endTime,
    countryList,
    lang,
    langList,
    sourceType,
    sourceTypeList,
    isVip,
    productId,
  } = ctx.reqParam.body;

  let whereObj = {
    lang,
    source_type: sourceType,
    is_vip: isVip,
    product_id: productId,
    source_create_time: {},
  };

  whereObj = ckObjValue(whereObj);

  if (startTime) {
    whereObj.source_create_time[Op.gte] = new Date(startTime);
  }

  if (endTime) {
    whereObj.source_create_time[Op.lt] = new Date(endTime);
  }

  if (countryList && countryList.length) {
    whereObj.country = {
      [Op.in]: countryList,
    };
  }

  if (langList && langList.length) {
    whereObj.lang = {
      [Op.in]: langList,
    };
  }

  if (sourceTypeList && sourceTypeList.length) {
    whereObj.source_type = {
      [Op.in]: sourceTypeList,
    };
  }

  const res = await svcStatistics.getStatistics(whereObj);

  ctx.body = res;
};

module.exports = {
  getPlatformOverview,
  getStaffOverview,
  getTagStatistics,
};
