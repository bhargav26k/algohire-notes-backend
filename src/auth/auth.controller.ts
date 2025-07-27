import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
refresh(@Body('refreshToken') refreshToken: string) {
  return this.authService.refresh(refreshToken);
}

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    if (!username?.trim()) {
      throw new BadRequestException('Username query param is required');
    }
    const taken = await this.authService.isUsernameTaken(username);
    return { available: !taken };
  }


}
