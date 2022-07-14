import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserDocument } from '../user/schemas/user.schema';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: CreateUserDto): Promise<UserDocument> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() login: LoginAuthDto): Promise<{ accessToken: string }> {
    return this.authService.login(login);
  }
}
