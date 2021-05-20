# VCM工单系统

[![build status](http://gitlab.quvideo.com/WEB/vcm-tool-issue-nodejs/badges/master/build.svg)](http://gitlab.quvideo.com/WEB/vcm-tool-issue-nodejs/commits/master)
[![coverage report](http://gitlab.quvideo.com/WEB/vcm-tool-issue-nodejs/badges/master/coverage.svg)](http://gitlab.quvideo.com/WEB/vcm-tool-issue-nodejs/commits/master)

## 用到的外部接口

- 用到的服务端接口：
  [接口文档](http://restapi.quvideo.com/project/652/interface/api/cat_2588)

- google翻译API
  [文档](https://cloud.google.com/translate/docs/reference/rest/v2/translate)

## 业绩播报

[需求文档](https://quvideo.feishu.cn/docs/doccnX9N28NY4gSZmGy2900ao8b)

**部署：**

需要在[定时任务](https://windmillweb.quvideo.vip/admin)系统上进行设置，由于定时任务系统最大时间只能设置三个月，所以需要手动更新。

整体工单数据播报(每天 8:45 14:00 播报)：

crontab:  45 8 * * *
crontab:  0 14 * * *
```http
http://vcm.quvideo.vip/tool-issue/api/issue-report/platform
```
今日业务数据播报(每天 14:00 18:00 播报)：

crontab:  0 14,18 * * *
```http
http://vcm.quvideo.vip/tool-issue/api/issue-report/people
```

商城违规举报配置建表
```sql
CREATE TABLE IF NOT EXISTS `issue_tipoff_tag` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '逻辑ID',
  `store_type` tinyint(3) NOT NULL DEFAULT '1' COMMENT '应用商城类别 1 google 2 appStore',
  `name` varchar(100) NOT NULL DEFAULT '' COMMENT '举报标签名称',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  `mtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录更新时间',
  `c_user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '创建者id',
  `m_user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '最后修改者id',
  `invalid` tinyint(3) NOT NULL DEFAULT '1' COMMENT '该记录是否有效，1/0，可扩展其他,加索引方便count',
  `report_type` varchar(64) NOT NULL DEFAULT '' COMMENT '举报真实类型对应appstore提供的类型',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uniq_name_store_type` (`name`,`store_type`) USING HASH,
  KEY `idx_invalid` (`invalid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用商城举报标签列表';
```
