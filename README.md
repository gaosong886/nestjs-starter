## Nestjs starter

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A nestjs template project featuring a simple solution of role-based access control.

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
- [Live Demo](http://gaosong886.tech)

## Setup

Create a `.env` file from the template `.env.template` file.

- We need to generate a pair of secret keys for JWT authentication, and convert the key files to `base64` to fill in `.env` file.

- If you are not familiar with the way of generating key pair, check this project: [nestjs-starter-rest-api](https://github.com/monstar-lab-oss/nestjs-starter-rest-api), it provide both [with docker](https://github.com/monstar-lab-oss/nestjs-starter-rest-api/blob/master/README.md#with-docker) and [without docker](https://github.com/monstar-lab-oss/nestjs-starter-rest-api/blob/master/README.md#without-docker) solutions.

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
