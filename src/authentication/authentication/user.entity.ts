export interface User {
  userId: number;
  username: string;
  password: string;
  twoFactorSecret?: string;
  isTwoFactorEnabled?: boolean;
}
