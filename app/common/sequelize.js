const config = require('../config');
const Sequelize = require('sequelize').Sequelize;

const mysqlConf = config.mysql;
const sequelizeConf = config.sequelize;
sequelizeConf['host'] = mysqlConf.host;
// eslint-disable-next-line no-console
sequelizeConf['logging'] = console.log;

// let sequelize = new Sequelize(mysqlConf.database, mysqlConf.user, mysqlConf.password, ...sequelizeConf);
let sequelize = new Sequelize(mysqlConf.database, mysqlConf.user, mysqlConf.password, sequelizeConf);

module.exports = sequelize;
