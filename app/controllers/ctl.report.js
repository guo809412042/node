/*
 * @Author: yangyang.zhang 张洋洋
 * @Date: 2020-07-22 14:57:56
 * @Company: Copyright(c) QuVideo F2E Team
 * @Email: yangyang.zhang@quvideo.com
 */
const moment = require('moment');
// const AliOss = require('../common/ali-oss');
// const xlsx = require('node-xlsx');
const { svcReport, svcApplication, } = require('../services');
// const aliOssStore = new AliOss();

const userDict = {
  3761: '星星',
  3762: '梦亚',
  3763: '帆帆',
  3865: '伟鑫',
  3866: '梦迪',
  3867: '若彤',
  4013: '萌萌',
  4052: '赛赛',
  4112: '文笑',
  4140: '李金',
};
const userList = Object.keys(userDict).map(Number);
const userEmailDict = {
  'lixingxing@quvideo.com': 3761,
  'wangmengya@quvideo.com': 3762,
  'zhoufanfan@quvideo.com': 3763,
  'gaoweixin@quvideo.com': 3865,
  'zhaomengdi@quvideo.com': 3866,
  'chenruotong@quvideo.com': 3867,
  'zhangsaisai@silvermail.com.cn': 4052,
  'zhaomengmeng@silvermail.com.cn': 4013,
  'cuiwenxiao@silvermail.com.cn': 4112,
  'lijin@silvermail.com.cn': 4140,
};
const userEmailDictList = Object.keys(userEmailDict);

const productList = [
  {
    name: '小影\t',
    productId: '2',
    countryList: [ 'CN', 'US', 'JP', 'KR', 'TW', 'TH', 'IN', 'ID', 'BR', 'RU', 'IR', ],
  },
  {
    name: 'tempo(重点)',
    productId: '10',
    countryList: [ 'CN', 'US', 'GB', 'TW', 'RU', 'BR', 'ID', ],
  },
  {
    name: 'tempo(全球)',
    productId: '10',
    countryList: '',
  },
  {
    name: '甜影\t',
    productId: '16',
    countryList: '',
  },
  {
    name: '简拍\t',
    productId: '3',
    countryList: '',
  },
  { name: 'vivacut\t', productId: '15', countryList: [ 'CN', 'US', ], },
];

const applicationProductList = [
  {
    product: '2,10,15',
    rate: '1,2,3,4',
    typeyesorno: 'no',
    source: 'appstore,google,huawei',
  },
  {
    product: '3,16',
    source: 'appstore',
    rate: '1,2,3,4',
    typeyesorno: 'no',
    country: 'CN',
  },
];

/**
 * 格式化缩进
 * @param {number} num 输入数量
 */
const tabNum = num => {
  const len = num.toString().length;
  const base = '\t';
  switch (len) {
    case 1:
    case 2:
    case 3:
      return base + '\t';
    default:
      return base;
  }
};

/**
 * 今日业务数据播报
 * @param {*} ctx
 */
