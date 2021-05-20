const assert = require('assert');
const { Op, } = require('sequelize');
const nodeFetch = require('node-fetch');
const env = process.env.NODE_ENV || 'development';
const Apollo = process[env] || {};
const ghReportPrefix = Apollo.GHREPORT_PREFIX || 'https://gh.quvideo.com';
const { ghAutoRequirement, ghAutoRequirementRelSql, ghAutoRequirementRelModule, } = require('../dao/models');
const { XError, decamelizeParams, } = require('../common/utils');

const updateRequirement = async params => {
  const { name, link, userId, id, } = params;
  try {
    if (id) {
      await ghAutoRequirement.update(
        {
          name,
          link,
          m_user_id: userId,
        },
        {
          where: { id, },
        }
      );
    } else {
      await ghAutoRequirement.create({
        name,
        link,
        c_user_id: userId,
        m_user_id: userId,
      });
    }
  } catch (e) {
    const { message = '', } = e.errors[0] || {};
    let msg = '保存失败';
    if (/uniq_name/gi.test(message)) {
      msg = '需求名称不能重复';
    }
    assert(false, new XError(50000, msg));
  }
  return 'ok';
};

const getRequirementList = async params => {
  const { name, pageSize, pageNo, } = params;
  const where = {};
  const limit = +pageSize || 10;
  const offset = limit * Math.max(+pageNo - 1, 0);

  if (name) {
    Object.assign(where, {
      name: {
        [Op.like]: `%${name.trim()}%`,
      },
    });
  }
  const record = await ghAutoRequirement.findAndCountAll({
    where,
    limit,
    offset,
    order: [ [ 'ctime', 'DESC', ], ],
  });
  return record;
};

// 页面sql配置
const updateSqlSetting = async params => {
  const { id, userId, ...rest } = params;
  const formatMap = decamelizeParams(rest);

  try {
    if (id) {
      await ghAutoRequirementRelSql.update(
        {
          ...formatMap,
          m_user_id: userId,
        },
        {
          where: {
            id,
          },
        }
      );
    } else {
      await ghAutoRequirementRelSql.create({
        ...formatMap,
        m_user_id: userId,
        c_user_id: userId,
      });
    }
  } catch (e) {
    assert(false, new XError(50000, '保存失败, 检验参数是否正确'));
  }
  return 'ok';
};

const getRequirementSqlList = async params => {
  const where = decamelizeParams(params);
  const record = await ghAutoRequirementRelSql.findAndCountAll({
    where,
    order: [ [ 'ctime', 'ASC', ], ],
  });

  return record;
};

const handleSqlContent = async params => {
  const { requirementId, moduleId, invalid = 1, compId, } = params;
  const resp = await ghAutoRequirementRelSql.findOne({
    where: {
      requirement_id: requirementId,
      module_id: moduleId,
      invalid,
      ...(compId ? { module_detail_id: compId, } : {}),
    },
  });
  if (resp) {
    return resp.toJSON();
  }
  return null;
};

const handleSqlWithParams = params => {
  const { baseSql, querySchema = [], filterParams = {}, } = params;
  let sql = baseSql;
  const map = {};

  querySchema.forEach(item => {
    const { type, match, list, } = item;
    let whereStr = '';
    list.forEach(l => {
      const { name, connectSymbol, mapKey, } = l;
      const curName = mapKey || name;
      if (filterParams[curName]) {
        if (+type === 1) {
          whereStr = filterParams[curName];
        } else {
          switch (+connectSymbol) {
            case 1:
              whereStr += ` AND ${name} = ${filterParams[curName]}`;
              break;
            case 2:
              whereStr += ` AND ${name} > ${filterParams[curName]}`;
              break;
            case 3:
              whereStr += ` AND ${name} < ${filterParams[curName]}`;
              break;
            case 4:
              whereStr += ` AND ${name} >= ${filterParams[curName]}`;
              break;
            case 5:
              whereStr += ` AND ${name} <= ${filterParams[curName]}`;
              break;
            case 6:
              whereStr += ` AND ${name} <> ${filterParams[curName]}`;
              break;
            case 7:
              const [ startTime, endTime, ] = filterParams[curName] || [];
              if (startTime && endTime) {
                whereStr += ` AND ${name} > "${startTime}"`;
                whereStr += ` AND ${name} < "${endTime}"`;
              }
              break;
          }
        }
      }
    });
    map[match] = whereStr;
  });
  Object.keys(map).forEach(key => {
    sql = sql.replaceAll(`#{${key}}`, map[key] || '');
  });
  return sql;
};

const getGhData = async params => {
  const { requirementId, moduleId, filterParams, moduleDetailId, compId, } = params;
  const respData = await handleSqlContent({
    requirementId,
    moduleId,
    moduleDetailId,
    compId,
  });
  const { base_sql, query_schema, } = respData || {};
  assert(respData && base_sql, new XError(60000, '没有找到关联的sql配置'));
  const formatSql = handleSqlWithParams({
    baseSql: base_sql,
    querySchema: query_schema,
    filterParams,
  });
  const resp = await nodeFetch(`${ghReportPrefix}/v1/query`, {
    method: 'POST',
    body: JSON.stringify({ sql: formatSql, }).replace(/\+/g, 'self_plus'),
  });
  const respBody = await resp.json();
  const { className, } = respBody[0] || {};
  assert(!className, new XError(60000, '请检查sql语法是否有问题'));
  return respBody;
};

// 页面组件配置
const updateModuleSetting = async params => {
  const { id, userId, ...rest } = params;
  const formatMap = decamelizeParams(rest);

  try {
    if (id) {
      await ghAutoRequirementRelModule.update(
        {
          ...formatMap,
          m_user_id: userId,
        },
        {
          where: {
            id,
          },
        }
      );
    } else {
      await ghAutoRequirementRelModule.create({
        ...formatMap,
        m_user_id: userId,
        c_user_id: userId,
      });
    }
  } catch (e) {
    const { message = '', } = e.errors[0] || {};
    assert(false, new XError(50000, message || '保存失败, 检验参数是否正确'));
  }
  return 'ok';
};

const getRequirementModuleList = async params => {
  const where = decamelizeParams(params);
  const record = await ghAutoRequirementRelModule.findAndCountAll({
    where,
    order: [ [ 'ctime', 'ASC', ], ],
  });
  const { count, rows, } = record;
  const list = [];
  if (count > 0) {
    rows.forEach(item => {
      const { component_schema = {}, default_query, name, type, id, } = item;
      list.push({
        id,
        moduleType: type,
        name,
        compType: component_schema.compType,
        children: component_schema.children,
        default_query: default_query,
      });
    });
  }
  return list;
};

module.exports = {
  updateRequirement,
  getRequirementList,
  updateSqlSetting,
  getRequirementSqlList,
  updateModuleSetting,
  getGhData,
  getRequirementModuleList,
};
