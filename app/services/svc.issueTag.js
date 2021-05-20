const { IssueTagRecord, } = require('../dao/models');

const createIssueTagRecord = async data => {
  return IssueTagRecord.create(data);
};

const createOrUpdateTagRecord = async data => {
  const { source_id, source_type, } = data;
  const record = await IssueTagRecord.findOne({
    where: {
      source_id,
      source_type,
    },
  });
  if (!record) {
    return createIssueTagRecord(data);
  } else {
    return updateIssueRageRecord(record.id, data);
  }
};

const updateIssueRageRecord = async (id, data) => {
  return IssueTagRecord.update(data, { where: { id, }, });
};

module.exports = {
  createOrUpdateTagRecord,
  createIssueTagRecord,
  updateIssueRageRecord,
};
