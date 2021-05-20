/*
 * @Author: highsea.高海
 * @Date: 2019-03-12 14:18:05
 * @Copyright(c) QuVideo F2E Team
 * @Email: hai.gao@quvideo.com
 */

const assert = require('assert');
const humps = require('humps');
const { isEmpty, myType, unique, ckObjValue, XError, myCrypto, objPropSort, } = require('@xy/util');
let { autoCrypto, } = myCrypto;
const { conditionConf, sortConf, pageSizeConf, defautlVcmProductId, } = require('../config');

const RegDoc = {
  url: /((http|ftp|https|file):\/\/([\w-]+\.)+[\w-]+(\/[\w\u4e00-\u9fa5\-.?@%!&=+~:#;,]*)?)/,
  shortid: /^[a-zA-Z0-9_-]{7,14}$/,
  nospace: /^\S+$/,
  xs: /(\d+)(px|dp|sp)/,
};
/**
 * 检查是否是 正确的 url
 * @param {String} url
 * @param {Boolean} return
 */
const isUrl = str => {
  return RegExp(RegDoc['url'], 'ig').test(str);
};

/**
 * where sql 拼接
 * @param {Object} where
 */
function whereStr (where) {
  let { wherefield, condition, value, } = where;
  assert.ok(conditionConf.includes(condition), `condition 条件只支持 ${conditionConf.toString()}`);
  if (myType(value) !== 'number') {
    value = '\'' + value + '\'';
  }
  // TODO 整数判断
  return `\`${wherefield}\` ${condition} ${value}`;
}

/**
 * 分页查询条件 sql 拼接 where, order, limit, sort
 * 该函数 错误码可以不用写，因为是内部调用
 *
 * // TODO 配置 表结构字段，防止注入
 * @param {Object} [options={}] - pageSizeSQL.opt配置.
 * @param {Object|Array} [options.where=[{wherefield, condition, value}]] - where条件设置
 * @param {string|Array} [options.order=fields] - order by `aa`,`bb`
 * @param {object|Null} [options.limit={offset, psize}] - limit offset,psize
 * @param {string} [options.sort=asc] - asc,desc
 */
function pageSizeSQL (options) {
  let { where, order, limit, sort, } = options;
  if (sort) {
    assert.ok(sortConf.includes(sort), `排序只支持 ${sortConf.toString()}`);
  }
  let sqlstr = [];
  let whereType = myType(where);
  let orderType = myType(order);
  let limitType = myType(limit);
  // [{wherefield, condition, value}]
  if (whereType === 'array') {
    let temp = [];
    where.forEach(element => {
      temp.push(whereStr(element));
    });
    sqlstr.push('WHERE');
    sqlstr.push(temp.join(' and '));
  } else if (whereType === 'object') {
    sqlstr.push('WHERE');
    sqlstr.push(whereStr(where));
  } else {
    return new XError(25033, `若启用 where（${where}），则其应该是 [{wherefield, condition, value}], 或是 object`);
  }
  // order by fields
  if (orderType === 'string') {
    sqlstr.push('ORDER BY');
    sqlstr.push(`\`${order}\``);
  } else if (orderType === 'array') {
    sqlstr.push('ORDER BY');
    sqlstr.push(order.map(item => '`' + item + '`').toString());
  } else {
    if (order) return new XError(25034, `若启用 order（${order}），则其应该是 [fields], 或是 string`);
  }
  if (sort) sqlstr.push(sort);
  // TODO 拆分 子查询
  sqlstr.push('limit');
  let { defaultPsize, } = pageSizeConf;
  if (limitType === 'object') {
    let { offset, psize, } = limit;
    // TODO 正整数 offset, psize ; 暂采用 前端自己计算 currentPage 模式
    assert.ok(myType(offset) === myType(psize) && myType(psize) === 'number', 'offset psize 应该是 number ');
    sqlstr.push(`${offset},${psize}`);
  } else {
    sqlstr.push(`0,${defaultPsize}`);
  }
  return sqlstr.join(' ');
}

/**
 * 获取产品ID
 * @param {any} ctx
 */
const getProductId = ctx => ctx.header['x-gateway-product'] || ctx.cookies.get('PRODUCT_ID') || defautlVcmProductId;

/**
 * 解析JSON， 如果解析失败则返回提供的默认值
 * @param {string} text
 * @param {object} [defaultValue={}] 默认值
 * @param {Function} cb 错误回调
 */
const parseJSON = (text, defaultValue = {}, cb) => {
  let res = defaultValue;
  try {
    res = JSON.parse(text);
  } catch (error) {
    cb && cb(error);
  }
  return res;
};

/**
 * 获取用户 id
 * @param {*} ctx
 */
const getUserId = ctx => {
  let userId = 0;
  if (ctx.cookies.get('userid')) {
    userId = ctx.cookies.get('userid');
  } else if (ctx.cookies.get('user')) {
    const { user = {}, } = parseJSON(ctx.cookies.get('user'));
    const { id, } = user;
    if (id) {
      userId = id;
    }
  }
  return userId;
};

// const decamelize = (string, options = {}) => {
//   let separator = options.separator || '_';
//   let split = options.split || /(?=[A-Z])/;

//   return string.split(split).join(separator).toLowerCase();
// };

// const paramDecamelize = (data) => {
//   if (typeof data !== 'object') return data;
//   const newObj = {};
//   Object.entries(data).forEach(([ key, value, ]) => {
//     const newKey = decamelize(key);
//     newObj[newKey] = value;
//   });
//   return newObj;
// };

const htmlDecodeByRegExp = str => {
  let temp = '';
  if (str.length === 0) return '';
  temp = str.replace(/&amp;/g, '&');
  temp = temp.replace(/&lt;/g, '<');
  temp = temp.replace(/&gt;/g, '>');
  temp = temp.replace(/&nbsp;/g, ' ');
  temp = temp.replace(/&#39;/g, '\'');
  temp = temp.replace(/&quot;/g, '"');
  return temp;
};

const decamelizeParams = (params = {}) => {
  const map = {};
  const keys = Object.keys(params);
  if (!keys.length) {
    return map;
  }

  keys.forEach(item => {
    const val = params[item];

    if (val !== undefined) {
      const newKey = humps.decamelize(item);
      map[newKey] = val;
    }
  });
  return map;
};

module.exports = {
  RegDoc,
  isUrl,
  isEmpty,
  XError,
  // syncMkdir,
  objPropSort,
  // execPromise,
  unique,
  myType,
  autoCrypto,
  ckObjValue,
  pageSizeSQL,
  getProductId,
  getUserId,
  parseJSON,
  htmlDecodeByRegExp,
  decamelizeParams,
};
