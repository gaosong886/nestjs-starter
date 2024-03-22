## Nestjs starter

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A nestjs template project featuring a simple solution of role-based access control.

- [中文文档](README.md)  


## Features

| Feature              | Info             | Progress |
| -------------------- | ---------------- | -------- |
| Authentication       | Passport (JWT)   | Done     |
| Authorization        | RBAC             | Done     |
| ORM Integration      | TypeORM          | Done     |
| Caching              | ioredis          | Done     |
| Logging              | winston          | Done     |
| File upload          | multer           | Done     |
| Rate limiting        | nestjs/throttler | Done     |
| Internationalization | nestjs-i18n      | Done     |

There are no unit test specifications in this project. You can add them as needed.

## Resources

- [Frontend Boilerplate](https://github.com/gaosong886/react-antd-starter)

## Setup

First of all, create a `.env` file from the template `.env.template` file.

Generate a pair of secret keys for JWT authentication.

```bash
$ ssh-keygen -t rsa -b 2048 -m PEM -f private.key
$ openssl rsa -in private.key -pubout -outform PEM -out public.key
```

Convert the key files to `base64` to fill in `.env` file.

```bash
# JWT_PRIVATE_KEY_BASE64=
$ base64 -i private.key

# JWT_PUBLIC_KEY_BASE64=
$ base64 -i public.key
```

Launch `MySQL` and `Redis`. Initialize database with `resources/init.sql`, it provides some initial values and settings data.

## Run

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

We can run the project with or without docker. See more in the `package.json` and `Dockerfile`.

## Access Control

`Permission` is automatically generated based on the controller’s path. For instance, consider the following controller:

```Typescript
@Controller('demo')
export class DemoController {
  @Get('list')
  async list(@Req() req: Request): Promise<DemoEntity> {
   // ...
  }
}
```

Upon project startup, a permission string `demo:list` is generated and inserted into the database.

Controller methods with `@AvoidPermission()` decorator will not generate a permission string and user permissions will not be checked.
