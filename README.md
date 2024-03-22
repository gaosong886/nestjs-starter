## Nestjs starter

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

一个使用 Nest.js 构建的后端模板项目，遵循 Nest.js 倡导的模块化代码组织设计理念，提供了一个简单的基于角色的访问控制解决方案。


- [English Doc](README_en.md)  


## 功能

| 功能 | 方案 | 进度 |
| -- | -- | -- |
| 认证 | Passport (JWT) | 已完成 |
| 鉴权 | RBAC (基于角色的访问控制) | 已完成     |
| ORM 集成 | TypeORM | 已完成 |
| 缓存 | ioredis | 已完成 |
| 日志 | winston | 已完成 |
| 文件上传 | multer | 已完成 |
| 限流 | nestjs/throttler | 已完成 |
| 多语言 | nestjs-i18n | 已完成 |

项目中目前没有包含单元测试规范，请根据需要添加。

## 资源

- [前端模板](https://github.com/gaosong886/react-antd-starter)

## 配置

首先，参考模板文件 `.env.template` 创建一个 `.env` 文件。

生成一对用于 JWT 认证的 RSA 密钥。

```bash
$ ssh-keygen -t rsa -b 2048 -m PEM -f private.key
$ openssl rsa -in private.key -pubout -outform PEM -out public.key
```

将密钥文件转换为 base64 格式，复制 base64 文本填写到 .env 文件中。

```bash
# JWT_PRIVATE_KEY_BASE64=
$ base64 -i private.key

# JWT_PUBLIC_KEY_BASE64=
$ base64 -i public.key
```

启动 MySQL 和 Redis。使用 `resources/init.sql` 初始化数据库，里面提供项目启动所需的初始数据。

## 启动项目

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

也可以使用 Docker 来运行项目，更多信息请查看项目根目录下的 `package.json` 和 `Dockerfile`。

## 关于访问控制

项目基于 RBAC 模型进行访问控制，涉及到的元素有 `用户 (User)`，`角色 (Role)`，`菜单 (Menu)`，`权限 (Permission)`。

其中 `权限 (Permission)` 是基于控制器的路径自动生成的。例如，当项目中有下面的控制器：

```Typescript
@Controller('demo')
export class DemoController {
  @Get('list')
  async list(@Req() req: Request): Promise<DemoEntity> {
   // ...
  }
}
```

在项目启动时，会自动生成一个权限字符串 `demo:list` 并将其插入到数据库中，我们在后台可以把 `权限 (Permission)` 和 `菜单 (Menu)` 进行关联。

使用 `@AvoidPermission()` 装饰器的控制器方法不会生成权限字符串，在被访问时也不会检查权限。
