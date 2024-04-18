import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthenticationService {
  private readonly users: User[] = [];

  constructor(private readonly jwtService: JwtService) {}

  async login(user: User) {
    const payload = { username: user.username, sub: user.userId };
    return {
      userId: user.userId,
      token: this.jwtService.sign(payload),
      isTwoFactorEnabled: !!user.twoFactorSecret,
    };
  }

  async register(user: User, enableTwoFactor: boolean) {
    if (enableTwoFactor) {
      user.twoFactorSecret = speakeasy.generateSecret({ length: 20 }).base32;
    }
    this.users.push(user);
  }

  async generateTwoFactorSecret() {
    return speakeasy.generateSecret({ length: 20 });
  }

  async verifyTwoFactorToken(token: string, secret: string) {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1,
    });
  }

  async findUserById(userId: number): Promise<User | undefined> {
    return this.users.find((u) => u.userId === userId);
  }

  async findUserByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    return this.users.find(
      (u) => u.username === username && u.password === password,
    );
  }
}
