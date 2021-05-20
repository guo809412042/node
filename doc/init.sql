/*
 * @Author: highsea.高海
 * @Date: 2019-03-20 16:18:34
 * @Copyright(c) QuVideo F2E Team
 * @Email: hai.gao@quvideo.com
 */

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

use mysql;
-- CREATE USER 'root'@'%' IDENTIFIED BY 'pwdroot';
-- GRANT All privileges ON *.* TO 'root'@'%';
create database vcm_video_info;

DROP TABLE IF EXISTS `base_videos`;

CREATE TABLE `base_videos` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '视频逻辑ID',
  `uuid` varchar(64) NOT NULL DEFAULT '' COMMENT '业务ID-视频唯一id',
  `title` varchar(255) NOT NULL DEFAULT '' COMMENT '视频标题',
  `desc` varchar(255) NOT NULL DEFAULT '' COMMENT '视频描述',
  `video_uri` varchar(255) NOT NULL DEFAULT '' COMMENT '视频播放URI',
  `poster_src` varchar(255) NOT NULL DEFAULT '' COMMENT '视频封面URL',
  `duration` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '视频时长ms',
  `width` varchar(64) NOT NULL DEFAULT '' COMMENT '视频宽度px,dp,sp',
  `height` varchar(64) NOT NULL DEFAULT '' COMMENT '视频高度px,dp,sp',
  `config_path` varchar(64) NOT NULL DEFAULT '' COMMENT '视频配置',
  `c_user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '创建者id',
  `m_user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '最后修改者id',
  `invalid` char(1) NOT NULL DEFAULT 'Y' COMMENT '该记录是否有效，Y/N，可扩展其他 F(fail)',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  `mtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uniq_uuid` (`uuid`),
  KEY `idx_width` (`width`) USING HASH,
  KEY `idx_height` (`height`) USING HASH,
  KEY `idx_duration` (`duration`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='视频业务表';

SET FOREIGN_KEY_CHECKS = 1;


-- mysql -uroot -p
-- SHOW DATABASES;
-- USE tt_upload;
-- SHOW TABLES;