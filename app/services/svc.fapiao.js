const { Op, } = require('sequelize');
const assert = require('assert');
const { XError, } = require('../common/utils');
const { FapiaoInvoice, } = require('../dao/models');
const { RedisStore, } = require('../common/redis.orm');
const { redis, } = require('../config');

const Redis = new RedisStore(redis);

/**
 * 获取发票订单信息
 * @param {Object}
 * @property {number} data.productId 产品Id
 * @property {number} data.platform 平台
 * @property {number} data.status 状态 1:未处理 2:已核对 3:处理中 4:已处理
 * @property {number} data.type 抬头类型 1: 企业 2: 个人
 * @property {Array} data.title 发票抬头
 * @property {Array} data.orderId 订单ID
 * @property {Array} data.taxNumber 税号
 * @property {Array} data.email 邮箱
 * @property {Array} data.auid 用户ID
 */
const getList = async data => {
  const { productId, platform, status, type, title, orderId, taxNumber, email, auid, } = data;
  const where = {};
  if (productId) {
    where.product_id = productId;
  }
  if (platform) where.platform = platform;
  if (status) where.status = status;
  if (type) where.type = type;
  if (title) {
    where.title = {
      [Op.or]: title,
    };
  }
  if (orderId) {
    let orList = orderId.map(item => {
      return {
        order_id: {
          [Op.substring]: item,
        },
      };
    });
    where[Op.or] = orList;
  }
  if (taxNumber) {
    where.tax_number = {
      [Op.or]: taxNumber,
    };
  }
  if (email) {
    where.email = {
      [Op.or]: email,
    };
  }
  if (auid) {
    where.auid = {
      [Op.or]: auid,
    };
  }

  const res = await FapiaoInvoice.findAndCountAll({ where, order: [ [ 'id', 'DESC', ], ], });
  return res;
};

/**
 * 创建
 * @param {Object} data
 * @property {string} data.auid 用户id
 * @property {number} data.platform 平台
 * @property {string} data.orderType 会员类型
 * @property {string} data.orderId 订单ID
 * @property {number} data.amount 订单金额
 * @property {string} data.orderChannel 支付渠道
 * @property {number} data.type 抬头类型 1：企业 2：个人
 * @property {string} data.title 发票抬头
 * @property {string=} data.taxNumber 公司税号
 * @property {string} data.email 邮箱
 * @property {string=} data.orderImg iOS订单截图
 * @property {string=} data.address 公司地址
 * @property {string=} data.telphone 公司电话
 * @property {string=} data.bankName 开户银行
 * @property {string=} data.bankNumber 开户行账号
 * @property {string=} data.remark 补充说明
 */
const create = async data => {
  const {
    productId,
    auid,
    platform,
    orderType,
    orderId,
    amount,
    orderChannel,
    type,
    title,
    taxNumber,
    email,
    orderImg,
    address,
    telphone,
    bankName,
    bankNumber,
    remark,
  } = data;

  // 由于安卓用户申请发票属于系统已审核，该类申请提交后的状态为“已核对”，即 status = 2
  const info = {
    product_id: productId,
    auid,
    order_type: orderType,
    order_id: orderId,
    amount,
    order_channel: orderChannel,
    platform,
    type,
    title,
    email,
    status: Number(platform) === 1 ? 2 : 1,
  };

  if (taxNumber) info.tax_number = taxNumber;
  if (orderImg) info.order_img = orderImg;
  if (address) info.address = address;
  if (telphone) info.telphone = telphone;
  if (bankName) info.bank_name = bankName;
  if (bankName) info.bank_number = bankNumber;
  if (remark) info.remark = remark;
  const baseWhere = {
    order_id: orderId,
  };
  if (auid) {
    Object.assign(baseWhere, {
      auid,
    });
  }
  // 同一个用户相同订单不能重复提交
  const isExist = await FapiaoInvoice.findOne({
    where: baseWhere,
    raw: true,
  });
  assert.ok(!isExist, new XError(20005, '该订单已经提交过'));

  const res = await FapiaoInvoice.create(info);
  return res;
};

/**
 * 批量创建
 * @param {*}
 */
const bulkCreate = async dataList => {
  const createList = dataList.map(item => {
    const {
      productId,
      auid,
      platform,
      orderType,
      orderId,
      amount,
      orderChannel,
      type,
      title,
      taxNumber,
      email,
      orderImg,
      address,
      telphone,
      bankName,
      bankNumber,
      remark,
    } = item;
    const info = {
      product_id: productId,
      auid,
      order_type: orderType,
      order_id: orderId,
      amount,
      order_channel: orderChannel,
      platform,
      type,
      title,
      email,
      status: 2,
    };

    if (taxNumber) info.tax_number = taxNumber;
    if (orderImg) info.order_img = orderImg;
    if (address) info.address = address;
    if (telphone) info.telphone = telphone;
    if (bankName) info.bank_name = bankName;
    if (bankName) info.bank_number = bankNumber;
    if (remark) info.remark = remark;

    return info;
  });

  const result = await FapiaoInvoice.bulkCreate(createList);
  return result;
};

/**
 * 修改
 * @param {Object} data
 * @property {Array} data.ids 修改ids
 * @property {status} data.status 状态 1: 待处理 2: 已核对 3: 已处理
 */
const edit = async ({ ids, status, }) => {
  const where = {
    id: ids,
  };
  const res = await FapiaoInvoice.update({ status, }, { where, });
  return res;
};

/**
 * 设置开发票H5的过期时间
 * @param {*}
 */
const setExpireTime = async (issueId, duration) => {
  const KEY = `FAPIAO_${issueId}`;
  const res = await Redis.set(true, { sid: KEY, maxAge: duration, });
  return res;
};

/**
 * 判断开发票H5是否过期
 * @param {number} issueId 工单id 判断是否过期
 */
const isExpired = async issueId => {
  const KEY = `FAPIAO_${issueId}`;
  const res = await Redis.get(KEY);
  return !!res;
};

module.exports = {
  getList,
  create,
  bulkCreate,
  edit,
  setExpireTime,
  isExpired,
};
