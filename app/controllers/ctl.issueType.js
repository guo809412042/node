const request = require('../common/medi.request');
const { getProductId, ckObjValue, } = require('../common/utils');

/**
 * 获取问题类型配置列表
 * @param ctx
 * @returns {Promise<void>}
 */
const getList = async ctx => {
  const productId = getProductId(ctx);
  const reqData = Object.assign(
    {
      productId,
    },
    ctx.reqParam.query
  );
  const res = await request({
    method: 'post',
    url: '/api/rest/manager/feedback/getIssueType',
    data: ckObjValue(reqData),
  });
  ctx.body = {
    list: res.data.data,
  };
  // ctx.body = {
  //   list: mockData,
  // };
};

/**
 * 创建问题类型和预设回复
 * @param ctx
 * @returns {Promise<void>}
 */
const create = async ctx => {
  const productId = getProductId(ctx);
  const reqData = Object.assign(
    {
      productId,
    },
    ctx.reqParam.body
  );
  const { lang, countryCode, title, type, issueReply, productId: curProductId, } = reqData;
  // [DOC] http://restapi.quvideo.com/project/652/interface/api/8698
  if (Array.isArray(countryCode)) {
    let resArr = [];
    for (let code of countryCode) {
      const res = await request({
        method: 'post',
        url: '/api/rest/manager/feedback/addIssueType',
        data: {
          productId: curProductId,
          lang: `${lang}_${code}`,
          countryCode: code,
          title,
          type,
          issueReply,
        },
      });
      resArr.push(res.data);
    }
    ctx.body = resArr;
  } else {
    const res = await request({
      method: 'post',
      url: '/api/rest/manager/feedback/addIssueType',
      data: reqData,
    });
    ctx.body = res.data;
  }
};

/**
 * 更新问题类型和预设回复
 * @param ctx
 * @returns {Promise<void>}
 */
const update = async ctx => {
  const productId = getProductId(ctx);
  const reqData = Object.assign(
    {
      productId,
    },
    ctx.reqParam.body
  );
  const { lang, countryCode, title, type, issueReply, id, productId: curProductId, } = reqData;
  // [DOC] http://restapi.quvideo.com/project/652/interface/api/8701
  if (Array.isArray(countryCode)) {
    let resArr = [];
    for (let code of countryCode) {
      const res = await request({
        method: 'post',
        url: '/api/rest/manager/feedback/updateIssueType',
        data: {
          id,
          productId: curProductId,
          lang: `${lang}_${code}`,
          countryCode: code,
          title,
          type,
          issueReply,
        },
      });
      resArr.push(res.data);
    }
    ctx.body = resArr;
  } else {
    const res = await request({
      method: 'post',
      url: '/api/rest/manager/feedback/updateIssueType',
      data: reqData,
    });
    ctx.body = res.data;
  }
};

/**
 * 删除
 * @param ctx
 * @returns {Promise<void>}
 */
const remove = async ctx => {
  const id = ctx.params.id;
  const productId = getProductId(ctx);
  const reqData = Object.assign(
    {
      productId,
    },
    ctx.reqParam.query,
    {
      id,
      isDelete: 1,
    }
  );
  // [DOC] http://restapi.quvideo.com/project/652/interface/api/8701
  const res = await request({
    method: 'post',
    url: '/api/rest/manager/feedback/updateIssueType',
    data: reqData,
  });
  ctx.body = res.data;
};

module.exports = {
  getList,
  create,
  update,
  remove,
};
