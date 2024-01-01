/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80035
 Source Host           : localhost:3306
 Source Schema         : nestjs_starter

 Target Server Type    : MySQL
 Target Server Version : 80035
 File Encoding         : 65001

 Date: 28/12/2023 14:04:38
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_log`;
CREATE TABLE `sys_log`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL DEFAULT 0,
  `ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `params` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `request_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_sys_log_request_at`(`request_at` DESC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` tinyint NOT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '',
  `parent_id` int NOT NULL DEFAULT 0,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '',
  `sort_weight` int NOT NULL DEFAULT 0,
  `hidden` tinyint NOT NULL DEFAULT 0,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES (1, '欢迎', 1, 'HomeOutlined', 0, '/dashboard', 1, 0, '2023-12-21 22:17:29', '2023-12-21 22:17:29');
INSERT INTO `sys_menu` VALUES (2, '系统管理', 0, 'SettingOutlined', 0, '', 2, 0, '2023-12-21 22:18:23', '2023-12-21 22:18:23');
INSERT INTO `sys_menu` VALUES (3, '权限管理', 0, 'SafetyCertificateOutlined', 2, '', 1, 0, '2023-12-21 22:18:58', '2023-12-21 22:18:58');
INSERT INTO `sys_menu` VALUES (4, '菜单列表', 1, 'ProfileOutlined', 3, '/system/auth-management/menu', 1, 0, '2023-12-21 22:19:45', '2023-12-21 22:19:45');
INSERT INTO `sys_menu` VALUES (5, '角色列表', 1, 'UsergroupAddOutlined', 3, '/system/auth-management/role', 2, 0, '2023-12-21 22:22:56', '2023-12-21 22:22:56');
INSERT INTO `sys_menu` VALUES (6, '用户列表', 1, 'UserOutlined', 3, '/system/auth-management/user', 3, 0, '2023-12-21 22:23:12', '2023-12-21 22:23:12');
INSERT INTO `sys_menu` VALUES (7, '系统日志', 1, 'FileProtectOutlined', 2, '/system/log', 2, 0, '2023-12-21 22:25:29', '2023-12-21 22:25:29');
INSERT INTO `sys_menu` VALUES (8, '列表', 2, '', 4, '', 1, 0, '2023-12-21 22:34:48', '2023-12-21 22:34:48');
INSERT INTO `sys_menu` VALUES (9, '新增', 2, '', 4, '', 2, 0, '2023-12-21 22:35:44', '2023-12-21 22:35:44');
INSERT INTO `sys_menu` VALUES (10, '编辑', 2, '', 4, '', 3, 0, '2023-12-21 22:36:04', '2023-12-21 22:36:04');
INSERT INTO `sys_menu` VALUES (11, '删除', 2, '', 4, '', 4, 0, '2023-12-21 22:36:26', '2023-12-21 22:36:26');
INSERT INTO `sys_menu` VALUES (12, '列表', 2, '', 5, '', 1, 0, '2023-12-21 22:37:21', '2023-12-21 22:37:21');
INSERT INTO `sys_menu` VALUES (13, '新增', 2, '', 5, '', 2, 0, '2023-12-21 22:37:51', '2023-12-21 22:37:51');
INSERT INTO `sys_menu` VALUES (14, '编辑', 2, '', 5, '', 3, 0, '2023-12-21 22:39:01', '2023-12-21 22:39:01');
INSERT INTO `sys_menu` VALUES (15, '删除', 2, '', 5, '', 4, 0, '2023-12-21 22:39:35', '2023-12-21 22:39:35');
INSERT INTO `sys_menu` VALUES (16, '列表', 2, '', 6, '', 1, 0, '2023-12-21 22:40:55', '2023-12-21 22:40:55');
INSERT INTO `sys_menu` VALUES (17, '新增', 2, '', 6, '', 2, 0, '2023-12-21 22:41:24', '2023-12-21 22:41:24');
INSERT INTO `sys_menu` VALUES (18, '编辑', 2, '', 6, '', 3, 0, '2023-12-21 22:42:06', '2023-12-21 22:42:06');
INSERT INTO `sys_menu` VALUES (19, '删除', 2, '', 6, '', 4, 0, '2023-12-21 22:42:27', '2023-12-21 22:42:27');
INSERT INTO `sys_menu` VALUES (20, '列表', 2, '', 7, '', 1, 0, '2023-12-21 22:42:52', '2023-12-21 22:42:52');
INSERT INTO `sys_menu` VALUES (21, '删除', 2, '', 7, '', 2, 0, '2023-12-21 22:43:02', '2023-12-21 22:43:02');
INSERT INTO `sys_menu` VALUES (22, '定时任务', 1, 'ClockCircleOutlined', 0, '/schedule', 3, 0, '2023-12-24 16:04:13', '2023-12-24 16:04:13');
INSERT INTO `sys_menu` VALUES (23, '列表', 2, '', 22, '', 1, 0, '2023-12-26 17:52:35', '2023-12-26 17:52:35');
INSERT INTO `sys_menu` VALUES (24, '开关', 2, '', 22, '', 2, 0, '2023-12-26 17:52:46', '2023-12-26 17:52:46');

-- ----------------------------
-- Table structure for sys_menu_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu_permission`;
CREATE TABLE `sys_menu_permission`  (
  `menu_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`menu_id`, `permission_id`) USING BTREE,
  INDEX `IDX_dd18fbdec7e0557b115dd6a0b8`(`menu_id` ASC) USING BTREE,
  INDEX `IDX_901fffe1549e61fab8e6908ab1`(`permission_id` ASC) USING BTREE,
  CONSTRAINT `FK_901fffe1549e61fab8e6908ab18` FOREIGN KEY (`permission_id`) REFERENCES `sys_permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_dd18fbdec7e0557b115dd6a0b8e` FOREIGN KEY (`menu_id`) REFERENCES `sys_menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_menu_permission
-- ----------------------------
INSERT INTO `sys_menu_permission` VALUES (8, 15);
INSERT INTO `sys_menu_permission` VALUES (9, 12);
INSERT INTO `sys_menu_permission` VALUES (9, 13);
INSERT INTO `sys_menu_permission` VALUES (10, 12);
INSERT INTO `sys_menu_permission` VALUES (10, 14);
INSERT INTO `sys_menu_permission` VALUES (10, 16);
INSERT INTO `sys_menu_permission` VALUES (11, 17);
INSERT INTO `sys_menu_permission` VALUES (12, 9);
INSERT INTO `sys_menu_permission` VALUES (13, 6);
INSERT INTO `sys_menu_permission` VALUES (13, 15);
INSERT INTO `sys_menu_permission` VALUES (14, 7);
INSERT INTO `sys_menu_permission` VALUES (14, 15);
INSERT INTO `sys_menu_permission` VALUES (15, 8);
INSERT INTO `sys_menu_permission` VALUES (16, 1);
INSERT INTO `sys_menu_permission` VALUES (17, 4);
INSERT INTO `sys_menu_permission` VALUES (17, 5);
INSERT INTO `sys_menu_permission` VALUES (17, 9);
INSERT INTO `sys_menu_permission` VALUES (18, 2);
INSERT INTO `sys_menu_permission` VALUES (18, 5);
INSERT INTO `sys_menu_permission` VALUES (18, 9);
INSERT INTO `sys_menu_permission` VALUES (19, 3);
INSERT INTO `sys_menu_permission` VALUES (20, 18);
INSERT INTO `sys_menu_permission` VALUES (21, 19);
INSERT INTO `sys_menu_permission` VALUES (23, 20);
INSERT INTO `sys_menu_permission` VALUES (24, 21);

-- ----------------------------
-- Table structure for sys_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_permission`;
CREATE TABLE `sys_permission`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_sys_permission_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_permission
-- ----------------------------
INSERT INTO `sys_permission` VALUES (1, 'sys-user:page', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (2, 'sys-user:update', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (3, 'sys-user:delete', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (4, 'sys-user:create', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (5, 'sys-user:photo', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (6, 'sys-role:create', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (7, 'sys-role:update', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (8, 'sys-role:delete', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (9, 'sys-role:list', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (10, 'sys-permission:init', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (11, 'sys-permission:page', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (12, 'sys-permission:list', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (13, 'sys-menu:create', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (14, 'sys-menu:update', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (15, 'sys-menu:list', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (16, 'sys-menu:hide', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (17, 'sys-menu:delete', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (18, 'sys-log:page', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (19, 'sys-log:truncate', '2023-12-21 21:01:31', '2023-12-21 21:01:31');
INSERT INTO `sys_permission` VALUES (20, 'scheduled-task:list', '2023-12-24 18:20:26', '2023-12-24 18:20:26');
INSERT INTO `sys_permission` VALUES (21, 'scheduled-task:switch', '2023-12-24 18:21:31', '2023-12-24 18:21:31');

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_sys_role_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES (1, '系统管理员', '系统管理员有所有权限', '2023-12-21 22:00:22', '2023-12-21 22:00:22');

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu`  (
  `menu_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`menu_id`, `role_id`) USING BTREE,
  INDEX `IDX_543ffcaa38d767909d9022f252`(`menu_id` ASC) USING BTREE,
  INDEX `IDX_b65fa84413c357d7282153b4a8`(`role_id` ASC) USING BTREE,
  CONSTRAINT `FK_543ffcaa38d767909d9022f2522` FOREIGN KEY (`menu_id`) REFERENCES `sys_menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_b65fa84413c357d7282153b4a88` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
INSERT INTO `sys_role_menu` VALUES (1, 1);
INSERT INTO `sys_role_menu` VALUES (2, 1);
INSERT INTO `sys_role_menu` VALUES (3, 1);
INSERT INTO `sys_role_menu` VALUES (4, 1);
INSERT INTO `sys_role_menu` VALUES (5, 1);
INSERT INTO `sys_role_menu` VALUES (6, 1);
INSERT INTO `sys_role_menu` VALUES (7, 1);
INSERT INTO `sys_role_menu` VALUES (8, 1);
INSERT INTO `sys_role_menu` VALUES (9, 1);
INSERT INTO `sys_role_menu` VALUES (10, 1);
INSERT INTO `sys_role_menu` VALUES (11, 1);
INSERT INTO `sys_role_menu` VALUES (12, 1);
INSERT INTO `sys_role_menu` VALUES (13, 1);
INSERT INTO `sys_role_menu` VALUES (14, 1);
INSERT INTO `sys_role_menu` VALUES (15, 1);
INSERT INTO `sys_role_menu` VALUES (16, 1);
INSERT INTO `sys_role_menu` VALUES (17, 1);
INSERT INTO `sys_role_menu` VALUES (18, 1);
INSERT INTO `sys_role_menu` VALUES (19, 1);
INSERT INTO `sys_role_menu` VALUES (20, 1);
INSERT INTO `sys_role_menu` VALUES (21, 1);
INSERT INTO `sys_role_menu` VALUES (22, 1);
INSERT INTO `sys_role_menu` VALUES (23, 1);
INSERT INTO `sys_role_menu` VALUES (24, 1);

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '',
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `account_status` tinyint NOT NULL DEFAULT 0,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_sys_user_username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, '', 'Gao Song', 'admin', '$2a$10$a5ksxl/djxZpr7RyD5u0WOsFFZKO/9zvXMZ8EQJCR6x1C.IJod51O', 0, '', '2023-12-21 22:00:22', '2023-12-21 22:00:22');

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role`  (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`) USING BTREE,
  INDEX `IDX_71b4edf9aedbd3e5707156e80a`(`user_id` ASC) USING BTREE,
  INDEX `IDX_e8300bfcf561ed417f5f02c677`(`role_id` ASC) USING BTREE,
  CONSTRAINT `FK_71b4edf9aedbd3e5707156e80a2` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_e8300bfcf561ed417f5f02c6776` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES (1, 1);

SET FOREIGN_KEY_CHECKS = 1;
