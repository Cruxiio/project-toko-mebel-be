import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { Response } from 'express';
// import { UserRepository } from 'src/user/user.repository';
import { loginResponse, TokenPayload } from './dto/token-payload.interface';
import { UserRepository } from 'src/database/mongodb/repositories/user.repository';
import { User } from 'src/database/mongodb/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // buat jwt key dari user yang sudah authenticated
  async login(user: User, response: Response) {
    // set access token expire time to 1 hour
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_MS',
          ),
        ),
    );

    //buat payload
    const payload: TokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    // buat jwt access token
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_ACCESS_TOKEN_EXPIRATION_MS',
      )}ms`,
    });

    // response.cookie('Authentication', accessToken, {
    //   expires: expiresAccessToken,
    //   httpOnly: true,
    // });

    // buat response
    const res: loginResponse = {
      message: 'Login success',
      accessToken: accessToken,
      role: user.role,
    };

    return res;
  }

  // fungsi untuk verify user apakah valid atau tidak
  async verifyUser(username: string, password: string) {
    try {
      // cari user berdasarkan username
      const user = await this.userRepo.findOne({ username });
      // cek password sesuai atau tidak
      const autheticated = await compare(password, user.password);
      if (!autheticated) {
        throw new UnauthorizedException('Invalid password');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
