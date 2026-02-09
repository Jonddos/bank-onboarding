import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private readonly demoUser = {
    username: 'demo',
    password: 'demo123',
  };

  async login(username: string, password: string) {
    if (
      username !== this.demoUser.username ||
      password !== this.demoUser.password
    ) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: username };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: 300, // 5 minutos
    };
  }
}
