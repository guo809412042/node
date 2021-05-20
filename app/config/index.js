/*
 * @Author: highsea.高海
 * @Date: 2019-03-12 14:17:40
 * @Copyright(c) QuVideo F2E Team
 * @Email: hai.gao@quvideo.com
 */
// http://nodejs.cn/api/errors.html#errors_common_system_errors
'use strict';

const path = require('path');

const APP_PORT = process.env.APP_PORT || 80;
const APP_HOST = process.env.APP_HOST || '0.0.0.0';

const env = process.env.NODE_ENV || 'development';
const name = process.env.APP_NAME || 'vcm-tool-issue-nodejs';
const { version, } = require('../../package.json');
const eamilHost = 'quvideo.com';
const Apollo = process[env] || {};
const isMonitor = [ 'production', 'daily', ].includes(env);
// 获取注入的 Apollo 配置
// const Apollo = process[env] || {};
const AplMysqlConf = {
  database: Apollo.VCM_POWER_DB_NAME || 'xiaoyingpower',
  user: Apollo.VCM_POWER_DB_USER || 'xiaoyingtv',
  password: Apollo.VCM_POWER_DB_PS || 'Quvideo2012',
  host: Apollo.VCM_POWER_DB_HOST || 'rm-uf69q361pp76n4eew.mysql.rds.aliyuncs.com',
  port: 3306,
};

const AplRedisConf = {
  host: Apollo.VCM_PROXY_REDIS_HOST || '127.0.0.1',
  password: Apollo.VCM_PROXY_REDIS_PS || '123456',
  port: Apollo.VCM_PROXY_REDIS_PORT,
  family: 4,
  ttl: 3600,
};

const configs = {
  base: {
    env,
    name,
    version,
    apolloConf: global.apolloConf,
    eamilHost,
    isMonitor,
    apiToken: Apollo.DEFAULT_AUTHORIZATION_TOKEN,
    googleKey: Apollo.Google_API_KEY || 'AIzaSyDEb-cs9-7wh48HE-Axbu8okhLB9xx4GLo',
    // 默认产品
    defautlVcmProductId: 2,
    // 按不同区-环境生成配置 或只设置一个监控地址，看日志信息区分
    sentryDns: 'https://2024e89ea061445896b5648a01970486@vcm-sentry.api.xiaoying.co/79',
    host: APP_HOST,
    port: 5000,
    mysql: {
      database: 'tool-issue',
      user: 'root',
      password: '123456',
      host: 'localhost',
      port: 3306,
    },
    // 用于 Docker-compose 部署
    // mysql: {
    //   database: 'vcm_video_info',
    //   user: 'root',
    //   password: '',
    //   host: 'mysql-db',
    //   port: 3308,
    // },
    sequelize: {
      dialect: 'mysql',
      dialectOptions: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        supportBigNumbers: true,
        bigNumberStrings: true,
      },
      pool: {
        max: 5,
        min: 0,
        idle: 30000,
      },
    },
    // 用于 session 持久化
    redis: {
      port: 6379,
      host: 'localhost',
      family: 4,
      // password: '',
      // db: 0,
      ttl: 3600,
    },
    // 用于 处理 数据缓存
    redisCluster: [
      {
        host: '10.0.34.16',
        port: '6379',
      },
    ],
    // 前缀开头末尾需要加 '/'
    urlPrefix: {
      a: '/api/',
      b: '/',
      d: '/document/',
    },
    debug: !env || [ 'development', 'base', ].includes(env),
    fileNameMaxLenth: 300,
    pathFile: process.cwd(),
    // TODO 设置 没有静态资源的目录，用于文件存储，但不能被用于静态资源预览
    packageAssets: path.join('public', 'assets'),
    assetsWebUrl: 'assets',
    viewsDir: 'views',
    // salt + proj name + env
    secret: 'saltkey' + name + env,
    // 在浏览器中显示的 文件最小大小 kb
    // fileShowBrowserSize: 200,
    fileNotFound: {
      ENOENT: true,
      ENAMETOOLONG: true,
      ENOTDIR: true,
    },
    videoAudioExt: [
      'avi',
      'rmvb',
      'rm ',
      'asf',
      'divx',
      'mpg',
      'mpeg',
      'mpe',
      'wmv',
      'mp4',
      'mkv',
      'vob',
      'mov',
      'rmvb',
      'asf',
      '3gp',
      'ogg',
      'mp3',
      'pcm',
      'flv',
      'webm',
      'wav',
      'oga',
      'ogv',
    ],
    conditionConf: [ '>', '<', '=', '>=', '<=', ],
    sortConf: [ 'DESC', 'ASC', 'desc', 'asc', ],
    pageSizeConf: {
      defaultPsize: 10,
      defaultCurrent: 1,
    },
  },

  production: {
    port: APP_PORT,
    host: APP_HOST,
    mysql: AplMysqlConf,
    redis: AplRedisConf,
    redisCluster: [ AplRedisConf, ],
  },

  // 用于 持续集成： gitlab-ci.yml 执行
  development: {
    port: APP_PORT,
    host: APP_HOST,
    mysql: AplMysqlConf,
    redis: AplRedisConf,
    redisCluster: [ AplRedisConf, ],
  },

  test: {
    port: APP_PORT,
    host: APP_HOST,
    mysql: AplMysqlConf,
    redis: AplRedisConf,
    redisCluster: [ AplRedisConf, ],
  },
};
const config = Object.assign(configs.base, configs[env]);

module.exports = config;
