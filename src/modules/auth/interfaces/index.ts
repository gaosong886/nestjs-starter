import { JwtTokenPayloadDTO } from '../dtos/jwt-token-payload.dto';

declare module 'express' {
  interface Request {
    user: JwtTokenPayloadDTO;
  }
}
