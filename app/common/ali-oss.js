const OSS = require('ali-oss');
const request = require('./medi.request');
const { XError, } = require('./utils');

const ossStore = Symbol('ossStore');
module.exports = class AliOssStore {
  constructor () {
    this[ossStore] = null;
    this.option = null;
    this.init();
  }

  async init () {
    const { data, } = await request({
      method: 'post',
      url: 'http://xy-medi.kakalili.com/api/rest/oss/base/domain',
      data: {
        domain: 'hybrid.xiaoying.tv',
      },
    }).catch(() => {});
    const { accessKey, accessSecret, bucket, securityToken, region, } = data.data || {};
    this.option = {
      region: `oss-${region}`,
      accessKeyId: accessKey,
      accessKeySecret: accessSecret,
      stsToken: securityToken,
      bucket: bucket,
    };
    if (data && data.data) {
      this.getInstance();
    }
  }

  getInstance () {
    if (!this[ossStore]) {
      this[ossStore] = new OSS(this.option);
    }
    return this[ossStore];
  }

  /**
   * 上传文件
   * @param string name 文件名称
   * @param string localPath 本地路径 buffer stream
   */
  async put (name, localPath) {
    if (name && localPath) {
      const result = await this[ossStore]
        .put(name, localPath, {
          headers: {
            'Character-Encoding': 'utf-8',
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8',
          },
        })
        .catch(err => {
          throw new XError(20003, err || '文件链接获取失败');
        });

      return result.url || '';
    }
    return '';
  }
};
