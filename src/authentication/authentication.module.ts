import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './authentication/authentication.service';
import { RegistrationController } from './authentication/registration.controller';
import { JwtStrategy } from './authentication/jwt.strategy';
import { LocalStrategy } from './authentication/local.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: '123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [RegistrationController],
  providers: [AuthenticationService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