const sendPeopleReport = async ctx => {
  const startDayTime = moment()
    .startOf('day')
    .toDate();
  const endDayTime = moment()
    .endOf('day')
    .toDate();
  const startMonthTime = moment()
    .startOf('month')
    .toDate();
  const endMonthTime = moment()
    .endOf('month')
    .toDate();

  const reqData = {
    operateNameList: userList,
    searchInfoType: '1',
  };
  // 工单处理量月总量
  const mounthIssueNumOpt = {};
  const monthList = await svcReport.getPeopleInfo(
    Object.assign({}, reqData, {
      startTime: startMonthTime,
      endTime: endMonthTime,
    })
  );
  for (const v of monthList) {
    const userId = v.operateName;

    mounthIssueNumOpt[userId] = v.processingIssue + v.solvedIssue;
  }

  // 工单处理量单日量
  const dayNumOpt = {};
  const dayList = await svcReport.getPeopleInfo(
    Object.assign({}, reqData, {
      startTime: startDayTime,
      endTime: endDayTime,
    })
  );
  for (const v of dayList) {
    const userId = v.operateName;
    dayNumOpt[userId] = v.processingIssue + v.solvedIssue;
  }
  // 邮件单日
  const emailUsersCount = await svcApplication.getEmailCountByUser({
    replyStartDate: moment().format('YYYY-MM-DD'),
    replyEndDate: moment()
      .add(1, 'day')
      .format('YYYY-MM-DD'),
    userIds: userList.join(','),
  });
  // 邮件月
  const mounthEmailCountOpt = await svcApplication.getEmailCountByUser({
    replyStartDate: moment()
      .startOf('month')
      .format('YYYY-MM-DD'),
    replyEndDate: moment()
      .endOf('month')
      .format('YYYY-MM-DD'),
    userIds: userList.join(','),
  });
  // 商城回复量单日
  const appReplyCountOpt = await svcApplication.getApplicationUsersCount(
    {
      statusCode: '2',
      responsePeople: userEmailDictList.join(','),
      startResponseTime: moment().format('YYYY-MM-DD'),
      endResponseTime: moment()
        .add(1, 'day')
        .format('YYYY-MM-DD'),
      responseOrType: 'response',
    },
    userEmailDict
  );
  // 商城回复量 月
  const mounthReplyCountCountOpt = await svcApplication.getApplicationUsersCount(
    {
      statusCode: '2',
      responsePeople: userEmailDictList.join(','),
      startResponseTime: moment()
        .startOf('month')
        .format('YYYY-MM-DD'),
      endResponseTime: moment()
        .endOf('month')
        .format('YYYY-MM-DD'),
      responseOrType: 'response',
    },
    userEmailDict
  );
  // 商城仅打标量单日
  const appTagedCountOpt = await svcApplication.getApplicationUsersCount(
    {
      statusCode: '0',
      typeCode: 'yes',
      responsePeople: userEmailDictList.join(','),
      startResponseTime: moment().format('YYYY-MM-DD'),
      endResponseTime: moment()
        .add(1, 'day')
        .format('YYYY-MM-DD'),
      responseOrType: 'type',
    },
    userEmailDict
  );
  // 商城仅打标量单 月
  const mounthAppTagedCountOpt = await svcApplication.getApplicationUsersCount(
    {
      statusCode: '0',
      typeCode: 'yes',
      responsePeople: userEmailDictList.join(','),
      startResponseTime: moment()
        .startOf('month')
        .format('YYYY-MM-DD'),
      endResponseTime: moment()
        .endOf('month')
        .format('YYYY-MM-DD'),
      responseOrType: 'type',
    },
    userEmailDict
  );
  // 飞书发送bot
  const excelData = [
    {
      name: 'sheet1',
      data: [],
    },
  ];
  let text = '昵称\t工单处理量\t邮件回复量\t商城回复量\t商城仅打标量 \t月累计\n';
  excelData[0].data.push([ '昵称', '工单处理量', '邮件回复量', '商城回复量', '商城仅打标量', '月累计', ]);
  userList.forEach(userId => {
    // 单日
    const emailReplyCount = emailUsersCount[userId] ? emailUsersCount[userId] : 0;
    const appReplyCount = appReplyCountOpt[userId] ? appReplyCountOpt[userId] : 0;
    const appTagedCount = appTagedCountOpt[userId] ? appTagedCountOpt[userId] : 0;
    const dayNum = dayNumOpt[userId] ? dayNumOpt[userId] : 0;
    // 月
    const mounthIssueCount = mounthIssueNumOpt[userId] ? mounthIssueNumOpt[userId] : 0;
    const mounthEmailCount = mounthEmailCountOpt[userId] ? mounthEmailCountOpt[userId] : 0;
    const mounthReplyCountCount = mounthReplyCountCountOpt[userId] ? mounthReplyCountCountOpt[userId] : 0;
    const mounthAppTagedCount = mounthAppTagedCountOpt[userId] ? mounthAppTagedCountOpt[userId] : 0;
    const monthNum = mounthIssueCount + mounthEmailCount + mounthReplyCountCount + mounthAppTagedCount;

    text +=
      `${userDict[userId]}\t\t${dayNum}\t\t\t${emailReplyCount}\t\t\t` +
      `${appReplyCount}\t\t\t${appTagedCount}\t\t\t${monthNum}\n`;
    excelData[0].data.push([ userDict[userId], dayNum, emailReplyCount, appReplyCount, appTagedCount, monthNum, ]);
  });
  // const res = await svcReport.sendMessage('今日业务数据', text);
  const res = await svcReport.sendMessage2({
    msg_type: 'post',
    content: {
      post: {
        zh_cn: {
          title: '今日业务数据',
          content: [
            [
              {
                tag: 'text',
                text: text,
              },
            ],
          ],
        },
      },
    },
  });
  // const options = {
  //   '!cols': [ { width: 6, }, { width: 12, }, { width: 12, }, { width: 12, }, { width: 14, }, { width: 8, }, ],
  // };
  // const buffer = xlsx.build(excelData, options);
  // const hash = Math.random()
  //   .toString(32)
  //   .slice(2, 10);
  // const excelUrl = await aliOssStore.put(`/datagroup/crawler/today-report-${hash}.xlsx`, buffer);
  // await svcReport.sendMessage2({
  //   msg_type: 'post',
  //   content: {
  //     post: {
  //       zh_cn: {
  //         title: '今日业务数据',
  //         content: [
  //           [
  //             {
  //               tag: 'a',
  //               text: '点击查看业务数据统计',
  //               href: excelUrl,
  //             },
  //           ],
  //         ],
  //       },
  //     },
  //   },
  // });
  ctx.body = res.data;
};

