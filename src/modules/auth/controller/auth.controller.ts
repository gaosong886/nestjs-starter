import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDTO } from '../model/dto/login-dto.dto';
import { JwtTokenVO } from '../model/vo/jwt-token.vo';
import { AllowAnonymous } from '../decorator/allow-anonymous.decorator';
import { Request } from 'express';
import { JwtRefreshGuard } from '../guard/jwt-refresh.guard';
import { WinstonService } from '@gaosong886/nestjs-winston';

@Controller('auth')
export class AuthController {
  constructor(
    private logger: WinstonService,
    private authService: AuthService,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @AllowAnonymous()
  @Post('login')
  async login(@Body() loginInputDto: LoginDTO): Promise<JwtTokenVO> {
    return await this.authService.verifySysUser(loginInputDto);
  }

  @AllowAnonymous()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: Request): Promise<JwtTokenVO> {
    return await this.authService.refreshAuthToken(req);
  }
}
