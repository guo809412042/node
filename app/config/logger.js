/*
 * @Author: highsea.高海
 * @Date: 2019-01-14 10:14:05
 * @Copyright(c) QuVideo F2E Team
 * @Email: hai.gao@quvideo.com
 */
// https://github.com/posquit0/koa-rest-api-boilerplate

'use strict';

const path = require('path');
const { env, name, } = require('./');

const directory = process.env.LOG_DIRECTORY || path.join(__dirname, '../../');
const filename = process.env.LOG_FILENAME || `${name}.${env}.json.log`;

const config = {
  name,
  streams: [],
};

// Add streams as depending on the environment
if (env === 'production') {
  config.streams.push({
    type: 'rotating-file',
    path: path.join(directory, filename),
    period: '1d',
    count: 7,
    level: process.env.LOG_LEVEL || 'info',
  });
  config.streams.push({
    type: 'stream',
    stream: process.stderr,
    level: 'warn',
  });
} else if (env === 'development') {
  config.streams.push({
    type: 'stream',
    stream: process.stdout,
    level: 'debug',
  });
}

module.exports = config;
