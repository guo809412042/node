/*
 * @Date: 2020-09-29 13:46:01
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2020-11-02 10:31:19
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
const axios = require('axios');

const env = process.env.NODE_ENV || 'development';
const Apollo = process[env] || {};
const { googleKey, } = require('../config/index');
const { htmlDecodeByRegExp, } = require('../common/utils');

const googleTranslate = async (text, target, source) => {
  let res = await axios.post(`https://translation.googleapis.com/language/translate/v2?key=${googleKey}`, {
    q: text,
    target,
    source,
    // model: 'base',
  });
  let returnList = [];
  res.data.data.translations.map(d => {
    returnList.push(htmlDecodeByRegExp(d.translatedText));
  });
  return returnList;
};

const googleTranslate2 = async (text, target, source, key) => {
  let res = await axios.post(`${Apollo.VCM_GOOGLE_NODE}/vcm-google/api/common/translate2`, {
    text,
    target,
    source,
    key,
    // model: 'base',
  });
  return htmlDecodeByRegExp(res);
};

module.exports = {
  googleTranslate,
  googleTranslate2,
};
