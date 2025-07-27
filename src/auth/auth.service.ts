import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity'; 
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    // 1. Check email uniqueness
    if (await this.userRepo.findOne({ where: { email: dto.email } })) {
      throw new BadRequestException('Email already in use')
    }
    // 2. Check username uniqueness
    if (await this.userRepo.findOne({ where: { username: dto.username } })) {
      throw new BadRequestException('Username already taken')
    }
    const hash = await bcrypt.hash(dto.password, 10);
const user = this.userRepo.create({
      username: dto.username,
      name: dto.name,
      email: dto.email,
      password: hash,
    })

    await this.userRepo.save(user);

    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, username: user.username, name: user.name };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRY || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
    });

    return { accessToken, refreshToken, user: user.toJSON()  };
  }

  async refresh(token: string) {
  try {
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('User not found');

    return this.generateTokens(user);
  } catch (err) {
    throw new UnauthorizedException('Invalid or expired refresh token');
  }
}

}
