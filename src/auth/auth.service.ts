import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserDocument } from '../user/schemas/user.schema';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayloadInterface } from './interface/JwtPayloadInterface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: CreateUserDto): Promise<UserDocument> {
    const { email } = registerDto;
    try {
      const user = await this.userService.createUser(registerDto);
      return user;
    } catch (e) {
      throw new ConflictException(`this mail: ${email} is ealready exist`);
    }
  }

  async login(loginDto: LoginAuthDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    const found = await this.userService.getUserByEmail(email);
    if (found && (await bcrypt.compare(password, found.password))) {
      const payload: JwtPayloadInterface = { email: email, id: found.id };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken: accessToken };
    } else {
      throw new UnauthorizedException(`please check your login correct`);
    }
  }
}
