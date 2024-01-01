import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginInputDTO } from '../dtos/login-input.dto';
import { JwtTokenOutputDTO } from '../dtos/jwt-token-output.dto';
import { AllowAnonymous } from '../decorators/allow-anonymous.decorator';
import { Request } from 'express';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
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
  async login(
    @Body() loginInputDto: LoginInputDTO,
  ): Promise<JwtTokenOutputDTO> {
    return await this.authService.validateSysUser(loginInputDto);
  }

  @AllowAnonymous()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: Request): Promise<JwtTokenOutputDTO> {
    return await this.authService.refreshAuthToken(req);
  }
}
