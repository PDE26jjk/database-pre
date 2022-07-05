/*
 Navicat MySQL Data Transfer

 Source Server         : 192.168.3.104
 Source Server Type    : MySQL
 Source Server Version : 80029
 Source Host           : 192.168.3.104:3306
 Source Schema         : travel

 Target Server Type    : MySQL
 Target Server Version : 80029
 File Encoding         : 65001

 Date: 04/07/2022 01:11:08
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for guides
-- ----------------------------
DROP TABLE IF EXISTS `guides`;
CREATE TABLE `guides`  (
  `uid` int(0) NOT NULL,
  `work_time` decimal(5, 2) NULL DEFAULT 0.00,
  PRIMARY KEY (`uid`) USING BTREE,
  CONSTRAINT `uidss` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of guides
-- ----------------------------
INSERT INTO `guides` VALUES (10009, 2.00);
INSERT INTO `guides` VALUES (10018, 5.00);
INSERT INTO `guides` VALUES (10020, 500.00);

-- ----------------------------
-- Table structure for routes
-- ----------------------------
DROP TABLE IF EXISTS `routes`;
CREATE TABLE `routes`  (
  `rid` int(0) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `min_members_number` int(0) NULL DEFAULT 0,
  `max_members_number` int(0) NULL DEFAULT 0,
  `cost` decimal(10, 2) NULL DEFAULT NULL,
  `image_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `deleted` tinyint(0) NULL DEFAULT 0,
  `create_time` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `duration` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`rid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1024 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of routes
-- ----------------------------
INSERT INTO `routes` VALUES (1017, '科里拿第尔契市', 3, 0, 799.00, '6e9dea2457b0e15cd3dde1f00.png', '位于11号悬浮岛，特产是叶菜羊肉卷', 0, '2022-07-03 03:00:53', 3);
INSERT INTO `routes` VALUES (1018, '28号浮空岛', 2, 2, 129.00, '6e3ae90c202ade8dd75a61100.png', '28号浮空岛,天空中最繁华的城市之一。拥有集合市场街，古老的塔楼等景点', 0, '2022-07-03 03:53:42', 3);
INSERT INTO `routes` VALUES (1019, '68号岛妖精仓库', 5, 0, 999.00, 'd331e25672dc842d5f3dae200.png', '妖精仓库是一座由护翼军和奥尔兰多商会共同创立和管理的武器仓库和养育院。在护翼军的文件中，妖精仓库被称作“特别武器仓库”，作为这些女孩的一个秘密庇护所而存在着。', 0, '2022-07-03 04:14:25', 4);
INSERT INTO `routes` VALUES (1020, '15号浮空岛', 3, 0, 998.00, '6e9dea2457b0e15cd3dde1f01.png', '不可能存活的战场，与第六兽进行生死搏斗', 0, '2022-07-03 04:38:31', 2);
INSERT INTO `routes` VALUES (1021, '2号浮游岛圣域', 4, 0, 98.00, '6e9dea2457b0e15cd3dde1f02.png', '黑烛公所在地', 0, '2022-07-03 04:45:09', 2);
INSERT INTO `routes` VALUES (1022, '梦境之旅', 1, 0, 50.00, '6e9dea2457b0e15cd3dde1f04.png', '一起探索梦幻般的世界', 0, '2022-07-03 04:52:24', 7);
INSERT INTO `routes` VALUES (1023, '49号浮游岛', 3, 0, 699.00, '6e9dea2457b0e15cd3dde1f05.png', '49号浮空岛是护翼军的总部所在地，有一个风景秀丽的小镇，有面包店和购物区。', 0, '2022-07-03 05:05:19', 4);
INSERT INTO `routes` VALUES (1024, '降临地表', 3, 0, 399.00, '5803c900355582e44b1b1d601.png', '无。。', 0, '2022-07-03 07:22:29', 1);

-- ----------------------------
-- Table structure for teams
-- ----------------------------
DROP TABLE IF EXISTS `teams`;
CREATE TABLE `teams`  (
  `tid` int(0) NOT NULL AUTO_INCREMENT,
  `rid` int(0) NULL DEFAULT NULL,
  `gid` int(0) NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `members_number` int(0) NULL DEFAULT 0,
  `create_time` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `status` int(0) NOT NULL DEFAULT 0 COMMENT '0：未成团，1：已成团，2：已出发，3：已返回',
  `gross_income` decimal(6, 2) NULL DEFAULT 0.00,
  `can_join` tinyint(0) NOT NULL DEFAULT 1,
  `set_out_time` datetime(0) NULL DEFAULT NULL,
  `deleted` tinyint(0) NULL DEFAULT 0,
  PRIMARY KEY (`tid`) USING BTREE,
  INDEX `rids`(`rid`) USING BTREE,
  INDEX `gids`(`gid`) USING BTREE,
  CONSTRAINT `rids` FOREIGN KEY (`rid`) REFERENCES `routes` (`rid`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `gids` FOREIGN KEY (`gid`) REFERENCES `guides` (`uid`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 46 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of teams
-- ----------------------------
INSERT INTO `teams` VALUES (19, 1017, NULL, '科里拿第尔契市团队1', 2, '2022-07-03 03:08:40', 0, 1598.00, 1, '2022-07-03 08:00:00', 0);
INSERT INTO `teams` VALUES (20, 1017, NULL, '科里拿第尔契市2', 2, '2022-07-03 03:09:00', 0, 1598.00, 1, '2022-07-04 00:08:00', 0);
INSERT INTO `teams` VALUES (21, 1018, 10009, '集合市场街', 2, '2022-07-03 03:56:05', 3, 258.00, 1, '2022-06-01 00:00:00', 0);
INSERT INTO `teams` VALUES (22, 1019, NULL, '资料室查找', 5, '2022-07-03 04:20:10', 1, 4995.00, 1, '2022-07-05 00:00:00', 0);
INSERT INTO `teams` VALUES (23, 1018, NULL, '最高的钟楼', 2, '2022-07-03 04:32:23', 1, 129.00, 1, '2022-07-07 00:17:30', 0);
INSERT INTO `teams` VALUES (24, 1020, 10020, '异常的侵蚀', 3, '2022-07-03 04:39:23', 3, 2994.00, 1, '2022-06-28 00:00:00', 0);
INSERT INTO `teams` VALUES (25, 1021, NULL, '邪恶神殿', 2, '2022-07-03 04:45:52', 0, 196.00, 1, '2022-07-03 04:46:15', 0);
INSERT INTO `teams` VALUES (26, 1021, NULL, '妖精与圣剑', 3, '2022-07-03 04:47:52', 0, 294.00, 1, '2022-07-26 00:02:00', 0);
INSERT INTO `teams` VALUES (27, 1022, 10020, '迷之幻梦', 2, '2022-07-03 04:52:49', 3, 100.00, 1, '1970-01-01 08:00:00', 0);
INSERT INTO `teams` VALUES (28, 1023, 10018, '护翼军的总部参观', 3, '2022-07-03 05:09:08', 3, 2097.00, 1, '2022-07-16 00:00:00', 0);
INSERT INTO `teams` VALUES (29, 1023, 10018, '护翼军的总部参观2', 3, '2022-07-03 05:09:11', 3, 2097.00, 1, '2022-07-16 00:00:00', 0);
INSERT INTO `teams` VALUES (30, 1023, NULL, '护翼军的总部参观2', 0, '2022-07-03 05:09:11', 0, 0.00, 1, '2022-07-16 00:00:00', 1);
INSERT INTO `teams` VALUES (31, 1017, 10018, '正义之名1', 3, '2022-07-03 06:17:34', 3, 2397.00, 1, '2022-07-03 00:03:51', 0);
INSERT INTO `teams` VALUES (32, 1017, 10018, '正义之名2', 3, '2022-07-03 06:17:43', 3, 2397.00, 1, '2022-07-04 00:03:51', 0);
INSERT INTO `teams` VALUES (33, 1017, 10009, '正义之名3', 3, '2022-07-03 06:17:49', 3, 2397.00, 1, '2022-07-05 00:03:51', 0);
INSERT INTO `teams` VALUES (34, 1019, NULL, '剑术体验1', 4, '2022-07-03 06:19:37', 0, 2997.00, 1, '2022-07-04 00:00:00', 0);
INSERT INTO `teams` VALUES (35, 1019, NULL, '剑术体验2', 5, '2022-07-03 06:19:44', 3, 3996.00, 1, '2022-07-06 00:00:00', 0);
INSERT INTO `teams` VALUES (36, 1019, NULL, '剑术体验3', 5, '2022-07-03 06:19:52', 1, 2997.00, 1, '2022-07-08 00:00:00', 0);
INSERT INTO `teams` VALUES (37, 1020, 10009, '无尽的战斗', 3, '2022-07-03 06:21:02', 3, 2994.00, 1, '2022-07-12 00:00:00', 0);
INSERT INTO `teams` VALUES (38, 1020, 10009, '无尽的战斗2', 4, '2022-07-03 06:21:14', 3, 3992.00, 1, '2022-07-12 00:00:00', 0);
INSERT INTO `teams` VALUES (39, 1020, 10009, '无尽的战斗3', 3, '2022-07-03 06:21:16', 3, 2994.00, 1, '2022-07-12 00:00:00', 0);
INSERT INTO `teams` VALUES (40, 1021, NULL, '邪恶神殿2', 4, '2022-07-03 06:21:36', 3, 294.00, 1, '2022-07-19 00:00:00', 0);
INSERT INTO `teams` VALUES (41, 1021, NULL, '贤者与骷髅', 3, '2022-07-03 06:21:56', 0, 294.00, 1, '2022-07-27 00:00:00', 0);
INSERT INTO `teams` VALUES (42, 1022, 10020, '记忆拼接', 2, '2022-07-03 06:22:20', 3, 100.00, 1, '2022-07-14 00:00:00', 0);
INSERT INTO `teams` VALUES (43, 1022, 10020, '记忆拼接(圣)', 2, '2022-07-03 06:22:46', 3, 100.00, 1, '2022-07-21 00:00:00', 0);
INSERT INTO `teams` VALUES (44, 1023, NULL, '惬意的午后', 3, '2022-07-03 06:23:19', 1, 2097.00, 1, '2022-07-09 00:00:00', 0);
INSERT INTO `teams` VALUES (45, 1023, 10009, '惬意的午后2', 3, '2022-07-03 06:23:22', 3, 2097.00, 1, '2022-07-09 00:00:00', 0);
INSERT INTO `teams` VALUES (46, 1024, 10020, '幸福之义', 3, '2022-07-03 07:25:05', 3, 1197.00, 1, '2022-07-03 10:23:27', 0);

-- ----------------------------
-- Table structure for user_team
-- ----------------------------
DROP TABLE IF EXISTS `user_team`;
CREATE TABLE `user_team`  (
  `uid` int(0) NOT NULL,
  `tid` int(0) NOT NULL,
  `has_pay` tinyint(0) NULL DEFAULT 0,
  `score` tinyint(0) NULL DEFAULT 0,
  PRIMARY KEY (`uid`, `tid`) USING BTREE,
  INDEX `tids`(`tid`) USING BTREE,
  CONSTRAINT `uids` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `tids` FOREIGN KEY (`tid`) REFERENCES `teams` (`tid`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_team
-- ----------------------------
INSERT INTO `user_team` VALUES (10009, 20, 1, 0);
INSERT INTO `user_team` VALUES (10009, 21, 1, 5);
INSERT INTO `user_team` VALUES (10009, 22, 1, 0);
INSERT INTO `user_team` VALUES (10009, 23, 0, 0);
INSERT INTO `user_team` VALUES (10009, 24, 1, 2);
INSERT INTO `user_team` VALUES (10009, 27, 1, 4);
INSERT INTO `user_team` VALUES (10009, 36, 0, 0);
INSERT INTO `user_team` VALUES (10009, 37, 1, 1);
INSERT INTO `user_team` VALUES (10009, 38, 1, 2);
INSERT INTO `user_team` VALUES (10009, 39, 1, 2);
INSERT INTO `user_team` VALUES (10009, 42, 1, 4);
INSERT INTO `user_team` VALUES (10009, 43, 1, 5);
INSERT INTO `user_team` VALUES (10009, 46, 1, 3);
INSERT INTO `user_team` VALUES (10010, 19, 1, 0);
INSERT INTO `user_team` VALUES (10010, 20, 1, 0);
INSERT INTO `user_team` VALUES (10010, 21, 1, 5);
INSERT INTO `user_team` VALUES (10010, 22, 1, 0);
INSERT INTO `user_team` VALUES (10010, 23, 1, 0);
INSERT INTO `user_team` VALUES (10010, 25, 1, 0);
INSERT INTO `user_team` VALUES (10010, 26, 1, 0);
INSERT INTO `user_team` VALUES (10010, 28, 1, 3);
INSERT INTO `user_team` VALUES (10010, 29, 1, 5);
INSERT INTO `user_team` VALUES (10010, 34, 1, 0);
INSERT INTO `user_team` VALUES (10010, 35, 1, 4);
INSERT INTO `user_team` VALUES (10010, 36, 1, 0);
INSERT INTO `user_team` VALUES (10010, 40, 1, 3);
INSERT INTO `user_team` VALUES (10010, 41, 1, 0);
INSERT INTO `user_team` VALUES (10010, 44, 1, 0);
INSERT INTO `user_team` VALUES (10010, 45, 1, 4);
INSERT INTO `user_team` VALUES (10010, 46, 1, 5);
INSERT INTO `user_team` VALUES (10011, 34, 0, 0);
INSERT INTO `user_team` VALUES (10011, 35, 0, 0);
INSERT INTO `user_team` VALUES (10012, 22, 1, 0);
INSERT INTO `user_team` VALUES (10012, 35, 1, 0);
INSERT INTO `user_team` VALUES (10012, 36, 0, 0);
INSERT INTO `user_team` VALUES (10013, 22, 1, 0);
INSERT INTO `user_team` VALUES (10013, 24, 1, 3);
INSERT INTO `user_team` VALUES (10013, 31, 1, 5);
INSERT INTO `user_team` VALUES (10013, 32, 1, 4);
INSERT INTO `user_team` VALUES (10013, 33, 1, 4);
INSERT INTO `user_team` VALUES (10013, 34, 1, 0);
INSERT INTO `user_team` VALUES (10013, 35, 1, 5);
INSERT INTO `user_team` VALUES (10013, 36, 1, 0);
INSERT INTO `user_team` VALUES (10013, 37, 1, 3);
INSERT INTO `user_team` VALUES (10013, 38, 1, 3);
INSERT INTO `user_team` VALUES (10013, 39, 1, 3);
INSERT INTO `user_team` VALUES (10013, 46, 1, 4);
INSERT INTO `user_team` VALUES (10014, 24, 1, 3);
INSERT INTO `user_team` VALUES (10014, 29, 1, 5);
INSERT INTO `user_team` VALUES (10014, 31, 1, 4);
INSERT INTO `user_team` VALUES (10014, 32, 1, 4);
INSERT INTO `user_team` VALUES (10014, 33, 1, 3);
INSERT INTO `user_team` VALUES (10014, 37, 1, 2);
INSERT INTO `user_team` VALUES (10014, 38, 1, 3);
INSERT INTO `user_team` VALUES (10014, 39, 1, 3);
INSERT INTO `user_team` VALUES (10014, 45, 1, 4);
INSERT INTO `user_team` VALUES (10015, 28, 1, 4);
INSERT INTO `user_team` VALUES (10015, 29, 1, 5);
INSERT INTO `user_team` VALUES (10015, 44, 1, 0);
INSERT INTO `user_team` VALUES (10015, 45, 1, 4);
INSERT INTO `user_team` VALUES (10016, 19, 1, 0);
INSERT INTO `user_team` VALUES (10016, 22, 1, 0);
INSERT INTO `user_team` VALUES (10016, 25, 1, 0);
INSERT INTO `user_team` VALUES (10016, 26, 1, 0);
INSERT INTO `user_team` VALUES (10016, 31, 1, 5);
INSERT INTO `user_team` VALUES (10016, 32, 1, 5);
INSERT INTO `user_team` VALUES (10016, 33, 1, 5);
INSERT INTO `user_team` VALUES (10016, 34, 1, 0);
INSERT INTO `user_team` VALUES (10016, 35, 1, 0);
INSERT INTO `user_team` VALUES (10016, 36, 1, 0);
INSERT INTO `user_team` VALUES (10016, 40, 1, 0);
INSERT INTO `user_team` VALUES (10016, 41, 1, 0);
INSERT INTO `user_team` VALUES (10017, 26, 1, 0);
INSERT INTO `user_team` VALUES (10017, 28, 1, 0);
INSERT INTO `user_team` VALUES (10017, 38, 1, 0);
INSERT INTO `user_team` VALUES (10017, 40, 0, 0);
INSERT INTO `user_team` VALUES (10017, 41, 1, 0);
INSERT INTO `user_team` VALUES (10019, 40, 1, 0);
INSERT INTO `user_team` VALUES (10019, 44, 1, 0);
INSERT INTO `user_team` VALUES (10020, 27, 1, 4);
INSERT INTO `user_team` VALUES (10020, 42, 1, 3);
INSERT INTO `user_team` VALUES (10020, 43, 1, 3);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `uid` int(0) NOT NULL AUTO_INCREMENT,
  `pwd` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'password',
  `is_admin` tinyint(0) NOT NULL DEFAULT 0,
  `is_guide` tinyint(0) UNSIGNED NOT NULL DEFAULT 0,
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '姓名',
  `tel` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '电话',
  `identification` char(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '身份证号',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像文件路径',
  `gender` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '性别',
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10008 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (10009, '123456', 1, 1, '珂朵莉', '珂朵莉·诺塔·瑟尼欧里斯', '13825468752', NULL, '62897c63dac938828cae9b100.png', '女');
INSERT INTO `users` VALUES (10010, '123456', 0, 0, '威廉', '威廉·克梅修', NULL, NULL, '62897c63dac938828cae9b101.png', '男');
INSERT INTO `users` VALUES (10011, '123456', 0, 0, '莉莉娅', '莉莉娅·阿斯普雷伊', NULL, NULL, '62897c63dac938828cae9b103.png', '女');
INSERT INTO `users` VALUES (10012, '123456', 0, 0, '兰朵露可', '兰朵露可·伊瑟利·赫斯托利亚', NULL, NULL, '62897c63dac938828cae9b104.png', '女');
INSERT INTO `users` VALUES (10013, '123456', 0, 0, '奈芙莲', '奈芙莲·卢可·印萨尼亚', NULL, NULL, '62897c63dac938828cae9b105.png', '女');
INSERT INTO `users` VALUES (10014, '123456', 0, 0, '艾瑟雅', '艾瑟雅·麦杰·瓦尔卡利斯', NULL, NULL, '62897c63dac938828cae9b106.png', '女');
INSERT INTO `users` VALUES (10015, '123456', 0, 0, '诺夫特', '诺夫特·K·迪斯佩拉提奥', NULL, NULL, '62897c63dac938828cae9b107.png', '女');
INSERT INTO `users` VALUES (10016, '123456', 0, 0, '缇亚忒', '缇亚忒·示巴·伊格纳雷奥', NULL, NULL, '62897c63dac938828cae9b108.png', '女');
INSERT INTO `users` VALUES (10017, '123456', 0, 0, '灰岩皮', '灰岩皮', NULL, NULL, '62897c63dac938828cae9b109.png', '男');
INSERT INTO `users` VALUES (10018, '123456', 0, 1, '妮戈兰', '妮戈兰·阿斯塔图斯', '13825463333', NULL, '62897c63dac938828cae9b10a.png', '女');
INSERT INTO `users` VALUES (10019, '123456', 0, 0, '葛力克', '葛力克·葛雷克拉可', NULL, NULL, '62897c63dac938828cae9b10b.png', '男');
INSERT INTO `users` VALUES (10020, '123456', 0, 1, '艾陆可', '艾陆可·霍克斯登', '13835891759', NULL, '6e9dea2457b0e15cd3dde1f03.png', '女');
INSERT INTO `users` VALUES (10021, '123456', 0, 0, 'pde', 'PDE', '12386423358', NULL, '5803c900355582e44b1b1d600.png', '男');

SET FOREIGN_KEY_CHECKS = 1;