/**
 * 整体工单数据播报
 * @param {*} ctx
 */
const sendPlatformReport = async ctx => {
  const startDayTime = moment()
    .startOf('day')
    .toDate();
  const endDayTime = moment()
    .endOf('day')
    .toDate();
  const startMonthTime = moment()
    .startOf('month')
    .toDate();
  const currentTime = moment().toDate();

  const reqData = {
    startTime: startMonthTime,
    endTime: currentTime,
  };
  const platformTotalData = [];
  for (let i = 0; i < productList.length; i++) {
    const { name, productId, countryList, } = productList[i];
    const sendData = Object.assign(reqData, {
      productId,
      countryList,
    });
    const totalInfo = await svcReport.getPlatformInfo(sendData);
    // 总工单量 - 未受理+受理中+人工工单已解决
    const total = totalInfo.pendingIssue + totalInfo.processingIssue + totalInfo.operateSolvedIssue;
    // 待领取量 - 未受理
    const process = totalInfo.pendingIssue;
    platformTotalData.push({
      productId,
      name,
      total,
      process,
      solved: 0,
    });
  }
  // 已领取量（获取该产品当日客服已领取量）
  for (let i = 0; i < productList.length; i++) {
    const { productId, } = productList[i];
    const detailInfo = await svcReport.getPeopleInfo({
      operateNameList: userList,
      searchInfoType: '1',
      startTime: startDayTime,
      endTime: endDayTime,
      productId,
    });
    const reducer = (acc, cur) => acc + cur.processingIssue + cur.solvedIssue;
    const totalToday = detailInfo.reduce(reducer, 0);
    platformTotalData[i].solved = totalToday;
  }
  const applicationCountOpt = await svcApplication.getApplicationProductCount(applicationProductList);
  const emailCount = await svcApplication.getEmailCount({
    is_read: 0,
    dateGte: moment()
      .startOf('month')
      .format('YYYY-MM-DD'),
    dateLte: moment()
      .add(1, 'day')
      .format('YYYY-MM-DD'),
  });
  const excelData = [
    {
      name: 'sheet1',
      data: [],
    },
  ];
  let text = '产品\t\t月总工单量\t待领取量\t当日已领取\t商城待处理量\t\t邮件待处理量\n';
  excelData[0].data.push([ '产品', '月总工单量', '待领取量', '当日已领取', '商城待处理量', '邮件待处理量', ]);
  platformTotalData.forEach(v => {
    let itemCount = '0';
    let itemCountStr = 0;
    let emailCountStr = '-';
    const totalTab = tabNum(v.total);
    const processTab = tabNum(v.process);
    const nameTab = tabNum(v.name);

    if (applicationCountOpt[v.productId] && v.name !== 'tempo(重点)') {
      itemCount = applicationCountOpt[v.productId] || '-';
      itemCountStr = applicationCountOpt[v.productId] || 0;
    }
    if (+v.productId === 2) {
      emailCountStr = emailCount.totalCount || '-';
    }
    text +=
      `${v.name}${nameTab}${v.total}\t${totalTab}${v.process}\t${processTab}` +
      `${v.solved}${tabNum(v.solved)}\t${itemCount}${tabNum(v.itemCount || '-')}${emailCountStr}\n`;
    excelData[0].data.push([ v.name, v.total, v.process, v.solved, itemCountStr, emailCountStr, ]);
  });
  // const res = await svcReport.sendMessage('今日整体工单数据', text);
  const res = await svcReport.sendMessage2({
    msg_type: 'post',
    content: {
      post: {
        zh_cn: {
          title: '今日整体工单数据',
          content: [
            [
              {
                tag: 'text',
                text: text,
              },
            ],
          ],
        },
      },
    },
  });
  // const options = {
  //   '!cols': [ { width: 12, }, { width: 12, }, { width: 12, }, { width: 12, }, { width: 12, }, { width: 12, }, ],
  // };
  // const buffer = xlsx.build(excelData, options);
  // const hash = Math.random()
  //   .toString(32)
  //   .slice(2, 10);
  // const excelUrl = await aliOssStore.put(`/datagroup/crawler/today-user-${hash}.xlsx`, buffer);
  // await svcReport.sendMessage2({
  //   msg_type: 'post',
  //   content: {
  //     post: {
  //       zh_cn: {
  //         title: '今日整体工单数据',
  //         content: [
  //           [
  //             {
  //               tag: 'a',
  //               text: '点击查看工单数据统计',
  //               href: excelUrl,
  //             },
  //           ],
  //         ],
  //       },
  //     },
  //   },
  // });
  ctx.body = res.data;
};

module.exports = {
  sendPeopleReport,
  sendPlatformReport,
};
