import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { User } from './user.entity';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

@Controller('auth')
export class RegistrationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('register')
  async register(
    @Body() user: User,
    @Body('enableTwoFactor') enableTwoFactor: boolean,
  ) {
    if (enableTwoFactor) {
      const secret = await this.authService.generateTwoFactorSecret();
      user.twoFactorSecret = secret.base32;
      user.isTwoFactorEnabled = true;
    }
    await this.authService.register(user, enableTwoFactor);
    return { message: 'Пользователь успешно зарегистрирован' };
  }
  @Get('users/:userId')
  async getUserById(@Param('userId') userId: number): Promise<User> {
    const user = await this.authService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('Пользователь с данным ID не найден');
    }
    return user;
  }
  @Post('login')
  async login(@Body() user: User) {
    const loggedUser = await this.authService.findUserByUsernameAndPassword(
      user.username,
      user.password,
    );
    if (!loggedUser) {
      throw new UnauthorizedException('не тот пароль или логин');
    }

    const { token, isTwoFactorEnabled, userId } =
      await this.authService.login(loggedUser);

    return {
      userId,
      token,
      isTwoFactorEnabled,
    };
  }

  @Post('generate-2fa-secret')
  async generateTwoFactorSecret() {
    return this.authService.generateTwoFactorSecret();
  }

  @Post('verify-2fa-token')
  async verifyTwoFactorToken(@Body() data: { token: string; secret: string }) {
    return this.authService.verifyTwoFactorToken(data.token, data.secret);
  }
}
