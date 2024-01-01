import { Global, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { STRATEGY_JWT_AUTH } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { ConfigService } from '@nestjs/config';
import { SysUserModule } from '../sys-user/sys-user.module';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: STRATEGY_JWT_AUTH }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        publicKey: configService.get<string>('jwt.publicKey'),
        privateKey: configService.get<string>('jwt.privateKey'),
        signOptions: {
          algorithm: 'RS256',
        },
      }),
      inject: [ConfigService],
    }),
    SysUserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthStrategy, JwtRefreshStrategy],
  exports: [JwtAuthStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
