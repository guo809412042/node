/*
 * @Author: highsea.高海
 * @Date: 2019-05-12 17:40:57
 * @Copyright(c) QuVideo F2E Team
 * @Email: hai.gao@quvideo.com
 */

'use strict';

const {
  MysqlExt,
  // MysqlCon,
} = require('@xy/orm');

const config = require('../config');
const INIT = Symbol('INIT');
const MYSQL = Symbol('MYSQL');

/**
 * mysql DAO 初始化公共mysql链接
 * ```js
 * const BaseDao = require('{path}/base');
 * const myDao = new BaseDao();
 * // 默认配置读取 config.mysql {
 * //  host: 'localhost',
 * //  user: 'root',
 * //  database: 'center',
 * //  password: ''
 * // }
 * // let [ res ] = await myDao.query('select ?+? as ??', [1, 2, temp]);
 * // res.temp ~ 3
 *```
 * @class Dao
 */
class Dao {
  /**
   * Creates an instance of Dao.
   * escape 待定义
   * @param {*} mysqlOpts
   * @memberof Dao
   */
  constructor (mysqlOpts) {
    this.mysqlOpts = mysqlOpts || config.mysql;
    this.insertSQL = 'insert into ?? set ?';
    this.insertAllSQL = 'insert into ?? (??) values ?';
    this.updateSQL = 'update ?? set ?? = ? where ?? = ?';
    this.selectSQL = 'select ?? from ?? where ?? = ?';
    this.deleteSql = 'delete from ?? where ?? = ?';
    this.logger = this.mysqlOpts.logger || console;
    // 开发环境 输出 SQL 日志
    if (config.debug) this.mysqlOpts['debug'] = true;
    this[INIT](this.mysqlOpts);
  }

  async [INIT] (opt) {
    if (this[MYSQL]) return this[MYSQL];
    this[MYSQL] = new MysqlExt(opt);
    return this[MYSQL];
  }

  get mysql () {
    return this[MYSQL];
  }

  async query (sql, values = []) {
    let res = await this.mysql.query(this.mysql.format(sql, values));
    return res;
  }
}

module.exports = Dao;
