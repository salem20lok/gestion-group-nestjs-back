import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/guards/get-user.decorator';
import { UserInterface } from './interface/user-interface';
import { RolesGuard } from '../auth/authorization/roles.guard';
import { Roles } from '../auth/authorization/roles.decorator';
import { RoleEnum } from '../auth/authorization/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() userDto: CreateUserDto): Promise<UserDocument> {
    return this.userService.createUser(userDto);
  }

  @Get()
  getAllUser(): Promise<UserDocument[]> {
    return this.userService.getAllUser();
  }

  @Get('identification')
  @UseGuards(JwtAuthGuard)
  identification(@GetUser() id: string): Promise<UserInterface> {
    return this.userService.identification(id);
  }

  @Get(':id')
  getUser(@Param('id') id: string): Promise<UserDocument> {
    return this.userService.getUser(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUser: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    return this.userService.updateUser(id, updateUser);
  }
}
