import { JwtPayloadDTO } from '../dtos/jwt-payload.dto';

declare module 'express' {
  interface Request {
    user: JwtPayloadDTO;
  }
}
