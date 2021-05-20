// 该库核心函数已经 3年未更新 https://github.com/koajs/sendfile/blob/master/index.js

const extname = require('path').extname;
const calculate = require('./etag');
const fs = require('fs');
const { fileNotFound, } = require('../config');

const sendfile = async (ctx, path) => {
  return stat(path).then(async stats => {
    if (!stats) return null;
    if (!stats.isFile()) return stats;

    ctx.response.status = 200;
    ctx.response.lastModified = stats.mtime;
    ctx.response.length = stats.size;
    ctx.response.type = extname(path);
    if (!ctx.response.etag) {
      ctx.response.etag = calculate(stats, {
        weak: true,
      });
    }

    // fresh based solely on last-modified
    let fresh = ctx.request.fresh;
    switch (ctx.request.method) {
      case 'HEAD':
        ctx.response.status = fresh ? 304 : 200;
        break;
      case 'GET':
        if (fresh) {
          ctx.response.status = 304;
        } else {
          ctx.body = await fs.createReadStream(path);
        }
        break;
    }

    return stats;
  }, onstaterror);
};

function onstaterror (err) {
  if (fileNotFound[err.code]) return;
  err.status = 500;
  throw err;
}

function stat (path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) reject(err);
      resolve(stats);
    });
  });
}

module.exports = sendfile;
