const axios = require('axios');
const moment = require('moment');
const env = process.env.NODE_ENV || 'development';
const Apollo = process[env] || {};
const autoWebjsPrefix = Apollo.AUTOJS_WEB || 'https://vcm.quvideo.vip/autojs-web';
// const autofeedbackPrefix = Apollo.AUTOFEEDBACK_NODE || 'http://vcm.quvideo.vip/autofeedback';

const getApplicationProductCount = async list => {
  const opt = {};
  for (let item of list) {
    const { product, source, rate, typeyesorno, } = item;
    const { data, } = await axios({
      method: 'post',
      url: `${autoWebjsPrefix}/appstore/get_view_count`,
      data: {
        product,
        source,
        rate,
        typeyesorno,
        startResponseTime: moment()
          .startOf('month')
          .format('YYYY-MM-DD'),
        endResponseTime: moment()
          .add(1, 'day')
          .format('YYYY-MM-DD'),
      },
    });
    if (data && data.data.length) {
      data.data.forEach(l => {
        const { productId, total, } = l;
        opt[productId] = total;
      });
    }
  }

  return opt;
};

const getApplicationUsersCount = async (config, userEmailDict) => {
  const opt = {};
  const { statusCode, typeCode, responsePeople, startResponseTime, endResponseTime, responseOrType, } = config;
  const { data, } = await axios({
    method: 'post',
    url: `${autoWebjsPrefix}/appstore/get_responsepeople_count`,
    data: {
      statusCode,
      typeCode,
      responsePeople,
      startResponseTime,
      endResponseTime,
      responseOrType,
    },
  });
  if (data && data.data.length) {
    data.data.forEach(l => {
      const { total, } = l;
      opt[userEmailDict[l.responsePeople]] = total;
    });
  }

  return opt;
};

const getEmailCount = async params => {
  const resp = await axios({
    method: 'get',
    url: 'http://vcm.quvideo.vip/autofeedback/feedback/count/',
    params,
  });

  return resp.data.data;
};

const getEmailCountByUser = async params => {
  const resp = await axios({
    method: 'get',
    url: 'http://vcm.quvideo.vip/autofeedback/feedback/count/byUserIds',
    params,
  });

  return resp.data.data;
};

module.exports = {
  getApplicationProductCount,
  getEmailCount,
  getEmailCountByUser,
  getApplicationUsersCount,
};
