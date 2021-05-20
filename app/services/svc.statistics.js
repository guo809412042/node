const moment = require('moment');
const { IssueTagRecord, } = require('../dao/models');

const getStatistics = async where => {
  const { rows, count, } = await IssueTagRecord.findAndCountAll({ where, raw: true, });
  let statisticsData = {};

  if (rows && rows.length) {
    for (let i = 0; i < rows.length; i++) {
      let currentRecord = rows[i];
      let currentSolvedTime = 0;
      if (currentRecord.source_type === 0 && currentRecord.source_create_time && currentRecord.source_finish_time) {
        currentSolvedTime =
          (moment(currentRecord.source_finish_time).unix() - moment(currentRecord.source_create_time).unix()) / 3600;
      }

      if (!statisticsData[currentRecord.tag_id]) {
        statisticsData[currentRecord.tag_id] = {
          total: 1,
          totalSolvedTime: currentSolvedTime,
          totalSolvedCount: currentSolvedTime ? 1 : 0,
        };
      } else {
        statisticsData[currentRecord.tag_id].total += 1;
        statisticsData[currentRecord.tag_id].totalSolvedTime += currentSolvedTime;
        if (currentSolvedTime) {
          statisticsData[currentRecord.tag_id].totalSolvedCount += 1;
        }
      }
    }
  }

  Object.keys(statisticsData).forEach(k => {
    statisticsData[k].rate = (statisticsData[k].total / count) * 100;
  });
  return statisticsData;
};

module.exports = {
  getStatistics,
};
