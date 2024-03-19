import { JwtPayloadDTO } from '../model/dto/jwt-payload.dto';

// 给 Express Application 上下文添加一个 user 属性
// 用来存放 Jwt 解密后的 Payload
declare module 'express' {
  interface Request {
    user: JwtPayloadDTO;
  }
}
